<template>
  <div class="page">
    <van-nav-bar title="在线书源">
      <template #left>
        <div class="cancel header-button" v-show="state.selectedId.size > 0" @click="emptySet">
          取消</div
        >
      </template>
      <template #right>
        <div class="install header-button" v-show="state.selectedId.size > 0" @click="installAll"
          >安装</div
        >
      </template>
    </van-nav-bar>
    <div class="source-list">
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="state.loading"
          :finished="state.finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            v-for="item in state.source"
            :key="item.id"
            :value="item.url"
            @click="selectCard(item.id)"
            class="src-card"
            :class="{ 'card-selected': state.selectedId.has(item.id) }"
          >
            <div class="title-wrapper">
              <div class="title">
                {{ item.name }}
              </div>
              <div class="buttons-wrapper">
                <div class="button orange" @click.stop="toDetail(item.id)"> 详情 </div>
                <div class="button blue"> 安装 </div>
              </div>
            </div>
            <div class="body-wrapper">
              <div class="tag"> 贡献者：{{ item.shareUsername }} </div>
              <div class="tag"> 目标地址：{{ item.url }} </div>
              <div class="tag"> 更新时间：{{ item.updateTime }} </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive } from '@vue/runtime-core'
  import { NavBar, PullRefresh, CellGroup, Cell, List, Toast } from 'vant'
  import { repoList, batchImport } from '@/api/index'
  import { useRouter } from 'vue-router'

  export default defineComponent({
    components: {
      [NavBar.name]: NavBar,
      [PullRefresh.name]: PullRefresh,
      [CellGroup.name]: CellGroup,
      [Cell.name]: Cell,
      [List.name]: List,
      [Toast.name]: Toast
    },
    setup() {
      const router = useRouter()
      const state = reactive({
        page: 0,
        refreshing: false,
        loading: true,
        finished: false,
        source: [] as object[],
        selectedId: new Set()
      })
      onMounted(() => {
        console.log('mounted')
      })
      const onRefresh = () => {
        console.log('-->', '下拉刷新')
        state.selectedId = new Set()
        state.source = []
        state.page = 0
        state.loading = true
        onLoad()
      }
      const onLoad = () => {
        console.log('-->', '读取更多')
        if (state.refreshing) state.refreshing = false
        state.page++
        repoList(state.page).then((res) => {
          let list: object[] = Array.from(res as any)
          state.source.push(...list)
          state.loading = false
        })
      }
      const toDetail = (id: any) => {
        router.push({
          name: 'Info',
          query: {
            id
          }
        })
      }
      const selectCard = (id: any) => {
        state.selectedId.has(id) ? state.selectedId.delete(id) : state.selectedId.add(id)
      }
      const emptySet = () => {
        state.selectedId = new Set()
      }
      const installAll = () => {
        let arr = Array.from(state.selectedId).join(',')
        Toast.loading({
          message: '请求中……',
          forbidClick: true
        })
        batchImport(arr)
          .then((res) => {
            console.log('-->', '安装结果', res)
            state.selectedId = new Set()
            Toast.clear()
          })
          .catch((err) => {})
      }
      return { state, onRefresh, onLoad, selectCard, toDetail, emptySet, installAll }
    }
  })
</script>

<style lang="scss" scoped>
  .page {
    background: var(--van-gray-1);
    .header-button {
      font-size: 13px;
    }
    .cancel {
      color: var(--van-gray-6);
    }
    .install {
      color: var(--van-blue);
    }
    .source-list {
      height: calc(100vh - var(--van-nav-bar-height));
      overflow: auto;
      .van-pull-refresh {
        min-height: 100%;
        .src-card {
          margin: 14px;
          background: #fff;
          border-radius: 8px;
          padding: 14px;
          box-sizing: border-box;
          .title-wrapper {
            display: flex;
            margin-top: 4px;
            justify-content: space-between;
            align-items: center;
            .buttons-wrapper {
              flex: 1;
              font-size: 13px;
              font-weight: bold;
              display: flex;
              justify-content: flex-end;
              .button {
                margin-left: 14px;
              }
              .blue {
                color: var(--van-blue);
              }
              .orange {
                color: var(--van-orange);
              }
            }
            .title {
              font-size: 14px;
              font-weight: bold;
              color: var(--van-gray-8);
            }
          }
          .body-wrapper {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            .orange {
              background: rgba(255, 151, 106, 0.1);
              color: #ff976a;
            }
            .blue {
              background: rgba(25, 137, 250, 0.1);
              color: #1989fa;
            }
            .red {
              background: rgba(238, 10, 36, 0.1);
              color: #ee0a24;
            }
            .tag {
              color: var(--van-gray-7);
              font-size: 13px;
              padding: 3px 0;
              border-radius: 30px;
              margin: 3px 0;
              width: fit-content;
            }
          }
        }
        .card-selected {
          background: #48aff012;
        }
      }
    }
  }
</style>

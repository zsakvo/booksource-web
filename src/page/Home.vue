<template>
  <div class="page">
    <van-nav-bar title="厚墨书源系统" />
    <div class="source-list">
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="state.loading"
          :finished="state.finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell
            v-for="item in state.source"
            :key="item.id"
            :title="item.name"
            :value="item.url"
            clickable
          >
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from '@vue/runtime-core'
  import { NavBar, PullRefresh, CellGroup, Cell, List } from 'vant'
  import { repoList } from '@/api/index'

  export default defineComponent({
    components: {
      [NavBar.name]: NavBar,
      [PullRefresh.name]: PullRefresh,
      [CellGroup.name]: CellGroup,
      [Cell.name]: Cell,
      [List.name]: List
    },
    setup() {
      const state = reactive({
        page: 0,
        refreshing: false,
        loading: true,
        finished: false,
        source: [] as object[]
      })
      onMounted(() => {
        console.log('mounted')
      })
      const onRefresh = () => {
        console.log('-->', '下拉刷新')
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
      return { state, onRefresh, onLoad }
    }
  })
</script>

<style lang="scss" scoped>
  .page {
    .source-list {
      height: calc(100vh - var(--van-nav-bar-height));
      overflow: auto;
      .van-pull-refresh {
        min-height: 100%;
      }
    }
  }
</style>

<template>
  <div class="page">
    <van-nav-bar title="书源详情" left-arrow @click-left="onClickLeft" />
    <div class="spinner-wrapper" v-if="state.loading">
      <van-loading color="#1989fa" class="spinner" />
    </div>
    <div class="info-card" v-if="!state.loading">
      <div class="card-title">
        <div class="title-text">{{ state.src.name }}</div>
      </div>
      <div class="card-body">
        <div class="desc-line">目标地址：{{ state.src.url }}</div>
        <div class="desc-line">分享者：{{ state.src.shareUsername }}</div>
        <div class="desc-line">更新时间：{{ state.src.updateTime }}</div>
      </div>
      <div class="card-buttons">
        <div class="button button-install" @click="toInstall(state.src.id)"> 安装书源 </div>
      </div>
    </div>
    <div class="content-card" v-if="!state.loading">
      <div class="card-title">
        <div class="title-text">书源代码</div>
      </div>
      <div class="src-body">
        <pre style="font-size: 12px"> {{ state.src.content }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import beautify from 'js-beautify'
  import { defineComponent, onMounted, reactive, nextTick } from '@vue/runtime-core'
  import { NavBar, Loading } from 'vant'
  import { repoInfo } from '@/api/index'
  import { useRoute, useRouter } from 'vue-router'
  import { SrcInfo } from '@/interface'

  export default defineComponent({
    components: {
      [NavBar.name]: NavBar,
      [Loading.name]: Loading
    },
    setup() {
      const route = useRoute()
      const router = useRouter()
      const bjs = beautify.js
      const state = reactive({
        src: {} as SrcInfo,
        content: {},
        loading: true
      })
      const formatSrc = async (str: string) => {
        let a = bjs(str, { indent_size: 2, space_in_empty_paren: true })
        console.log(a)
        state.src.content = a
        await nextTick()
        state.loading = false
      }
      onMounted(() => {
        let id = route.query.id
        console.log('id-->', id)
        repoInfo(id).then((res: any) => {
          state.src = res
          formatSrc(state.src.content)
        })
      })
      const onClickLeft = () => {
        router.go(-1)
      }
      const toInstall = (id: number) => {
        window.location.href =
          'deepink://reader/booksource?url=http://api.shuyuansy.xyz/repo/batchimport?ids=' + id
      }
      return { state, onClickLeft, toInstall }
    }
  })
</script>

<style lang="scss" scoped>
  .page {
    background: var(--van-gray-1);
    height: 100vh;
    .spinner-wrapper {
      height: 50vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .info-card {
      background: #fff;
      margin: 14px;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 14px;
      padding-bottom: 10px;
      .card-title {
        color: var(--van-gray-8);
        font-size: 14px;
        font-weight: bold;
        margin-top: 4px;
      }
      .card-body {
        padding: 8px 0;
        border-bottom: 1px solid var(--van-gray-1);
        .desc-line {
          line-height: 2;
          font-size: 12px;
          color: var(--van-gray-7);
        }
      }
      .card-buttons {
        padding-top: 10px;
        font-size: 12px;
        .button {
          padding: 3px 0;
        }
        .button-install {
          color: var(--van-primary-color);
        }
      }
    }
    .content-card {
      background: #fff;
      margin: 14px;
      border-radius: 8px;
      box-sizing: border-box;
      width: calc(100vw - 28px);
      padding: 14px;
      .card-title {
        margin: 4px 0;
        color: var(--van-gray-8);
        font-size: 14px;
        font-weight: bold;
        background: #fff;
      }
      .src-body {
        max-height: calc(100vh - 280px);
        overflow: auto;
        color: var(--van-gray-6);
        font-size: 12;
        font-weight: normal;
      }
    }
  }
</style>

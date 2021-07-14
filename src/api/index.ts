import get from '@/plugins/request'

/**
 * 获取书源列表
 * @param {number} page - 页码
 * @returns
 */
export const repoList = (page = 1) => {
  return get('/repo/list', {
    params: {
      page
    }
  })
}

/**
 * 获取书源详情
 * @param {any} id - 书源 id
 * @returns
 */
export const repoInfo = (id: any) => {
  return get('/repo/info', {
    params: {
      id
    }
  })
}

/**
 * 书源批量导出
 * @param {any} ids - 书源 id 集合
 * @returns
 */
export const batchImport = (ids: string) => {
  return get('/repo/batchimport', {
    params: {
      ids
    }
  })
}

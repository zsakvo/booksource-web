import get from '@/plugins/request'

export const repoList = (page = 1) => {
  return get('/repo/list', {
    params: {
      page
    }
  })
}

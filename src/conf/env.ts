declare module '@/conf/env'
const dev = process.env.NODE_ENV !== 'production'
const ENV = dev ? 'development' : 'production'

const FILE_URL = 'https://huijie-wuliu.oss-cn-beijing.aliyuncs.com/'

const envConfig = {
  ENV,
  FILE_URL,
  API_URL: `${location.origin}/api`
}

export default envConfig

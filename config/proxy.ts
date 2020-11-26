export default {
  '/api': {
    target: 'http://192.168.1.149:19100/',
    changeOrigin: true,
  },
  '/aliHost': {
    target: 'https://huijie-keji.oss-cn-beijing.aliyuncs.com/', //服务器
    changeOrigin: true,
  }
}

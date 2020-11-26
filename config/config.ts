// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from "./routes.config";
import * as child_process from 'child_process';

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  define: {
    __APP_NAME__: defaultSettings.title,
    __VERSION__: '1.0',
    __BRANCH_NAME__: child_process
      .execSync('git symbolic-ref --short -q HEAD')
      .toString()
      .replace('\n', ''),
    __COMMIT_HASH__: child_process
      .execSync('git rev-parse --short HEAD')
      .toString()
      .replace('\n', ''),
    __BUILD_TIME__: new Date().toLocaleString()
  },
  locale: {
    default: 'zh-CN',
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    chrome: 49,
    firefox: 45,
    safari: 11,
    ios: 11,
    ie: 10,
    edge: 13
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy,
  manifest: {
    basePath: '/',
  },
});

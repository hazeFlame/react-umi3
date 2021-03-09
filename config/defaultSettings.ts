import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = ProSettings & {
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  title: 'defulttitle',
  navTheme: 'dark',
  primaryColor: '#2e6098',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {},
  pwa: true,
  iconfontUrl: '//at.alicdn.com/t/font_331169_ebgw7759b6.js',
};

export type { DefaultSettings };

export default proSettings;

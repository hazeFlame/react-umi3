module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    __APP_NAME__: false,
    __VERSION__: false,
    __BUILD_TIME__: false,
    __BRANCH_NAME__: false,
    __COMMIT_HASH__: false,
    __ICONFONT_URL__: false,
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
    MASTER: true
  },
};

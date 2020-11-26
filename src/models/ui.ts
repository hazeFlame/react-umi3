export default {
  namespace: 'ui',
  state: {
    mediasPreview: {
      show: false,
      current: 0,
      items: []
    }
  },
  reducers: {
    SHOW_MEDIA_PREVIEW(state: { mediasPreview: { show: boolean; current: any; items: any } }, { items, current }: any) {
      return {
        ...state,
        mediasPreview: {
          show: true,
          current,
          items
        }
      }
    },
    HIDE_MEDIA_PREVIEW(state: { mediasPreview: { current: number; items: never[]; show: boolean } }) {
      return {
        ...state,
        mediasPreview: {
          current: 0,
          items: [],
          show: false
        }
      }
    }
  }
}

import { getDvaApp } from 'umi'

export default (items: any[], current: number) => getDvaApp()._store.dispatch({ type: 'ui/SHOW_MEDIA_PREVIEW', items, current })

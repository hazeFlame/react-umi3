
import React from 'react';
import Icon, { createFromIconfontCN } from '@ant-design/icons'
import defaultSettings from '../../../config/defaultSettings'

export const IconFont = createFromIconfontCN({
  scriptUrl: defaultSettings.iconfontUrl,
})
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/

function isUrl(path: string) {
  return reg.test(path)
}

export const getIcon = (icon?: string | React.ReactNode, color?: string): React.ReactNode => {
  if (!icon) return null
  if (typeof icon === 'string') {
    if (isUrl(icon)) {
      return (
        <Icon
          component={() => (
            <img src={icon} alt="icon" className="ant-pro-sider-menu-icon" style={{ color }} />
          )}
        />
      );
    }
    if (icon.startsWith('icon')) {
      return <IconFont type={icon} style={{ color }} />;
    }
    return <Icon type={icon} style={{ color }} />;
  }
  return icon;
}


export default getIcon

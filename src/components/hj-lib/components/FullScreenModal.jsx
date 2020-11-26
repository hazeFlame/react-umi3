import React from 'react'
import { Modal } from 'antd'
import styled from 'styled-components'

const FullModal = ({ className, children, background, ...rest }) => (
  <Modal
    maskClosable={false}
    keyboard={false}
    {...rest} mask={false} wrapClassName={`${className  } ${  rest.wrapClassName || ''}`}>
    {children}
  </Modal>
)

const FullScreenModal = styled(FullModal)`
  .ant-modal {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100vh;
    width: 100vw !important;
    padding-bottom: 0;
    color: ${props => props.color || '#474747'};
  }
  .ant-modal-content {
    background: ${props => props.background || '#fff'};
    height: 100%;
    overflow: auto;
  }
  .ant-modal-close {
    color: #666;
  }
  .ant-modal-header {
    display: ${props => props.hasHeader ? 'block' : 'none'};
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
  .ant-modal-footer {
    display: ${props => props.hasFooter ? 'block' : 'none'};
    bottom: 0px;
    position: absolute;
    left: 0;
    right: 0;
  }
  .ant-modal-body {
    background: transparent;
    height: 100%;
    padding: ${props => (props.hasFooter || props.hasHeader) ? '60px 24px' : '24px'};
  }
`

export default FullScreenModal

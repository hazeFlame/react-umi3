import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DownloadOutlined, EyeOutlined, CloseCircleFilled, RightOutlined, LeftOutlined } from '@ant-design/icons'
import { IconFont } from '@/components/IconFont'
import { Tooltip } from 'antd'

import View from './View'

const Container = styled(View)`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
`
const Header = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1;
  text-align: right;
`

const Main = styled(View)`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  position: relative;
`

const Sider = styled(View)`
  width: 100px;
  min-width: 100px;
  height: 100%;
  overflow-y: auto;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  li {
    height: 80px;
    background-size: cover !important;
    margin-top: 8px;
    text-align: center;
  }
  .onSelected {
    outline: 3px solid #fff;
  }
`

const BaseIcon = styled.a`
  color: #fff;
  transition: opacity 0.1s;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
  opacity: 0.8;
  font-size: 30px;
  &:hover {
    color: #fff;
    opacity: 1;
  }
  cursor: pointer;
`
const DirectionIcon = styled(BaseIcon)`
  position: absolute;
  display: flex;
  align-items: center;
  width: 20%;
  height: 100%;
  font-size: 36px;
`
const BottomBar = styled(View)`

`

export default class SlideShow extends Component {
  static displayName = 'SlideShow'

  static propTypes = {
    visible: PropTypes.bool,
    canDownload: PropTypes.bool,
    onClose: PropTypes.func,
    medias: PropTypes.array,
    current: PropTypes.number
  }

  static defaultProps = {
    visible: false,
    medias: [],
    canDownload: true,
    current: 0
  }

  static getDerivedStateFromProps(props, state) {
    if (props.visible && !state.visible) return { current: props.current, visible: props.visible }
    if (!props.visible) return { visible: false, current: 0 }
    return null
  }

  state = {
    current: this.props.current,
    visible: this.props.visible,
    R: 0, SS: 1, X: 0, Y: 0
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && !prevProps.visible) {
      document.addEventListener('keydown', this.onKeyDown, false)
      document.body.style.overflow = 'hidden'
      this.setState({ R: 0, SS: 1, X: 0, Y: 0})
    }
    if (!this.props.visible && prevProps.visible) {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', this.onKeyDown)
      this.setState({ R: 0, SS: 1, X: 0, Y: 0})
    }
  }

  onKeyDown = e => {
    if (!this.props.medias || this.props.medias.length < 1) return
    if (e.keyCode === 37 || e.keyCode === 38) {
      e.preventDefault()
      e.stopPropagation()
      this.prevMedia()
    } else if (e.keyCode === 39 || e.keyCode === 40) {
      e.preventDefault()
      e.stopPropagation()
      this.nextMedia()
    } else if (e.keyCode === 27) {
      this.handleClose()
    }
    return false
  }

  getMedia = idx => {
    const media = this.props.medias[idx]
    return media
  }

  handleClose = () => {
    this.props.onClose && this.props.onClose()
  }

  get currentMedia() {
    return this.getMedia(this.state.current)
  }

  handleChange = idx => {
    this.setState({ current: idx })
  }

  prevMedia = () => {
    if (!this.props.sidebar) return
    let idx = this.state.current - 1
    if (this.state.current === 0) {
      idx = this.props.medias.length - 1
    }
    this.handleChange(idx)
  }

  nextMedia = () => {
    if (!this.props.sidebar) return
    let idx = 0
    if (this.state.current !== this.props.medias.length - 1) {
      idx = this.state.current + 1
    }
    this.handleChange(idx)
  }

  moveImg = (ev) => {
    const { X, Y } = this.state
    ev.preventDefault()
    var disx = ev.pageX - X
    var disy = ev.pageY - Y
    document.onmousemove = (ev) => {
      this.setState({
        X: ev.pageX - disx,
        Y: ev.pageY - disy
      })

    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmousedown = null
    }
  }

  rotateLeft = () => {
    const { R } = this.state
    this.setState({ R: R - 90 })
  }

  rotateRight = () => {
    const { R } = this.state
    this.setState({ R: R + 90 })
  }

  zoomIn = () => {
    const { SS } = this.state
    this.setState({ SS: SS + 0.6 })
  }

  zoomOut = () => {
    const { SS } = this.state
    if (SS <= 0.4) return 
    this.setState({ SS: SS - 0.6 })
  }

  zoomImg = (e) => {
    const { SS } = this.state
    if(e.deltaY > 0){
      if (SS <= 0.4) return 
      this.setState({ SS: SS - 0.2 })
    }
    if(e.deltaY < 0){
      this.setState({ SS: SS + 0.2 })
    }
  }

  recove = () => {
    const { R, SS, X, Y } = this.state
    this.setState({ R: 0, SS: 1, X: 0, Y: 0 })
  }

  get isMultiple() {
    return this.props.medias.length > 1
  }

  renderDownloadIcon(item) {
    if (this.props.canDownload) {
      return (
        <BaseIcon
          href={item.path}
          rel="noopener noreferrer"
          download
          style={{ marginRight: 20 }}
        >
          <DownloadOutlined size='32' />
        </BaseIcon>
      )
    }
    if (item.type !== 'picture' && item.type !== 'video') {
      return (
        <BaseIcon
          as="a"
          href={item.path}
          rel="noopener noreferrer"
          target="_blank"
          style={{ marginRight: 20 }}
        >
          <EyeOutlined size='32' />
        </BaseIcon>
      )
    }
    return (
      <BaseIcon as="a" style={{ marginRight: 20 }}>
        {' '}
      </BaseIcon>
    )
  }
  renderCurrentMedia() {
    const media = this.currentMedia,
      size = this.isMultiple ? 80 : 40,
      mediaWidth = window.document.body.clientWidth - size,
      mediaHeight = window.document.body.clientHeight - 20,
      { type, path } = media
    const url = path

    const { R, SS, X, Y } = this.state
    return (
      <View flex={1} className={'relative'}>
        <Header>
          {this.renderDownloadIcon(media)}
          <BaseIcon onClick={this.handleClose}>
            <CloseCircleFilled />
          </BaseIcon>
        </Header>
        <Main
          onClick={
            this.isMultiple
              ? undefined
              : e => {
                if (e.target.tagName !== 'VIDEO' && e.target.tagName !== 'IMG') {
                  this.handleClose()
                }
              }
          }
        >
          {this.isMultiple && this.props.sidebar && (
            <DirectionIcon onClick={this.prevMedia} style={{ justifyContent: 'flex-start', left: 0 }}>
              <LeftOutlined onClick={() => this.setState({ R: 0, SS: 1, X: 0, Y: 0 })} />
            </DirectionIcon>
          )}
          <div style={{ maxWidth: mediaWidth, maxHeight: mediaHeight, textAlign: 'center', width: '100%' }}>
            {type === 'picture' && (
              <img
                key={url} // 不设置 Key 会导致 React 替换 src 属性而不是创建新的元素，在新的图像加载完成之前都不会显示出来
                src={url}
                alt={url}
                onMouseDown={this.moveImg}
                onWheel={this.zoomImg}
                style={{
                  cursor: 'all-scroll',
                  position: 'absolute',
                  maxHeight: mediaHeight,
                  maxWidth: '100%',
                  transform: `rotate(${R}deg) scale(${SS})`,
                  transition: 'transform 0.5s ease-in-out 0s',
                  right: 0,
                  bottom: 0,
                  margin: 'auto',
                  left: `${X}px`,
                  top: `${Y}px`,
                }}
              />
            )}
            {type === 'video' && (
              <video
                key={url}
                src={url}
                controls
                autoPlay
                controlsList="nodownload"
                style={{ maxHeight: mediaHeight, maxWidth: 'calc(100% - 40%)' }}
              />
            )}

            {type !== 'picture' && type !== 'video' && (
              <a href={url} rel="noopener noreferrer" target="_blank">
                <View align={'center'}>
                  {/* <FileIcon type={type} size={100} /> */}
                  {/* <p className={'t-white m-t-20 f18'}>{SlideShow.getFileName(media)}</p> */}
                </View>
              </a>
            )}
          </div>
          {this.isMultiple && this.props.sidebar && (
            <DirectionIcon onClick={this.nextMedia} style={{ justifyContent: 'flex-end', right: 0 }}>
              <RightOutlined onClick={() => this.setState({ R: 0, SS: 1, X: 0, Y: 0 })} />
            </DirectionIcon>
          )}
        </Main>
        <BottomBar row justify='center' className='p-b-20'>
          <Tooltip placement="top" title='左旋'><IconFont type='iconxiangzuoxuanzhuan1' className='f32 t-white m-r-20' onClick={this.rotateLeft} /></Tooltip>
          <Tooltip placement="top" title='右旋'><IconFont type='iconxiangyouxuanzhuan1' className='f32 t-white m-r-20' onClick={this.rotateRight} /></Tooltip>
          <Tooltip placement="top" title='放大'><IconFont type='icontupianfangda' className='f32 t-white m-r-20' onClick={this.zoomIn} /></Tooltip>
          <Tooltip placement="top" title='缩小'><IconFont type='icontupiansuoxiao' className='f32 t-white m-r-20' onClick={this.zoomOut} /></Tooltip>
          <Tooltip placement="top" title='复原'><IconFont type='iconzhongzhi' className='f32 t-white m-r-20' onClick={this.recove} /></Tooltip>
        </BottomBar>
      </View>
    )
  }

  render() {
    const { medias, sidebar } = this.props
    if (!this.props.visible) return null
    return (
      <Container row align="stretch">
        {this.renderCurrentMedia()}
        {sidebar && medias.length > 1 && (
          <Sider>
            <ul>
              {medias.map((m, idx) => {
                const item = this.getMedia(idx)
                if (item.type === 'video' || item.type === 'picture') {
                  return (
                    <li
                      key={m.path}
                      className={idx === this.state.current ? 'onSelected' : ''}
                      title={1}
                      style={{ background: `url(${m.path}) center no-repeat` }}
                      onClick={this.handleChange.bind(null, idx)}
                    />
                  )
                }
                return (
                  <li
                    key={m.path}
                    className={idx === this.state.current ? 'onSelected' : ''}
                    title={2}
                    onClick={this.handleChange.bind(null, idx)}
                  >
                    {/* <FileIcon type={item.type} size={50} style={{ margin: '0 auto', paddingTop: 10 }} /> */}
                  </li>
                )
              })}
            </ul>
          </Sider>
        )}
      </Container>
    )
  }
}

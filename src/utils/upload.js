import _ from 'lodash'
import { message } from 'antd'

/**
 * mime-type
 * pdf ppt excel word
 * MDN: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
 * w3school: http://www.w3school.com.cn/media/media_mimeref.asp
 * http://filext.com/faq/office_mime_types.php
 */
// 视频 imeType
export const VIDEO_MIME_TYPES = [
  'video/webm',
  'video/ogg',
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/x-flv'
]
// 图像 imeType
export const IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/tif',
  'image/jpg',
  'image/bmp',
  'image/gif'
]
// 文件mimeType

export const ATTACHMENT_ACCEPTED_MIME_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ppt',
  'application/vnd.ms-excel': 'excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
  'application/msword': 'word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word'
}
export const ATTACHMENTS_ACCEPTED_TYPES = _.invert(ATTACHMENT_ACCEPTED_MIME_TYPES)

export const ATTACHMENT_MIME_TYPES = _.keys(ATTACHMENT_ACCEPTED_MIME_TYPES)

// 未装office软件无法识别mimetype的系统兼容
export const fixedAttachmentSuffixs = [
  '.pdf',
  '.doc',
  '.docx',
  '.dot',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx'
]

const IMAGE_UPLOAD_LIMIT_MB = 10
const VIDEO_UPLOAD_LIMIT_MB = 400
const ATTACHMENT_UPLOAD_LIMIT_MB = 100

export const checkFileTypeAndSize = (acceptMimeTypes, sizeLimit) => file => {
  if (!acceptMimeTypes.includes(file.type)) {
    message.error('文件格式不对')
    return false
  }
  const isFileSizeAvailable = file.size / 1024 / 1024 <= sizeLimit
  if (!isFileSizeAvailable) {
    message.error('文件大小不能超过' + sizeLimit + 'M')
    return false
  }
  return true
}

export const beforeUploadVideo = checkFileTypeAndSize(VIDEO_MIME_TYPES, VIDEO_UPLOAD_LIMIT_MB)

export const beforeUploadImage = checkFileTypeAndSize(IMAGE_MIME_TYPES, IMAGE_UPLOAD_LIMIT_MB)

export const beforeUploadAttachments = checkFileTypeAndSize(
  ATTACHMENT_MIME_TYPES,
  ATTACHMENT_UPLOAD_LIMIT_MB
)

export const beforeUpload = {
  checkImage: beforeUploadImage,
  checkVideo: beforeUploadVideo,
  checkAttachment: beforeUploadAttachments
}

export const FILE_TYPES = {
  PICTURE: 'picture',
  VIDEO: 'video',
  ATTACHMENT: 'attachment'
}

export const getTypeByMimeType = mimeType => {
  if (IMAGE_MIME_TYPES.includes(mimeType)) return FILE_TYPES.PICTURE
  if (VIDEO_MIME_TYPES.includes(mimeType)) return FILE_TYPES.VIDEO
  if (ATTACHMENT_MIME_TYPES.includes(mimeType)) return FILE_TYPES.ATTACHMENT
}

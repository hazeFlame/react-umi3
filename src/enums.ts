
// 上传类型
export enum uploadTypeEnum {
  good, // 商品信息
  personalInfo, // 个人信息
  buyerInfo, // 买家信息
  sellerInfo, // 卖家信息
  companyInfo // 平台信息
}

// 采购端管理 审核状态
export enum enterPriseAuditStatus {
  '审核不通过',
  '审核通过',
  '待审核'
}

// 商户端管理 商户类型
export enum managementType {
  '第三方商户',
  '自营'
}

// 商户端管理 账户状态
export enum b {
  '全部',
  '正常',
  '禁用'
}

// 商品审核状态
export enum goodAuditStatus  {
  '审核通过' = 1,
  '审核未通过',
  '审核中',
}



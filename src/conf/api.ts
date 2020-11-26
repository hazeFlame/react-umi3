
import generateApi, { IAPI, IApiConfig } from './generateApi'

const apiConfig: IApiConfig = {
  LOGIN: '/oauth/platform/login',
  GET_PROFILE: '/oauth/getUserJwt',

  GET_AREA: '/platform/system/area/getByPid',

  FILE: {
    GET_UPLOAD_TOKEN: '/platform/oss/getInfoByType?uploadTypeEnum=:enum',
  },

  // 商品管理
  COMMODITY_MANAGEMENT: {
    // 分类管理 端点
    CATEGORIES: {
      LIST: '/platform/categories/getList',
      LIST_BY_ID: '/platform/categories/getListByParentId',
      ADD: '/platform/categories/add',
      EDIT: '/platform/categories/editById',
      DELETE: '/platform/categories/deleteById/:id'
    },
    
    // 商品审核
    AUDITGOOD: {
      LIST: '/platform/good/getList',
      EDIT: '/platform/good/auditGood',
      DELETE: '/platform/good/deleteById/:id'
    }
  },

  // 商户管理
  MERCHANT_MANAGEMENT: {
    // 开票信息
    INVOICE: {
      ADD: '/platform/invoice/addBuyerInvoice',
      EDIT: '/platform/invoice/editBuyerInvoice',
    },

    // 商户认证 {
    ENTERPRISE: {
      DETAIL: '/platform/enterprise/getEnterpriseById/:id',
      EDIT: '/platform/enterprise/editEnterprise',
      DELETE: '/platform/enterprise/delEnterpriseById/:id',
      AUDIT: '/platform/enterprise/auditEnterprise'
    },
    
    //  采购端管理
    BUYER: {
      LIST: '/platform/enterprise/getBuyerList',
      ADD: '/platform/enterprise/addBuyer',
    },

    //  商户端管理
    SELLER: {
      LIST: '/platform/enterprise/getSellerList',
      ADD: '/platform/enterprise/addSeller',
    }
  },
  SYSTEM: {
    FUNCTION: {
      LIST: '/platform/function/getListPage',
      ADD: '/platform/function/add',
      EDIT: '/platform/function/editById',
      DELETE: '/platform/function/deleteById/:id'
    },
    ROLE: {
      LIST: '/platform/role/getListPage',
      ADD: '/platform/role/add',
      EDIT: '/platform/role/editRoleFunction',
      DELETE: '/platform/role/deleteById/:id',
    },
    USER: {
      LIST: '/platform/user/getListPage',
      ADD: '/platform/user/add',
      EDIT: '/platform/user/editById',
      DELETE: '/platform/user/deleteById/:id',
    }
  }
}



const APIList = generateApi(apiConfig) as IAPILIST
export default APIList

interface IAPILIST {
  LOGIN: IAPI
  GET_PROFILE: IAPI
  
  GET_AREA: IAPI

  FILE: {
    GET_UPLOAD_TOKEN: IAPI
  }
  COMMODITY_MANAGEMENT: {
    CATEGORIES: {
      LIST: IAPI
      LIST_BY_ID: IAPI
      ADD: IAPI
      EDIT: IAPI
      DELETE: IAPI
    }
    AUDITGOOD: {
      LIST: IAPI
      EDIT: IAPI
      DELETE: IAPI
    }
  }

  MERCHANT_MANAGEMENT: {
    INVOICE: {
      ADD: IAPI,
      EDIT: IAPI,
    },
    ENTERPRISE: {
      DETAIL: IAPI
      EDIT: IAPI
      DELETE: IAPI
      AUDIT: IAPI
    }
    BUYER: {
      LIST: IAPI
      ADD: IAPI
    }
    SELLER: {
      LIST: IAPI
      ADD: IAPI
    }
  }

  SYSTEM: {
    FUNCTION: {
      LIST: IAPI
      ADD: IAPI
      EDIT: IAPI
      DELETE: IAPI
    }
    ROLE: {
      LIST: IAPI
      ADD: IAPI
      EDIT: IAPI
      DELETE: IAPI
    }
    USER: {
      LIST: IAPI
      ADD: IAPI
      EDIT: IAPI
      DELETE: IAPI
    }
  }
}

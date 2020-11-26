
export interface IAPI {
  url: string
  toString(): any
  valueOf(): any
  [method: string]: any
}

class API extends String implements IAPI {
  url = ''
  constructor(url: string) {
    super(url)
    try {
      this.url = url
      const paramReg = /:\w+\(?\w+\)?/g
      const defaultReg = /(\w+)\((.+)\)/g
      url.match(paramReg).map((keyword: string) => {
        const results = defaultReg.exec(keyword.replace(':', ''))
        if (!results) {
          this[keyword.replace(':', '')] = (val: any) => new API(this.url.replace(keyword, val))
        } else {
          this[results[1]] = (val = results[2]) => new API(this.url.replace(keyword, val))
        }
      })
    } catch (err) { }
  }

  toString() {
    const results = /(:\w+)\((.+)\)/g.exec(this.url)
    if (!results) return this.url
    return this.url.replace(results[0], results[2])
  }

  valueOf() {
    // DO NOT REMOVE OR EVERYTHING BROKEN!
    return this as String
  }
}

export interface IApiConfig {
  [key: string]: string | IApiConfig
}

function generateApi(apis: IApiConfig) {
  const APIList: any = {}
  Object.keys(apis).forEach((key: string) => {
    if (typeof apis[key] === 'object') {
      APIList[key] = generateApi(apis[key] as IApiConfig)
    } else {
      APIList[key] = new API(apis[key] as string)
    }
  })
  return APIList
}

export default generateApi

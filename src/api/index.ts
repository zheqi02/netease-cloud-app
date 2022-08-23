import Request from './request'
import type { AxiosResponse } from 'axios'

import type { RequestConfig } from './request/types'

export interface ZQResponse<T> {
  statusCode: number
  desc: string
  result: T
}

// 重写返回类型
interface ZQRequestConfig<T, R> extends RequestConfig<ZQResponse<R>> {
  data?: T
}

const request = new Request({
  baseURL: import.meta.env.VITE_APP_URL,
  timeout: 5000,
  withCredentials: true,
  interceptors: {
    // 请求拦截器
    requestInterceptors: config => config,
    // 响应拦截器
    responseInterceptors: (result: AxiosResponse) => {
      return result
    }
  }
})

/**
 * @description: 函数的描述
 * @generic D 请求参数
 * @generic T 响应结构
 * @param {ZQRequestConfig} config 不管是GET还是POST请求都使用data
 * @returns {Promise}
 */
const zqRequest = <D = any, T = any>(config: ZQRequestConfig<D, T>): Promise<any> => {
  const { method = 'GET' } = config
  if (method === 'get' || method === 'GET')
    config.params = config.data

  return request.request<ZQResponse<T>>(config)
}
// 取消请求
export const cancelRequest = (url: string | string[]) => {
  return request.cancelRequest(url)
}
// 取消全部请求
export const cancelAllRequest = () => {
  return request.cancelAllRequest()
}

export default zqRequest

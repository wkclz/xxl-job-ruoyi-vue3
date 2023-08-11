import axios from 'axios'

declare module 'axios' {
 interface IAxios<D = null> {
   code: number
   message: string
   data: D
 }
 export interface AxiosResponse<T = any> extends IAxios<D> {}
}
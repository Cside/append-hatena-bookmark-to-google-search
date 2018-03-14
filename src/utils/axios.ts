// TODO: 21 世紀なので URLSearchParams を使うべし
import queryString = require('query-string')
import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { p } from './log'

const config: AxiosRequestConfig = {
    withCredentials: true,
    responseType: 'json',
    timeout: 20000, // TODO: タイムアウトのときにどういう画面出るか確認
}

export const url = (conf: AxiosRequestConfig): string => {
    const url = conf.url ? conf.url : ""
    const parsed = queryString.parseUrl(url).query

    Object.assign(parsed, conf.params ? conf.params : {})
    return url.replace(/^(.+\?).+$/, `$1${queryString.stringify(parsed)}`)
}

const createAxios = (): AxiosInstance => {
    const axios: AxiosInstance = Axios.create(config)

    // AxiosRequestConfig に ↓ をどうにかして埋め込めたらもっとシンプルにできるんだけど...
    var start: number
    axios.interceptors.request.use(conf => {
        start = new Date().getTime();

        const method = conf.method ? conf.method.toUpperCase() + ' ' : ''
        p(`--> ${method}${url(conf)}`)

        return conf
    })
    axios.interceptors.response.use((res) => {
        const elapsedSec = (new Date().getTime() - start) / 1000
        p(`<-- ${res.status} ${url(res.config)} (${elapsedSec}s)`)
        return res
    })
    return axios
}

export default createAxios 
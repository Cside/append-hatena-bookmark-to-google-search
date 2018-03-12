import queryString = require('query-string')
import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { p } from '../utils'

const axios = Axios.create({
    withCredentials: true,
    responseType: 'json',
    timeout: 20000, // TODO: タイムアウトのときにどういう画面出るか確認
})

const url = (conf: AxiosRequestConfig): string => {
    const query = queryString.stringify(conf.params)
    // TODO: conf.url に queryString が含まれる場合死ぬ ... まぁ今はとりあえずいいか ...
    return conf.url + (query ? '?' + query : '')
}

const createAxios = (): AxiosInstance => {
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
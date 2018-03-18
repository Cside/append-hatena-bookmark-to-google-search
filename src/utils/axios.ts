import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const config: AxiosRequestConfig = {
    withCredentials: true,
    responseType: 'json',
    timeout: 20000,
}

const createAxios = (): AxiosInstance => {
    const axios: AxiosInstance = Axios.create(config)

    // AxiosRequestConfig に ↓ をどうにかして埋め込めたらもっとシンプルにできるんだけど...
    var start: number
    axios.interceptors.request.use((conf) => {
        start = new Date().getTime()

        const method = conf.method ? conf.method.toUpperCase() + ' ' : ''
        console.debug(`--> ${method}${conf.url || ''}`)

        return conf
    })
    axios.interceptors.response.use((res) => {
        const elapsedSec = (new Date().getTime() - start) / 1000
        console.debug(`<-- ${res.status} ${res.config.url || ''} (${elapsedSec}s)`)
        return res
    })
    return axios
}

export default createAxios
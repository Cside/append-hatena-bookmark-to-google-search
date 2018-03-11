// XXX /runtime は何が違う？
import Handlebars = require('handlebars');
import Axios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Bookmarks } from './types/bookmarks'
import { MyName, isValidMyName } from './types/my_name'
import { p, j, pj } from './utils'
import queryString = require('query-string')

type Req = { q: string }

(() => {
    // // TODO
    // //  - favicon
    // //  - bookmark count
    // //  - timestamp
    // const template = `
    // <h2>はてなブックマークの検索結果 ({{meta.total}}件)</h2>
    // {{#each bookmarks}}
    //     <div>
    //         <h3><a href="{{entry.url}}">{{entry.title}}</a></h3>
    //         <p>{{timestamp}} {{comment}}</p>
    //         <blockquote>
    //             {{entry.snippet}}
    //         </blockquote>
    //     </div>
    // {{/each}}
    // `;
    // const compiledTemplate = Handlebars.compile(template);

    // // このへんは今質的な処理でないから外に切りだしたほうが良いかも
    // const axios = Axios.create({
    //     withCredentials: true,
    //     responseType: 'json',
    //     timeout: 20000,
    // })
    // const setLogger = (axios: AxiosInstance): AxiosInstance => {
    //     const url = (conf): string => {
    //         const query = queryString.stringify(conf.params)
    //         // conf.url に queryString が含まれる場合死ぬ ...
    //         return conf.url + (query ? '?' + query : '')
    //     }

    //     var start: number
    //     axios.interceptors.request.use((conf: AxiosRequestConfig) => {
    //         start = new Date().getTime();

    //         const method = conf.method ? conf.method.toUpperCase() + ' ' : ''
    //         p(`--> ${method}${url(conf)}`)

    //         return conf
    //     })
    //     axios.interceptors.response.use((res: AxiosResponse) => {
    //         const elapsedSec = (new Date().getTime() - start) / 1000
    //         p(`<-- ${res.status} ${url(res.config)} (${elapsedSec}s)`)
    //         return res
    //     })
    //     return axios
    // }

    // // setlogger ダサい...
    // setLogger(axios).get('http://b.hatena.ne.jp/my.name').then((res: AxiosResponse) => {
    //     const data = res.data as MyName
    //     if (!isValidMyName(data))
    //         throw new Error(`invalid response.data: ${JSON.stringify(data)}`)
    //     return data.name

    // }).then(name => {
    //     // TODO: cb にどんな型でも入れちゃえる気がする ...
    //     chrome.runtime.onMessage.addListener((req: Req, sender, cb: (string) => void) => {
    //         // /my/search でも出来るんだけど、302 redirect に 2 sec くらいかかるので id 指定 ...
    //         axios.get(`http://b.hatena.ne.jp/${name}/search/json`, { params: { q: req.q, limit: 5 } }).then((res: AxiosResponse) => {
    //             const data = res.data as Bookmarks
    //             if (!isValidBookmarks(data))
    //                 // Promise.reject() だとコンパイルエラーになった ... Why ?
    //                 throw new Error(`invalid response. data: ${JSON.stringify(data)}`)
    //             cb(compiledTemplate(data))
    //         }).catch(e => {
    //             console.error(e)
    //             cb(String(e)) // TODO: Error handling
    //         })
    //         return true
    //     })
    // }).catch(e => {
    //     // TODO: Error Handling
    //     console.error(e)
    // });
})()
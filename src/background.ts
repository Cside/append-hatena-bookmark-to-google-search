// XXX /runtime は何が違う？
import { AxiosResponse } from 'axios'
import { Bookmarks } from './types/bookmarks'
import createAxios from './utils/axios'
import HtmlRenderer from './utils/html_renderer'
import { p } from './utils/log'

const Cache = false // true にしたまま publish してしまわない対策がいる気がする...
type Req = { q: string[] }

(() => {
    const compiler = HtmlRenderer.preCompile('search_result')

    createAxios().get('http://b.hatena.ne.jp/my.name').then((res: AxiosResponse) => {
        return res.data.name

    }).then((name) => {
        // TODO: 検索を実行して速攻で window 閉じたらエラーになるっぽい（接続先の window がなくなってるからかな）
        //       ユーザー影響はないので重要度は高くない。
        chrome.runtime.onMessage.addListener((
            req: Req,
            _,
            cb: (args: { html?: string, error?: Error }) => void,
        ) => {
            const onSuccess = (res: AxiosResponse) => {
                let b: Bookmarks
                try {
                    b = new Bookmarks(name, res.data as Bookmarks)
                    p(`queries: ${JSON.stringify(b.meta.query.queries)}`)
                    cb({ html: compiler(b) })

                } catch (e) {
                    console.error(e)
                    cb({ error: e })
                }
            }
            // TODO これどうにかできんの ...
            const url = `http://b.hatena.ne.jp/${name}/search/json?q=${encodeURIComponent(req.q.join(' '))}&limit=${Bookmarks.itemsPerPage}`
            if (Cache && localStorage[url]) {
                onSuccess(JSON.parse(localStorage[url]))
            } else {
                createAxios().get(url).then((res) => {
                    if (Cache) localStorage[url] = JSON.stringify(res)
                    onSuccess(res)
                }).catch((e) => {
                    console.error(e)
                    cb({ error: e })
                })
            }

            return true
        })
    }).catch((e) => {
        // TODO: Error Handling
        console.error(e)
    })
})()
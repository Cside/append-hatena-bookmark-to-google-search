// XXX /runtime は何が違う？
import { AxiosResponse } from 'axios'
import { Bookmarks } from './types/bookmarks'
import createAxios from './utils/axios'
import HtmlRenderer from './utils/html_renderer'

const Cache = false // true にしたまま publish してしまわない対策がいる気がする...
type Req = { q: string[] }

(() => {
    const compiler = HtmlRenderer.preCompile('search_result')

    // TODO: このリクエストに失敗したときに救済する術を考えなければ...
    createAxios().get('http://b.hatena.ne.jp/my.name').then((res: AxiosResponse) => {
        return res.data.name

    }).then((name) => {
        // NOTE: 検索を実行して速攻で window 閉じたらエラーになるっぽい（接続先の window がなくなってるからかな）
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
                    console.debug(`queries: ${JSON.stringify(b.meta.query.queries)}`)
                    cb({ html: compiler(b) })

                } catch (e) {
                    console.error(e)
                    cb({ error: e })
                }
            }

            const url = ((): string => {
                const u = new URL(`http://b.hatena.ne.jp/${name}/search/json`)
                u.searchParams.set('q', req.q.join(' '))
                u.searchParams.set('limit', String(Bookmarks.itemsPerPage))
                return u.href
            })()

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
        console.error(e)
    })
})()
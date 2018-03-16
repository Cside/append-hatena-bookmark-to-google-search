// XXX /runtime は何が違う？
import { AxiosResponse } from 'axios'
import { Bookmarks } from './types/bookmarks'
import { MyName } from './types/my_name'
import createAxios from './utils/axios'
import HtmlRenderer from './utils/html_renderer'
import { p } from './utils/log'

const Cache = true // for development
type Req = { q: string[] }

(() => {
    const compiler = HtmlRenderer.preCompile('search_result')

    // setlogger ダサい...
    createAxios().get('http://b.hatena.ne.jp/my.name').then((res: AxiosResponse) => {
        const data = res.data as MyName
        if (!MyName.isValid(data))
            throw new Error(`invalid response.data: ${JSON.stringify(data)}`)
        return data.name

    }).then((name) => {
        // TODO: cb にどんな型でも入れちゃえる気がする ...
        // TODO: 検索を実行して速攻で window 閉じたらエラーになるっぽい（接続先の window がなくなってるからかな）
        chrome.runtime.onMessage.addListener((
            req: Req,
            _,
            cb: (args: { html?: string, error?: Error }) => void,
        ) => {
            // /my/search でも出来るんだけど、302 redirect に 2 sec くらい持ってかれるので id 指定 ...

            const onSuccess = (res: AxiosResponse) => {
                let error: Error | undefined
                const b: Bookmarks | undefined = Bookmarks.fromObject(res.data, (e) => {
                    if (e) error = e
                })
                if (!b || error) {
                    cb({ error })
                    return
                }
                p(`queries: ${JSON.stringify(b.meta.query.queries)}`)
                cb({ html: compiler(b) })
            }
            const url = `http://b.hatena.ne.jp/${name}/search/json?q=${req.q.join(' ')}&limit=${Bookmarks.itemsPerPage}`
            if (Cache && localStorage[url]) {
                onSuccess(JSON.parse(localStorage[url]))
            } else {
                createAxios().get(url).then((res) => {
                    if (Cache) localStorage[url] = JSON.stringify(res)
                    return onSuccess(res)
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
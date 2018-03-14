import { Bookmark } from './types/bookmarks';
// XXX /runtime は何が違う？
import Handlebars = require('handlebars');
import Axios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Bookmarks } from './types/bookmarks'
import { MyName } from './types/my_name'
import { p, j, pj } from './utils/log'
import createAxios from './utils/axios'

// HTML Renderer 的なクラスでやらせたほうが良いかも
const template = `
    <h2 class="hb-h2">はてなブックマークの検索結果 ({{meta.total}}件)</h2>
    {{#each bookmarks}}
        <div class="">
            <h3 class="hb-h3">
                <span class=""><img src="{{entry.favicon_url}}" /></span>
                <span class=""><a href="{{entry.url}}">{{entry.title}}</a></span>
            </h3>
            <p>
                <span class="hb-count"><a href="{{entry.bookmark_url}}">{{entry.count_int}} users</a></span>
                <span class="hb-date">{{created_ymd}}</span>
                <span class="">{{comment}}</span>
            </p>
            <blockquote class="hb-snippet">
                {{{entry.snippet}}}
            </blockquote>
        </div>
    {{/each}}
    <style>
        /* reset */
        [class^="hb-"] {
            outline: 1px dotted pink;
            font-family: Helvetica,Arial,Roboto,sans-serif;
            line-height: 1.5;
            font-size: 13px;
            color: #333;
        }

        .hb-h2 {
            font-size: 14px;
        }
        .hb-count a {
            color: #FF4166;
        }
        .hb-date,
        .hb-snippet {
            color: #999;
        }
        .hb-snippet {
            -webkit-margin-start: 0px;
            -webkit-margin-end: 0px;
        }
        .hb-snippet strong {
            color: #333;
        }
    </style>
`;

const Cache = true // for development
type Req = { q: string[] }

(() => {
    const compiledTemplate = Handlebars.compile(template);

    // setlogger ダサい...
    createAxios().get('http://b.hatena.ne.jp/my.name').then((res: AxiosResponse) => {
        const data = res.data as MyName
        if (!MyName.isValid(data))
            throw new Error(`invalid response.data: ${JSON.stringify(data)}`)
        return data.name

    }).then(name => {
        // TODO: cb にどんな型でも入れちゃえる気がする ...
        // TODO: 検索を実行して速攻で window 閉じたらエラーになるっぽい（接続先の window がなくなってるからかな）
        chrome.runtime.onMessage.addListener((req: Req, sender, cb: (string) => void) => {
            // /my/search でも出来るんだけど、302 redirect に 2 sec くらい持ってかれるので id 指定 ...

            const onSuccess = (res: AxiosResponse) => {
                const b: Bookmarks | undefined = Bookmarks.fromObject(res.data, e => {
                    if (e) {
                        console.error(e)
                        throw e // TODO...
                    }
                })
                if (!b) {
                    cb('') // TODO ...
                    return
                }
                p(`queries: ${JSON.stringify(b.meta.query.queries)}`)
                cb(compiledTemplate(b))

            }
            const url = `http://b.hatena.ne.jp/${name}/search/json?q=${req.q.join(' ')}&limit=${Bookmarks.itemsPerPage}`
            if (Cache && localStorage[url]) {
                p(`# get exists`)
                onSuccess(JSON.parse(localStorage[url]))
            } else {
                p(`# get doesn't exist`)
                createAxios().get(url).then(res => {
                    if (Cache) localStorage[url] = JSON.stringify(res)
                    return onSuccess(res)
                }).catch(e => {
                    console.error(e)
                    cb(String(e)) // TODO: Error handling
                })
            }

            return true
        })
    }).catch(e => {
        // TODO: Error Handling
        console.error(e)
    });
})()
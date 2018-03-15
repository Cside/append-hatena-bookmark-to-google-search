import { Type, plainToClass } from "class-transformer";
import 'reflect-metadata'
import { sprintf } from 'sprintf-js'
import { p, pj } from '../utils/log'

export class Bookmarks {
    @Type(() => Bookmark) // TODO: 本当にこれ無いと動かんのか？
    bookmarks: Bookmark[]

    @Type(() => Meta)
    meta: Meta

    static itemsPerPage = 5

    // Bookmarks? だと怒られるの何故 ...。もしかして引数じゃないと使えないの？
    static fromObject(obj: Object, cb: (Error?) => void): Bookmarks | undefined {
        const bookmarks = plainToClass(Bookmarks, obj)
        if (!Bookmarks.isValid(bookmarks)) {
            cb(new Error(`Invalid bookmarks.`))
            return
        }
        bookmarks.emphasisQueries()
        return bookmarks
    }

    static isValid = (self: Bookmarks): boolean => {
        return (
            Array.isArray(self.bookmarks) && (
                self.bookmarks.length === 0 || (
                    self.bookmarks[0] instanceof Bookmark &&
                    typeof self.bookmarks[0].entry == 'object' &&
                    typeof self.bookmarks[0].entry.url === 'string'
                )
            )
        )
    }

    // TODO: これ明示的に呼び出すしかな無いのかな。できればインスタンス作る時に強制したいんだけど... 。
    emphasisQueries() {
        this.meta.query.queries.forEach(query => {
            const re = new RegExp(`(${query})`, 'gi')
            this.bookmarks.forEach(bookmark => {
                bookmark.entry.snippet = bookmark.entry.snippet.replace(re, `<strong>$1</strong>`)
            })
        })
    }
}

export class Bookmark {
    comment: string

    @Type(() => Entry)
    entry: Entry

    private _timestamp: number
    created_ymd: string
    set timestamp(ts: number) {
        this._timestamp = ts
        const d = new Date(ts * 1000)
        this.created_ymd = sprintf('%04d/%02d/%02d', d.getFullYear(), d.getMonth() + 1, d.getDate())
    }
}

// TODO: export しなくても Boookmark.Entry みたいに参照できれば良い気がする
export class Entry {
    snippet: string
    title: string
    eid: string

    private _count: string
    count_int: number
    set count(count: string) {
        this._count = count
        this.count_int = Number(count)
    }

    static schemaSeparationRegExp = new RegExp('^(https?)://(.+)$')
    private _url: string
    favicon_url: string
    bookmark_url: string
    hostname: string
    get url(): string { return this._url }
    set url(url: string) {
        this._url = url

        const loc = document.createElement('a');
        loc.href = url;

        const scheme = loc.protocol
        const baseUrl = `${scheme}//${loc.hostname}/`

        this.hostname = loc.hostname
        this.favicon_url = `https://cdn-ak.favicon.st-hatena.com/?url=${encodeURIComponent(baseUrl)}`
        this.bookmark_url = 'http://b.hatena.ne.jp/entry/'
            + ((scheme === 'https:') ? 's/' : '')
            + url.replace(/https?:\/\//, '')
    }
}

export class Meta {
    total: number
    query: {
        queries: string[]
    }
}
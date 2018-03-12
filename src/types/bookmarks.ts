import { Type, plainToClass } from "class-transformer";
import 'reflect-metadata'
import { sprintf } from 'sprintf-js'
import { p, pj } from '../utils'

export class Bookmarks {
    @Type(() => Bookmark)
    bookmarks: Bookmark[]

    @Type(() => Bookmark)
    meta: Meta

    // Bookmarks? だと怒られるの何故 ...。もしかして引数じゃないと使えないの？
    static fromJSON(json: string, cb: (Error?) => void): Bookmarks | undefined {
        let obj: Object
        try {
            obj = JSON.parse(json)
        } catch (e) {
            cb(new Error(`JSON parse error. Error: ${e}, JSON: ${json}`))
            return
        }
        const bookmarks = plainToClass(Bookmarks, obj)
        if (!Bookmarks.isValid(bookmarks)) {
            cb(new Error(`Invalid bookmarks.`))
            return
        }
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
}

export class Bookmark {
    comment: string

    @Type(() => Entry)
    entry: Entry

    private _timestamp: number
    created_ymd: string
    get timestamp(): number { return this._timestamp }
    set timestamp(ts: number) {
        this._timestamp = ts
        const d = new Date(ts * 1000)
        this.created_ymd = sprintf('%04d/%02d/%02d', d.getFullYear(), d.getMonth() + 1, d.getDate())
    }
}

export class Entry {
    snippet: string
    title: string
    eid: string

    private _count: string
    count_int: number
    get count(): string { return this._count }
    set count(count: string) {
        this._count = count
        this.count_int = Number(count)
    }

    static baseUrlRegExp = new RegExp('^(https?://[^/]+/).+$')
    static schemaSeparationRegExp = new RegExp('^(https?)://(.+)$')
    private _url: string
    favicon_url: string
    bookmark_url: string
    get url(): string { return this._url }
    set url(url: string) {
        this._url = url

        const baseUrl = url.replace(Entry.baseUrlRegExp, "$1")
        this.favicon_url = `https://cdn-ak.favicon.st-hatena.com/?url=${encodeURIComponent(baseUrl)}`
        const m = url.match(Entry.schemaSeparationRegExp)
        if (m) {
            const [scheme, suffix] = [m[1], m[2]]
            let bookmark_url = 'http://b.hatena.ne.jp/entry/'
            if (scheme === 'https') bookmark_url += 's/'
            this.bookmark_url = bookmark_url + suffix
        }
    }
}

export class Meta {
    total: number
}
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

class Bookmark {
    private _timestamp: number
    comment: string
    created_date: string

    @Type(() => Entry)
    entry: Entry

    get timestamp(): number {
        return this._timestamp
    }
    set timestamp(ts: number) {
        this._timestamp = ts
        const d = new Date(ts * 1000)
        this.created_date = sprintf('%04d/%02d/%02d', d.getFullYear(), d.getMonth() + 1, d.getDate())
    }
}

class Entry {
    snippet: string
    count: string
    url: string
    title: string
    eid: string
}

class Meta {
    total: number
}
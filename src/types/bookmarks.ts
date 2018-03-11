import { Type, plainToClass } from "class-transformer";
import 'reflect-metadata'
import { sprintf } from 'sprintf-js'

export class Bookmarks {
    @Type(() => Bookmark)
    bookmarks: Bookmark[]

    @Type(() => Bookmark)
    meta: Meta

    // Bookmarks? だと怒られるの何故 ...
    static fromJSON(json: string, cb: (Error?) => void): Bookmarks | null {
        let parsed: Object
        try {
            parsed = JSON.parse(json)
        } catch (e) {
            cb(new Error(`JSON parse error: ${e}`))
            return null
        }
        const bookmarks = plainToClass(Bookmarks, parsed)
        if (!Bookmarks.isValid(bookmarks)) {
            cb(new Error(`Not valid bookmarks`))
            return null
        }
        return bookmarks
    }

    static isValid = (bookmarks): boolean => {
        return (
            Array.isArray(bookmarks) && (
                bookmarks.length === 0 || (
                    typeof bookmarks[0] == 'object' &&
                    typeof bookmarks[0].entry == 'object' &&
                    typeof bookmarks[0].entry.url === 'string'
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
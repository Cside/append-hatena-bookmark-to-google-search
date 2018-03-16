import { sprintf } from 'sprintf-js'

export class Bookmarks {
    static itemsPerPage = 5

    bookmarks: {
        comment: string
        created_ymd: string
        timestamp: number
        entry: {
            snippet: string
            title: string
            url: string
            eid: string
            count: string
            count_int: number
            favicon_url: string
            bookmark_url: string
            hostname: string
        }
    }[]

    url: string

    meta: {
        total: number
        query: {
            queries: string[]
        }
        hasNext: boolean
    }

    constructor (username: string, res: any) {
        if (!(
            Array.isArray(res.bookmarks) && (
                res.bookmarks.length === 0 || (
                    (
                        res.bookmarks[0] instanceof Object &&
                        !Array.isArray(res.bookmarks[0])
                    ) &&
                    typeof res.bookmarks[0].entry == 'object' &&
                    typeof res.bookmarks[0].entry.url === 'string'
                )
            )
        )) throw new Error(`Invalid bookmarks.`) // TODO

        this.bookmarks = res.bookmarks
        this.meta = res.meta
        // TODO: これどうにかならん？
        this.url = `http://b.hatena.ne.jp/${username}/search?q=${encodeURIComponent(res.meta.query.queries.join(' '))}`

        const queryRegexps: RegExp[] = []
        this.meta.query.queries.forEach((query) => {
            queryRegexps.push(new RegExp(`(${query})`, 'gi'))
        })

        this.bookmarks.forEach((bookmark) => {
            const d = new Date(bookmark.timestamp * 1000)
            bookmark.created_ymd = sprintf('%04d/%02d/%02d', d.getFullYear(), d.getMonth() + 1, d.getDate())

            bookmark.entry.count_int = Number(bookmark.entry.count)

            const loc = document.createElement('a')
            loc.href = bookmark.entry.url
            const scheme = loc.protocol
            const baseUrl = `${scheme}//${loc.hostname}/`
            bookmark.entry.hostname = loc.hostname
            bookmark.entry.favicon_url = `https://cdn-ak.favicon.st-hatena.com/?url=${encodeURIComponent(baseUrl)}`
            bookmark.entry.bookmark_url = 'http://b.hatena.ne.jp/entry/'
                + ((scheme === 'https:') ? 's/' : '')
                + bookmark.entry.url.replace(/https?:\/\//, '')

            queryRegexps.forEach((re) => {
                bookmark.entry.snippet = bookmark.entry.snippet.replace(re, `<strong>$1</strong>`)
            })
        })

        this.meta.hasNext = this.meta.total > Bookmarks.itemsPerPage
    }
}
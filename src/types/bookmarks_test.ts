import { Bookmarks, Entry } from './bookmarks'
import { assert } from 'chai'

describe('isValid', () => {
    [
        {
            name: "bookmarks is empty",
            input: { "bookmarks": [] },
            wantErr: false,
        },
        {
            name: "doesn't have bookmarks prop",
            input: {},
            wantErr: true,
        },
        {
            name: "bookmarks[0].bookmark is null",
            input: { "bookmarks": [null] },
            wantErr: true,
        },
        {
            name: "bookmarks[0].bookmark has entry",
            input: { "bookmarks": [{ "entry": { "url": "" } }] },
            wantErr: false,
        },
        {
            name: "bookmarks[0].bookmark.url isn't a string",
            input: { "bookmarks": [{ "entry": {} }] },
            wantErr: true,
        },
        {
            name: "has meta",
            input: { "bookmarks": [], "meta": { "total": 100 } },
            wantErr: false,
        },
    ].forEach(tt => {
        it(tt.name, () => {
            const b = Bookmarks.fromObject(tt.input, (e) => {
                // TODO: なぜかこいつらが実行テストにカウントされない
                if (tt.wantErr) {
                    assert.isOk(e)
                } else {
                    assert.isNotOk(e)
                }
            })
            if (tt.wantErr) {
                assert.isNotOk(b)
            } else {
                assert.isOk(b)
            }
        })
    })
})

describe('fromObject', () => {
    const obj = {
        "bookmarks": [
            {
                "is_private": 0,
                "entry": {
                    "snippet": "This is snippet",
                    "count": "35",
                    "score_vals": null,
                    "url": "http://christina04.hatenablog.com/entry/2017/01/06/190000",
                    "title": "Golangでのstreamの扱い方を学ぶ - Carpe Diem",
                    "eid": "315078306"
                },
                "timestamp": 1514269677,
                "comment": "[Go][golang]"
            }
        ],
        "meta": {
            "status": 200,
            "query": {
                "original": "golang",
                "queries": ["golang"]
            },
            "total": 59,
            "elapsed": 5.579
        }
    }
    it('can transform class', () => {
        const bookmarks = Bookmarks.fromObject(obj, (e) => {
            if (e) console.error(`[ERROR] ${e}`)
        })
        if (bookmarks) {
            assert.equal(bookmarks.bookmarks[0].created_ymd, "2017/12/26")
            assert.equal(bookmarks.meta.total, 59)
            assert.equal(bookmarks.bookmarks[0].entry.count_int, 35)
            assert.equal(
                bookmarks.bookmarks[0].entry.favicon_url,
                'https://cdn-ak.favicon.st-hatena.com/?url=http%3A%2F%2Fchristina04.hatenablog.com%2F',
            )
            assert.equal(
                bookmarks.bookmarks[0].entry.bookmark_url,
                'http://b.hatena.ne.jp/entry/christina04.hatenablog.com/entry/2017/01/06/190000',
            )
        } else {
            // TODO: fail...
        }
    })
})

describe('bookmark_url', () => {
    [
        {
            name: 'http',
            url: 'http://cside.me/foo/bar?id=100',
            want: 'http://b.hatena.ne.jp/entry/cside.me/foo/bar?id=100',
        },
        {
            name: 'https',
            url: 'https://cside.me/foo/bar?id=100',
            want: 'http://b.hatena.ne.jp/entry/s/cside.me/foo/bar?id=100',
        },
    ].forEach(tt => {
        const entry = new Entry()
        entry.url = tt.url
        it(' automatically set', () => {
            assert.equal(entry.bookmark_url, tt.want)
        })
    })
})
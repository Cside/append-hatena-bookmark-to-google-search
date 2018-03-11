import { Bookmarks } from './bookmarks'
import { assert } from 'chai'

describe('isValid()', () => {
    [
        {
            name: "bookmarks is empty",
            input: { bookmarks: [] },
            want: true,
        },
        {
            name: "doesn't have bookmarks prop",
            input: {},
            want: false,
        },
        {
            name: "bookmarks[0].bookmark is undefiend",
            input: { bookmarks: [undefined] },
            want: false,
        },
        {
            name: "bookmarks[0].bookmark has entry",
            input: { bookmarks: [{ entry: { url: "" } }] },
            want: true,
        },
        {
            name: "bookmarks[0].bookmark.url isn't a string",
            input: { bookmarks: [{ entry: {} }] },
            want: false,
        },
        {
            name: "has meta",
            input: { bookmarks: [], meta: { total: 100 } },
            want: true,
        },
    ].forEach(tt => {
        it(tt.name, () => {
            assert.equal(
                Bookmarks.isValid(tt.input as any as Bookmarks),
                tt.want,
            )
        })
    })
})

describe('fromJSON', () => {
    const json = `{
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
                "queries": [ "golang" ]
            },
            "total": 59,
            "elapsed": 5.579
        }
    }`
    it('decode', () => {
        const bookmarks = Bookmarks.fromJSON(json, (e: Error | undefined) => {
            if (e) throw e
        })
        console.log(bookmarks)
    })
});
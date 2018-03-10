import { Bookmarks, isValidBookmarks } from './bookmarks'
import { assert } from "chai"

describe('isValidBookmarks', () => {
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
            // TODO: isValidBookmarks 晒しただけで死ぬ...
            assert.equal(
                isValidBookmarks(tt.input as any as Bookmarks),
                tt.want,
            )
        })
    })
})
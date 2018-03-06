import { Bookmarks, isValidBookmarks } from './bookmarks'
import { assert } from "chai"

describe('bookmarks', () => {
    it('is valid bookmarks', () => {
        [
            {
                input: [],
                want: true,
            },
        ].forEach(tt => {
            assert.equal(
                isValidBookmarks(tt.input as any as Bookmarks),
                tt.want,
            )
        })
    })
})
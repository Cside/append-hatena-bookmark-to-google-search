import { assert } from 'chai'
import { Bookmarks, Entry } from './bookmarks'

describe('isValid', () => {
    [
        {
            name: 'bookmarks is empty',
            input: {
                bookmarks: [],
                meta: {},
            },
            wantErr: false,
        },
        {
            name: 'doesn\'t have bookmarks prop',
            input: {},
            wantErr: true,
        },
        {
            name: 'bookmarks[0].bookmark is null',
            input: { bookmarks: [null] },
            wantErr: true,
        },
        {
            name: 'bookmarks[0].bookmark has entry',
            input: { bookmarks: [{ entry: { url: '' } }] },
            wantErr: false,
        },
        {
            name: 'bookmarks[0].bookmark.url isn\'t a string',
            input: { bookmarks: [{ entry: {} }] },
            wantErr: true,
        },
    ].forEach((tt) => {
        tt.input.meta = {
            total: 100,
            query: {
                queries: [],
            }
        }
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
        bookmarks: [
            {
                is_private: 0,
                entry: {
                    snippet: 'This is snippet',
                    count: '35',
                    score_vals: null,
                    url: 'http://christina04.hatenablog.com/entry/2017/01/06/190000',
                    title: 'Golangでのstreamの扱い方を学ぶ - Carpe Diem',
                    eid: '315078306'
                },
                timestamp: 1514269677,
                comment: '[Go][golang]'
            }
        ],
        meta: {
            status: 200,
            query: {
                original: 'golang go',
                queries: ['golang', 'go']
            },
            total: 59,
            elapsed: 5.579
        }
    }
    it('can transform class', () => {
        const bookmarks = Bookmarks.fromObject(obj, (e) => {
            if (e) console.error(`[ERROR] ${e}`)
        })
        if (bookmarks) {
            // TODO: ちゃんとやるなら JSON 全体とまるっと比較すれば良い気がする
            assert.equal(bookmarks.bookmarks[0].created_ymd, '2017/12/26')
            assert.equal(bookmarks.bookmarks[0].entry.count_int, 35)
            assert.equal(
                bookmarks.bookmarks[0].entry.favicon_url,
                'https://cdn-ak.favicon.st-hatena.com/?url=http%3A%2F%2Fchristina04.hatenablog.com%2F',
            )
            assert.equal(
                bookmarks.bookmarks[0].entry.bookmark_url,
                'http://b.hatena.ne.jp/entry/christina04.hatenablog.com/entry/2017/01/06/190000',
            )
            assert.equal(
                bookmarks.bookmarks[0].entry.hostname,
                'christina04.hatenablog.com',
            )
            assert.equal(bookmarks.meta.total, 59)
            assert.deepEqual(bookmarks.meta.query.queries, ['golang', 'go'])
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
    ].forEach((tt) => {
        const entry = new Entry()
        entry.url = tt.url
        it(' automatically set', () => {
            assert.equal(entry.bookmark_url, tt.want)
        })
    })
})

describe('emphasisQueries', () => {
    [
        {
            args: {
                snippet: 'Golang',
                queries: ['Go'],
            },
            want: '<strong>Go</strong>lang',
        },
        {
            args: {
                snippet: '仕事でGo言語書きたい',
                queries: ['Go'],
            },
            want: '仕事で<strong>Go</strong>言語書きたい',
        },
        {
            args: {
                snippet: 'GoGo',
                queries: ['Go'],
            },
            want: '<strong>Go</strong><strong>Go</strong>',
        },
    ].forEach((tt) => {
        it(`can surround "${tt.args.snippet}"`, () => {
            const b = Bookmarks.fromObject({
                bookmarks: [
                    {
                        entry: {
                            url: '',
                            snippet: tt.args.snippet,
                        },
                    },
                ],
                meta: {
                    query: {
                        queries: tt.args.queries,
                    },
                },
            }, ((e) => { console.error(e) }))
            if (b) {
                assert.equal(b.bookmarks[0].entry.snippet, tt.want)
            } else {
                // TODO: fail ...
            }
        })
    })
})
import { assert } from 'chai'
import { Bookmarks } from './bookmarks'

describe('is valid args', () => {
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
            const code = () => { new Bookmarks('Cside', tt.input) }
            if (tt.wantErr) {
                assert.throws(() => { code() })
            } else {
                assert.doesNotThrow(() => { code() })
            }
        })
    })
})

describe('new', () => {
    it('can construct class', () => {
        const bookmarks = new Bookmarks('Cside', {
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
        })

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
        assert.equal(bookmarks.url, 'http://b.hatena.ne.jp/Cside/search?q=golang%20go')
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
        it(tt.name, () => {
            assert.doesNotThrow(() => {
                const bookmarks = new Bookmarks('Cside', {
                    bookmarks: [{ entry: { url: tt.url } }],
                    meta: { query: { queries: [] } },
                })
                assert.equal(bookmarks.bookmarks[0].entry.bookmark_url, tt.want)
            })
        })
    })
})

describe('emphasis queries', () => {
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
            assert.doesNotThrow(() => {
                const b = new Bookmarks('Cside', {
                    bookmarks: [{ entry: { url: '', snippet: tt.args.snippet } }],
                    meta: { query: { queries: tt.args.queries } },
                })
                assert.equal(b.bookmarks[0].entry.snippet, tt.want)
            })
        })
    })
})

describe('hasNext', () => {
    const orig = Bookmarks.itemsPerPage
    Bookmarks.itemsPerPage = 5
    after(() => {
        Bookmarks.itemsPerPage = orig
    });

    [
        {
            name: 'n < itemsPerPage',
            total: 4,
            want: false,
        },
        {
            name: 'n === itemsPerPage',
            total: 5,
            want: false,
        },
        {
            name: 'n > itemsPerPage',
            total: 6,
            want: true,
        },
    ].forEach((tt) => {
        it(tt.name, () => {
            assert.doesNotThrow(() => {
                const bookmarks = new Bookmarks('Cside', {
                    bookmarks: [{ entry: { url: '' } }],
                    meta: {
                        total: tt.total,
                        query: { queries: [] },
                    },
                })
                assert.equal(bookmarks.meta.hasNext, tt.want)
            })
        })
    })
})
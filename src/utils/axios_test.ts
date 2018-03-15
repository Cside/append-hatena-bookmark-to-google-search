import { assert } from 'chai'
import { url } from './axios'

describe('url', () => {
    const baseUrl = 'https://cside.me/foo'; // TODO: semi colon ...
    [
        {
            name: 'have no params',
            conf: {
                url: `${baseUrl}`,
                params: {},
            },
            want: `${baseUrl}`,
        },
        {
            name: 'http',
            conf: {
                url: `http://cside.me/foo`,
                params: {},
            },
            want: `http://cside.me/foo`,
        },
        {
            name: 'add new param',
            conf: {
                url: `${baseUrl}?foo=Foo&bar=Bar`,
                params: { baz: 'Baz' },
            },
            want: `${baseUrl}?bar=Bar&baz=Baz&foo=Foo`,
        },
        {
            name: 'has hash',
            conf: {
                url: `${baseUrl}#hash?foo=Foo&bar=Bar`,
                params: { baz: 'Baz' },
            },
            want: `${baseUrl}#hash?bar=Bar&baz=Baz&foo=Foo`,
        },
    ].forEach((tt) => {
        it(tt.name, () => {
            assert.equal(url(tt.conf), tt.want)
        })
    })
})
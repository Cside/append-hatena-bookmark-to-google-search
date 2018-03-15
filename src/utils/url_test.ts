import { assert } from 'chai'
import { getQ } from './url'

describe('getQ', () => {
    [
        {
            name: 'q = "foo" (simple URI)',
            url: 'https://www.google.co.jp/search?q=foo',
            want: ['foo'],
        },
        {
            name: 'q = "" (simple URI)',
            url: 'https://www.google.co.jp/search?q=',
            want: undefined,
        },
        {
            name: 'q = "foo" (&)',
            url: 'https://www.google.co.jp/search?p=bar&q=foo',
            want: ['foo'],
        },
        {
            name: 'q = "foo" (default URI)',
            url: 'https://www.google.co.jp/search?q=foo&oq=foo&aqs=chrome..69i57j69i59l3j0l2.624j0j7&sourceid=chrome&ie=UTF-8',
            want: ['foo'],
        },
        {
            name: 'q = "  foo  "',
            url: 'https://www.google.co.jp/search?safe=off&ei=dlymWuP9AcH20ASCm5eAAg&q=+foo+&oq=+foo+&gs_l=psy-ab.3..35i39k1l2j0j0i67k1j0l3j0i67k1.216938.218118.0.218455.2.2.0.0.0.0.387.509.0j1j0j1.2.0....0...1c.1.64.psy-ab..0.2.508...0i131k1.0.sJ0DVuoLq-U',
            want: ['foo'],
        },
        {
            name: 'q = "　　foo　　"',
            url: 'https://www.google.co.jp/search?safe=off&ei=UV2mWtbQMMLR0ASLs5O4BQ&q=%E3%80%80%E3%80%80foo%E3%80%80%E3%80%80&oq=%E3%80%80%E3%80%80foo%E3%80%80%E3%80%80&gs_l=psy-ab.3..35i39k1l2j0j0i67k1j0l2j0i7i30k1l2.36703.40117.0.40389.8.8.0.0.0.0.418.828.0j3j4-1.5.0....0...1c.1.64.psy-ab..3.5.1017.6..0i131k1.190.xCtwDKyQjqI',
            want: ['foo'],
        },
        {
            name: 'q = "/"',
            url: 'https://www.google.co.jp/search?safe=off&ei=e12mWo7GIofC0gTKiIbgAQ&q=%2F&oq=%2F&gs_l=psy-ab.3..0l8.1922432.1923881.0.1924450.3.3.0.0.0.0.241.387.0j1j1.3.0....0...1c.1.64.psy-ab..0.3.525.6..0i67k1j35i39k1.139.Clc2M9N5QAQ',
            want: ['/'],
        },
        {
            name: 'q = "あ"',
            url: 'https://www.google.co.jp/search?q=%E3%81%82&oq=%E3%81%82&aqs=chrome..69i57j69i61l3j69i59l2.832j0j7&sourceid=chrome&ie=UTF-8',
            want: ['あ'],
        },
        {
            name: 'q = "foo bar"',
            url: 'https://www.google.co.jp/search?safe=off&ei=eVumWpykEcXs0ATbkr-ACA&q=foo+bar&oq=foo+bar&gs_l=psy-ab.3..35i39k1l2j0l4j0i203k1l2.43748.69646.0.69796.13.10.3.0.0.0.197.685.0j4.5.0....0...1c.1.64.psy-ab..6.7.685.6..0i67k1j0i131k1.176.muRsVmxwPx8',
            want: ['foo', 'bar'],
        },
        {
            name: 'q = "foo　bar"',
            url: 'https://www.google.co.jp/search?safe=off&ei=wVumWoa3HMic0gS0lbaABQ&q=foo%E3%80%80bar&oq=foo%E3%80%80bar&gs_l=psy-ab.3..35i39k1l2j0l4j0i203k1l2.109967.123648.0.123829.20.12.8.0.0.0.331.1544.0j5j2j1.9.0....0...1c.1.64.psy-ab..4.16.1427.6..0i131k1j0i67k1j0i4k1.138.8h0tVgelWSo',
            want: ['foo', 'bar'],
        },
    ].forEach(tt => {
        it(tt.name, () => {
            assert.deepEqual(getQ(tt.url), tt.want)
        })
    })
})
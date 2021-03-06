import { assert } from 'chai'
import { getQ } from './url'

describe('getQ', () => {
    [
        {
            name: 'q = "foo" (simple URI)',
            search: '?q=foo',
            want: ['foo'],
        },
        {
            name: 'empty search',
            search: '',
            want: [],
        },
        {
            name: 'q = "" (simple URI)',
            search: '?q=',
            want: [],
        },
        {
            name: 'q = "foo" (&)',
            search: '?p=bar&q=foo',
            want: ['foo'],
        },
        {
            name: 'q = "foo" (default URI)',
            search: '?q=foo&oq=foo&aqs=chrome..69i57j69i59l3j0l2.624j0j7&sourceid=chrome&ie=UTF-8',
            want: ['foo'],
        },
        {
            name: 'q = "  foo  "',
            search: '?safe=off&ei=dlymWuP9AcH20ASCm5eAAg&q=+foo+&oq=+foo+&gs_l=psy-ab.3..35i39k1l2j0j0i67k1j0l3j0i67k1.216938.218118.0.218455.2.2.0.0.0.0.387.509.0j1j0j1.2.0....0...1c.1.64.psy-ab..0.2.508...0i131k1.0.sJ0DVuoLq-U',
            want: ['foo'],
        },
        {
            name: 'q = "　　foo　　"',
            search: '?safe=off&ei=UV2mWtbQMMLR0ASLs5O4BQ&q=%E3%80%80%E3%80%80foo%E3%80%80%E3%80%80&oq=%E3%80%80%E3%80%80foo%E3%80%80%E3%80%80&gs_l=psy-ab.3..35i39k1l2j0j0i67k1j0l2j0i7i30k1l2.36703.40117.0.40389.8.8.0.0.0.0.418.828.0j3j4-1.5.0....0...1c.1.64.psy-ab..3.5.1017.6..0i131k1.190.xCtwDKyQjqI',
            want: ['foo'],
        },
        {
            name: 'q = "/"',
            search: '?safe=off&ei=e12mWo7GIofC0gTKiIbgAQ&q=%2F&oq=%2F&gs_l=psy-ab.3..0l8.1922432.1923881.0.1924450.3.3.0.0.0.0.241.387.0j1j1.3.0....0...1c.1.64.psy-ab..0.3.525.6..0i67k1j35i39k1.139.Clc2M9N5QAQ',
            want: ['/'],
        },
        {
            name: 'q = "あ"',
            search: '?q=%E3%81%82&oq=%E3%81%82&aqs=chrome..69i57j69i61l3j69i59l2.832j0j7&sourceid=chrome&ie=UTF-8',
            want: ['あ'],
        },
        {
            name: 'q = "foo bar"',
            search: '?safe=off&ei=eVumWpykEcXs0ATbkr-ACA&q=foo+bar&oq=foo+bar&gs_l=psy-ab.3..35i39k1l2j0l4j0i203k1l2.43748.69646.0.69796.13.10.3.0.0.0.197.685.0j4.5.0....0...1c.1.64.psy-ab..6.7.685.6..0i67k1j0i131k1.176.muRsVmxwPx8',
            want: ['foo', 'bar'],
        },
        {
            name: 'q = "foo　bar"',
            search: '?safe=off&ei=wVumWoa3HMic0gS0lbaABQ&q=foo%E3%80%80bar&oq=foo%E3%80%80bar&gs_l=psy-ab.3..35i39k1l2j0l4j0i203k1l2.109967.123648.0.123829.20.12.8.0.0.0.331.1544.0j5j2j1.9.0....0...1c.1.64.psy-ab..4.16.1427.6..0i131k1j0i67k1j0i4k1.138.8h0tVgelWSo',
            want: ['foo', 'bar'],
        },
        {
            name: 'q = (js OR perl OR python)',
            search: '?safe=off&ei=FROuWpnPB8n00gSPibrgDg&q=%28js+OR+perl+OR+python%29&oq=%28js+OR+perl%29&gs_l=psy-ab.3...8883.14058.0.14245.14.13.0.0.0.0.156.1167.3j7.11.0....0...1c.1.64.psy-ab..5.8.1022.6..0j35i39k1j0i131k1j0i30k1j0i10i30k1.161.0yz3ugb2xbk',
            want: ['js', 'perl', 'python'],
        },
        {
            name: 'q = DESK ORGINIZER',
            search: '?safe=off&ei=GxeuWubXAsyy0ASkm5bgDA&q=DESK+ORGINIZER&oq=DESK+ORGINIZER&gs_l=psy-ab.3..0i10i203k1j0i13i30k1l6j0i10i30k1.5353.18159.0.19539.34.24.10.0.0.0.156.2362.1j18.19.0....0...1c.1.64.psy-ab..5.29.2390...0j35i39k1j0i67k1j0i4k1j0i131k1j0i203k1j0i8i10i30k1j0i5i10i30k1j0i13i5i30k1.0.TFWisQAel1w',
            want: ['DESK', 'ORGINIZER'],
        },
        {
            name: 'q = "foo bar" baz',
            search: '?safe=off&ei=XBauWsLyKcWf0gSbqoLoBA&q=%22foo+bar%22+baz&oq=%22foo+bar%22+baz&gs_l=psy-ab.3..35i39k1j0i203k1l5j0i30k1l2.949.1412.0.1623.4.4.0.0.0.0.201.398.0j1j1.2.0....0...1c.1.64.psy-ab..2.2.398...0.0.vNrrhcPdPqo',
            want: ['foo', 'bar', 'baz'],
        },
        {
            name: 'q = "東京 -大阪',
            search: '?safe=off&ei=lRiuWvuOH4Ho0gSt74GgAw&q=%E6%9D%B1%E4%BA%AC+-%E5%A4%A7%E9%98%AA&oq=%E6%9D%B1%E4%BA%AC+-%E5%A4%A7%E9%98%AA&gs_l=psy-ab.3...41521.41521.0.41734.1.1.0.0.0.0.77.77.1.1.0....0...1c.2.64.psy-ab..0.0.0....0.-lyoptPiegE',
            want: ['東京'],
        },
        {
            name: 'q = ありのまま*話すぜ',
            search: '?q=%E3%81%82%E3%82%8A%E3%81%AE%E3%81%BE%E3%81%BE*%E8%A9%B1%E3%81%99%E3%81%9C&oq=%E3%81%82%E3%82%8A%E3%81%AE%E3%81%BE%E3%81%BE*%E8%A9%B1%E3%81%99%E3%81%9C&aqs=chrome..69i57j0.7955j0j7&sourceid=chrome&ie=UTF-8',
            want: ['ありのまま*話すぜ'],
        },
        {
            name: 'q = foo bar: site:cside.me',
            search: '?safe=off&ei=PRuuWs24BoSV0gS_uoHICQ&q=foo+bar%3A+site%3Acside.me&oq=foo+bar%3A+site%3Acside.me&gs_l=psy-ab.3...2066.2631.0.2893.5.5.0.0.0.0.169.518.3j2.5.0....0...1c.1.64.psy-ab..2.0.0....0.86qI8f4cZpM',
            want: ['foo', 'bar:'],
        },
    ].forEach((tt) => {
        it(tt.name, () => {
            assert.deepEqual(getQ(tt.search), tt.want)
        })
    })
})
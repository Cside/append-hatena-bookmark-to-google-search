import { assert } from 'chai'
import HtmlRenderer from './html_renderer'

describe('HtmlRenderer', () => {
    HtmlRenderer.templates['test'] = 'My name is {{name}}'
    after(() => {
        delete HtmlRenderer.templates['test']
    })
    it('preCompile', () => {
        const compiled = HtmlRenderer.preCompile('test')
        assert.equal(compiled({ name: 'John' }), `My name is John`)
        assert.equal(compiled({ name: 'Bob' }), `My name is Bob`)
    })
})
import { p, j, getQ } from './utils'

(() => {
    const q = getQ(location.href) // space で分割とかはやってない ...
    if (!q) return

    const sideBlock = document.querySelector('#rhs_block')
    if (!sideBlock) return
    // TODO 消すまでもない。下に追いやるとかで良いのでは。
    while (sideBlock.firstChild) {
        sideBlock.removeChild(sideBlock.firstChild)
    }

    chrome.runtime.sendMessage({ q }, (json: string) => {
        sideBlock.innerHTML = `<pre><code>${json}</code></pre>`
    })

    // var source = '<p>Hello, my name is {{name}}. I am from {{hometown}}. I have ' +
    //          '{{kids.length}} kids:</p>' +
    //          '<ul>{{#kids}}<li>{{name}} is {{age}}</li>{{/kids}}</ul>';
    // var template = Handlebars.compile(source);
    // var data = { 'name': 'Alan', 'hometown': 'Somewhere, TX',
    //              'kids': [{'name': 'Jimmy', 'age': '12'}, {'name': 'Sally', 'age': '4'}]};
    // var result = template(data);
    // sideBlock.innerHTML = result
})()
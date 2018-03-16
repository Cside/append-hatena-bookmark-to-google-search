// TODO: runtime だけでなくて良いのか
import Handlebars = require('handlebars')

const templates: { [key: string]: string } = {
    search_result: `
        <h2 class="hb-h2">はてなブックマークの検索結果 ({{meta.total}}件)</h2>
        {{#each bookmarks}}
            <div class="hb-entry">
                <h3 class="hb-h3">
                    <span class=""><img src="{{entry.favicon_url}}" /></span>
                    <span class=""><a href="{{entry.url}}">{{entry.title}}</a></span>
                </h3>
                {{#if comment}}
                     <p class="hb-comment">{{comment}}</p>
                {{/if}}
                <p class="hb-summary">
                    <span class="hb-hostname"><a href="{{entry.url}}">{{entry.hostname}}</a></span>
                    <span class="hb-count"><a href="{{entry.bookmark_url}}">{{entry.count_int}} users</a></span>
                    <span class="hb-date">{{created_ymd}}</span>
                </p>
                <blockquote class="hb-snippet">
                    {{{entry.snippet}}}
                </blockquote>
            </div>
        {{/each}}
        <style>
            /* ==============================================
               reset
               ============================================== */
            [class^="hb-"] {
                font-family: Helvetica,Arial,Roboto,sans-serif !important;
                font-size: 12px;
                color: #333;
                line-height: 1.4;
            }

            /* ==============================================
               debug
               ============================================== */
            /* [class^="hb-"] { outline: 1px dotted pink; } */

            /* ==============================================
               margin
               ============================================== */
            .hb-h3,
            .hb-comment,
            .hb-summary,
            .hb-snippet {
                margin: 7px 0 7px 0;
            }
            .hb-h3 {
                text-indent: -1.5em;
                margin-left: 1.5em;
            }
            .hb-comment,
            .hb-summary,
            .hb-snippet {
                margin-left: 1.5em;
            }

            /* ==============================================
               color && font-size && etc
               ============================================== */
            .hb-entry {
                border-bottom: 1px solid #ddd;
            }
            .hb-h2 {
                font-size: 15px;
            }
            .hb-h3 a {
                font-size: 14px;
                color: #333;
            }
            .hb-count a {
                color: #FF4166;
            }
            .hb-date,
            .hb-snippet,
            .hb-hostname a
             {
                color: #999;
            }
            .hb-snippet strong {
                color: #333;
            }
        </style>`,
}

export default class HtmlRenderer {
    static templates = templates
    static preCompile(name: string): HandlebarsTemplateDelegate {
        const template = this.templates[name]
        if (!template) throw new Error(`No such template: ${name}`)
        return Handlebars.compile(template)
    }
}
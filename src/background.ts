// XXX /runtime は何が違う？
import Handlebars = require('handlebars');
import Axios from 'axios';
import { Bookmarks, isValidBookmarks } from './types/bookmarks'
import { p, j, pj } from './utils'

type Req = { q: string }

(() => {
    const template = `
    <h2>はてなブックマークでの検索結果</h2>
    {{#each bookmarks}}
        <h3><a href="{{entry.url}}">{{entry.title}}</a></h3>
        <div>
        </div>
    {{/each}}
    `;
    const compiledTemplate = Handlebars.compile(template);
    const axios = Axios.create({
        withCredentials: true,
        responseType: 'json',
        timeout: 20000,
    })

    chrome.runtime.onMessage.addListener((req: Req, sender, cb) => {
        pj(req)
        p(`http://b.hatena.ne.jp/my/search/json?q=${encodeURIComponent(req.q)}`)
        setTimeout(() => {
            const json = `{"bookmarks":[{"is_private":0,"entry":{"snippet":"衛宮さんちの今日のごはん\nFate×料理が織りなす美味しく優しい世界───\nそこは少し賑やかなどこにでもある食卓の光景。\n春も、夏も、秋も、冬も、\n衛宮さんちでは毎日美味しい料理がふるまわれる。\nさて今日は何を作ろ","count":"13","score_vals":null,"url":"http://www.nicovideo.jp/watch/so32657481","title":"衛宮さんちの今日のごはん　第一話 「年越しそば」 アニメ/動画 - ニコニコ動画","eid":"356409669"},"timestamp":1517473519,"comment":""},{"is_private":0,"entry":{"snippet":"まぁ、なんというかごめんなさいジョジョ関連MAD→mylist/43427301","count":"24","score_vals":null,"url":"http://www.nicovideo.jp/watch/sm26428344","title":"あぁエキセントリック少年花京院 ‐ ニコニコ動画:GINZA","eid":"257138999"},"timestamp":1514386949,"comment":"[ジョジョ]素材過多"},{"is_private":0,"entry":{"snippet":"ユーザーの皆様へ\n先日11月28日にniconicoの新バージョンに関する発表を行いました。 \nその際、視聴者の皆様やご来場の皆様、SNS上のユーザー皆様から、沢山のご叱責を頂きまして、改めて謝罪と今後の見通しについてお話をさせてください。\nまずは10月に新バージョンをリリースすると言ったのにも関わらず遅延したことについて深く反省するとともに謹んでお詫び","count":"782","score_vals":null,"url":"http://blog.nicovideo.jp/niconews/53475.html","title":"niconicoサービスの基本機能の見直しと今後に関して|ニコニコインフォ","eid":"350551625"},"timestamp":1512055125,"comment":""},{"is_private":0,"entry":{"snippet":"※対戦相手への誹謗中傷はお控えください注意　新UBの正式名称やステータス等のネタバレがありますsm32158218：前　次：sm32286628マイリスト：mylist/57566485twitter：@pelicaNCancAn","count":"2","score_vals":null,"url":"http://www.nicovideo.jp/watch/sm32286540","title":"【ポケモンUSM】ウルトラまったりシングルレート実況 1【UB：LAY】 by ペリカン 実況プレイ動画/動画 - ニコニコ動画","eid":"350474014"},"timestamp":1511982955,"comment":""},{"is_private":0,"entry":{"snippet":"乃木坂46看板番組『乃木坂って､どこ?』毎週日曜 深夜0:00～テレビ東京、テレビ大阪、テレビ愛知、テレビ北海道、テレビせとうち、TVQ九州放送橋本△→sm17116105その２(削除)→sm16723383その３→sm17080387その４→sm17145659新七福神発表(1stシングルメンバー選考時)→sm17060555その５→sm17145784","count":"1","score_vals":null,"url":"http://www.nicovideo.jp/watch/sm16723252","title":"乃木どこ（2011～2012年初）超絶簡単まとめ その１ by mokichi エンターテイメント/動画 - ニコニコ動画","eid":"344946661"},"timestamp":1505558296,"comment":""},{"is_private":0,"entry":{"snippet":"DECO*27です。Music : DECO*27 mylist/9850666■ http://deco27.com/■ http://twitter.com/deco27 Arrangement : Rockwell■ https://twitter.com/69l_rockwellSupervised English lyrics &amp; Chorus","count":"18","score_vals":null,"url":"http://www.nicovideo.jp/watch/sm31685272","title":"【初音ミク】ヒバナ【オリジナル曲】 by DECO*27 VOCALOID/動画 - ニコニコ動画","eid":"342981423"},"timestamp":1505388604,"comment":""},{"is_private":0,"entry":{"snippet":"今のポケモンってすげーな！って１００回ぐらい言ってますポケモンサンマイリス→　その２→木曜か金曜(１～２日に１本ペースで更新予定です)ツイッター→https://twitter.com/sugiru2今までにやった実況のpart1集→mylist/25802219","count":"1","score_vals":null,"url":"http://www.nicovideo.jp/watch/sm31597387","title":"【実況】ポケットモンスター(サン)を愚痴(ぐち)りながらやった その１ by すぎる 実況プレイ動画/動画 - ニコニコ動画","eid":"342174011"},"timestamp":1500600663,"comment":""},{"is_private":0,"entry":{"snippet":"携帯電話でもニコニコできる？ ｢ニコニコ動画モバイル｣大好評サービス中！\r\n人気の動画を簡単に探せる各種ランキングや、時間潰しに最適な動画をお知らせする｢ニコニコ通信｣など、充実の機能が満載!!　左のQRコードからアクセスしてね！ \r\nニコニコ動画モバイルのさらに詳しい情報はコチラでご覧いただけます。\r\n(※)対応端末：ドコモ70x 90x シリーズ、au","count":"2","score_vals":null,"url":"http://www.nicovideo.jp/tag/%E3%82%A2%E3%82%AB%E3%83%9A%E3%83%A9","title":"タグ検索 アカペラ‐ニコニコ動画(SP1)","eid":"8081881"},"timestamp":1486129626,"comment":""},{"is_private":0,"entry":{"snippet":"つべの動画から抜粋","count":"9","score_vals":null,"url":"http://www.nicovideo.jp/watch/sm25441389","title":"こりゃめでてーな伊藤 カイジネタ詰め合わせ ‐ ニコニコ動画:GINZA","eid":"240357066"},"timestamp":1485597591,"comment":""},{"is_private":0,"entry":{"snippet":"】 \nhttp://live. nicovideo .jp/watch/lv282808286\n関連記事一覧へ 関連記事\n「青鬼2016」がプラットフォーム「AndApp」で配信。新EDなどを追加 「RPGツクールMV」で自作ゲームを制作する「ニコニコ自作ゲームフェス MV」の開催が決定 Steam配信版「RPGツクールMV」が日本語に対応。クォータービュー","count":"2","score_vals":null,"url":"http://www.4gamer.net/games/312/G031261/20161201046/","title":"「青鬼2016」がプラットフォーム「AndApp」で配信。新EDなどを追加 - 4Gamer.net","eid":"310670617"},"timestamp":1480571557,"comment":""},{"is_private":0,"entry":{"snippet":"ブログ等に次のコードをコピーして貼り付けると この番組の情報が表示されます。\n","count":"1","score_vals":null,"url":"http://live.nicovideo.jp/watch/lv282808286","title":"AndApp RPGツクールMV　スマホで青鬼実況大会 - 2016/12/18 20:00開始 - ニコニコ生放送","eid":"310670601"},"timestamp":1480571537,"comment":""},{"is_private":0,"entry":{"snippet":"","count":"1","score_vals":null,"url":"http://www.nicovideo.jp/watch/sm8313592","title":"【作業用BGM】誰でもわかる洋楽集 ‐ ニコニコ動画(原宿)","eid":"40768286"},"timestamp":1480396557,"comment":""},{"is_private":0,"entry":{"snippet":"させようとしています。 \nスカートの中を見えなくする装置作って、たくし上げたりしちゃいます。 \n男子なら、 ドキドキ必須のシチュエーション。 \nこれが田中だ。 \n覚悟をキメてノーパンで行く上野さんが好きです。なおもう1回くらいノーパンになる模様。勇者だ…… 【試し読み】 \nseiga. nicovideo .jp\nこんな幼なじみが欲しいだけの人生だった。「天","count":"374","score_vals":null,"url":"http://www.itutado.com/entry/2016/11/13/%E6%9C%80%E8%BF%91%E3%81%AE%E9%9D%A2%E7%99%BD%E3%81%84%E3%83%A9%E3%83%96%E3%82%B3%E3%83%A1%E6%BC%AB%E7%94%BB%E3%82%92%E3%81%8A%E3%81%99%E3%81%99%E3%82%81%E3%81%95%E3%81%9B%E3%81%A6%E4%B8%8B%E3%81%95%E3%81%84","title":"最近の面白いラブコメ漫画をおすすめさせて下さい！ - いつかたどり着く","eid":"307842865"},"timestamp":1479031467,"comment":"[comic]"},{"is_private":0,"entry":{"snippet":"某LTで発表したものをペタリ。 通信が切れてコケることがあったので、そこを乗り越えたかった話です。 ■ デモ（音が出ます！） https://rutan.github.io/... すべて表示\n某LTで発表したものをペタリ。 通信が切れてコケることがあったので、そこを乗り越えたかった話です。 ■ デモ（音が出ます！） https://rutan.github","count":"1","score_vals":null,"url":"http://niconare.nicovideo.jp/watch/kn1602","title":"Service Worker 使ってツクールMVのブラウザゲーをオフラインでも動かす話 / Ruたん さん - ニコナレ","eid":"301549229"},"timestamp":1474034308,"comment":"[ServiceWorker]"},{"is_private":0,"entry":{"snippet":"ニコニコ動画から転載\nhttp://www. nicovideo .jp/watch/sm20608\n2007年03月10日 23：13：01 投稿\npart.2\nhttp://www.youtube.com/watch?v=1Ssf8-84ez4\npart.3\nhttp://www.youtube.com/watch?v=mT0dUvQ-WW0\npart.","count":"9","score_vals":null,"url":"http://www.youtube.com/watch?v=t_ysTM6RMCk","title":"YouTube - 荒木飛呂彦先生 スペシャルインタビュー 1","eid":"11596792"},"timestamp":1471187667,"comment":"[ジョジョ]"},{"is_private":0,"entry":{"snippet":"ブルーハーツ、ハイロウズ、クロマニヨンズのボーカル、ギターの二人の名言集です＾＾相変わらず面白みのない動画でしかも長くてすいません＞＜前回のヒロト名言集は→sm1244696 ご意見ご要望がありましたら→hirotomarcy1985@yahoo.co.jp","count":"1","score_vals":null,"url":"http://www.nicovideo.jp/watch/sm1423563","title":"甲本ヒロト・真島昌利名言集 by マーシー 音楽/動画 - ニコニコ動画","eid":"297854369"},"timestamp":1471025908,"comment":""},{"is_private":0,"entry":{"snippet":"昔買ったんですが最近懐かしく思ったので ～曲名リスト～１，情熱の薔薇　２，リンダリンダ　３，旅人　４，終わらない歌　５，キスにて欲しい　６，TRAIN-TRAIN　７，夢８，夕暮れ　９，ハンマー　１０，青空　１１，ロクデナシ１２，1000のバイオリン　１３，人にやさしく　１４，１９８５","count":"1","score_vals":null,"url":"http://www.nicovideo.jp/watch/sm1497382","title":"BLUE HEARTSメドレー by もた 音楽/動画 - ニコニコ動画","eid":"297854294"},"timestamp":1471025802,"comment":""},{"is_private":0,"entry":{"snippet":"勝ったッ！第三期完","count":"4","score_vals":null,"url":"http://www.nicovideo.jp/watch/sm23036073","title":"アヴにゃん ‐ ニコニコ動画:GINZA","eid":"185444582"},"timestamp":1466687831,"comment":""},{"is_private":0,"entry":{"snippet":"「被虐のノエル」第1話を公開しました。 \n※ プレイは無料です！（もしもダウンロードできない方は こちら ） \n※ 実況も二次創作も自由です！（実況・二次創作については こちら","count":"3","score_vals":null,"url":"http://info.nicovideo.jp/gamemaga/noel/","title":"被虐のノエル（作者：カナヲ）公式サイト｜無料で遊べるニコニコゲームマガジン","eid":"285146131"},"timestamp":1461380678,"comment":""},{"is_private":0,"entry":{"snippet":"このサイトは、サイバートラストの サーバ証明書 により実在性が認証されています。 また、SSLページは通信が暗号化されプライバシーが守られています。\n© DWANGO Co., Ltd","count":"1","score_vals":null,"url":"http://www.nicovideo.jp/user/13835037","title":"ログイン - niconico","eid":"280240623"},"timestamp":1456491892,"comment":""}],"meta":{"status":200,"query":{"original":"nicovideo","queries":["nicovideo"]},"total":168,"elapsed":11.074}}`
            let data
            try {
                data = JSON.parse(json)
                const c = compiledTemplate(data)
                p(c)
                cb(c)
            } catch (e) {
                console.log(json)
                console.error(e)
            }
        }, 0)
        // axios.get(`http://b.hatena.ne.jp/my/search/json?q=${encodeURIComponent(req.q)}`).then(res => {
        //     const data = res.data as Bookmarks
        //     const c = compiledTemplate(data) // TODO
        //     p(c)

        //     cb(isValidBookmarks(data) ? c : j(res))
        // }).catch(e => {
        //     console.error(e)
        // })
        return true
    })
})()
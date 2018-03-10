import { Type, plainToClass } from "class-transformer";
import 'reflect-metadata'

// 必要なものだけ定義している。これが全てではない
export class Bookmarks {
    @Type(() => Bookmark)
    bookmarks: Bookmark[]

    @Type(() => Bookmark)
    meta: Meta
}

class Bookmark {
    timestamp: number
    comment: string

    @Type(() => Entry)
    entry: Entry
}

class Entry {
    snippet: string
    count: string
    url: string
    title: string
    eid: string
}

class Meta {
    total: number
}

export const isValidBookmarks = (res: Bookmarks): boolean => {
    return (
        Array.isArray(res.bookmarks) && (
            res.bookmarks.length === 0 || (
                typeof res.bookmarks[0] == 'object' &&
                typeof res.bookmarks[0].entry == 'object' &&
                typeof res.bookmarks[0].entry.url === 'string'
            )
        )
    )
}

// export type Bookmarks = {
//     bookmarks: {
//         timestamp: number
//         comment: string
//         entry: {
//             snippet: string
//             count: string
//             url: string
//             title: string
//             eid: string
//         }
//     }[],
//     meta: {
//         total: number,
//     },
// }
// 
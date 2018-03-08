// 必要なものだけ定義している。これが全てではない
export type Bookmarks = {
    bookmarks: {
        timestamp: number
        comment: string
        entry: {
            snippet: string
            count: string
            url: string
            title: string
            eid: string
        }
    }[],
    meta: {
        total: number,
    },
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

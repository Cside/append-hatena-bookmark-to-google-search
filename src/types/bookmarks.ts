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
}

export const isValidBookmarks = (res: Bookmarks): boolean => {
    return (
        Array.isArray(res) &&
        res.length == 0 || (
            res[0] !== undefined &&
            res[0].entry !== undefined &&
            res[0].url !== undefined
        )
    )
}

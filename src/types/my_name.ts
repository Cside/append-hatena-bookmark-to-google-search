export type MyName = {
    name: string,
}
export const isValidMyName = (my: MyName): boolean => {
    return typeof my === 'object' && typeof my.name == 'string'
}
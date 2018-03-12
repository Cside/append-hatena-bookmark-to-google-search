export class MyName {
    name: string

    static isValid(self: MyName): boolean {
        return typeof self === 'object' &&
            typeof self.name == 'string'
    }
}
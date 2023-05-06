import BaseModel from "./BaseModel";

export default interface Store<T extends BaseModel> {
    entities: T[]
    current: T | undefined
    uniqueId: string

    get(): T | never

    load(): void

    delete(): void | never

    update(data: T | T[]): void | never

    reload(): void

    select(id: number | string): Store<T>

    unSelect(): void

}


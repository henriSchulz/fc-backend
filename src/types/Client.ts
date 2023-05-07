import BaseModel from "./BaseModel";

export default interface Client extends BaseModel {
    readonly userName: string
    readonly hash: string
    readonly token: string
}
import BaseModel from "./BaseModel";

export default interface Client extends BaseModel {
    readonly email: string
    readonly firstName: string
    readonly lastName: string
    readonly userName: string
    readonly hash: string
    readonly token: string
}
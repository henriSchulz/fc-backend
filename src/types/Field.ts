import BaseModel from "./BaseModel";

export default interface Field extends BaseModel {
    name: string
    cardTypeId: string
    readonly clientId: string
}
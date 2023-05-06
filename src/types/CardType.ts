import BaseModel from "./BaseModel";

export default interface CardType extends BaseModel {
    readonly name: string
    readonly templateFront: string
    readonly templateBack: string
    readonly clientId: string
}
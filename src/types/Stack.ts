import BaseModel from "./BaseModel";

export default interface Stack extends BaseModel {
    clientId: string
    name: string
}
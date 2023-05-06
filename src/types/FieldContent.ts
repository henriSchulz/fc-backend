import BaseModel from "./BaseModel";

export default interface FieldContent extends BaseModel {
    fieldId: string
    cardId: string
    stackId: string
    content: string
}
import BaseModel from "./BaseModel";


export default interface Card extends BaseModel {
    readonly clientId: string
    readonly stackId: string
    readonly cardTypeId: string
    readonly dueAt: number
    readonly learningState: number
    readonly paused: boolean
}
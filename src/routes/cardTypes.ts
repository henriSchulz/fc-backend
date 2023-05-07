import {Request, Response} from "express";
import Client from "../types/Client";
import {cardTypeEntityStore, ERROR_PREFIX, LOG_PREFIX} from "../index";
import CardType from "../types/CardType";
import Field from "../types/Field";
import {isArrayOfFields, isCardType} from "../utils";

//payload: CardType[]
export async function getAllCardTypes(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    const [cardTypes, error] = await cardTypeEntityStore.getAll(client.id)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }

    res.json({
        payload: cardTypes
    })
}

//payload: {cardType: CardType, fields: Field[]}
export async function createCardType(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    if (!req.body) return res.status(422).json({error: "Invalid request Body"})

    const {name, templateFront, templateBack, fieldNames} = req.body

    if (!name || !templateFront || !templateBack || !fieldNames)
        return res.status(422).json({error: "Invalid request Body. Missing properties 'name', 'templateFront', 'fieldNames' or 'contents'"})

    const [data, error] = await cardTypeEntityStore.create(client.id, name, templateFront, templateBack, fieldNames)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }

    const [cardType, fields] = data as [CardType, Field[]]

    res.json({payload: {cardType, fields}})
    console.log(`${LOG_PREFIX} User(${client.id}) created CardType(${cardType?.id})`)
}

//payload: CardType[]
export async function addCardType(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware
    if (!req.body) return res.status(422).json({error: "Invalid request Body"})

    const cardType: CardType = req.body.cardType


    if (!isCardType(cardType)) return res.status(422).json({error: `Invalid request Body. Object ${cardType} is not typeof CardType`})

    const [addedCardType, error] = await cardTypeEntityStore.add(client.id, cardType)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }
    console.log(`${LOG_PREFIX} User(${client.id}) added CardType(${cardType?.id})`)
    res.json({payload: addedCardType})
}

//payload: {cardType: CardType, fields: Field[]}
export async function updateCardType(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware
    if (!req.body) return res.status(422).json({error: "Invalid request Body"})

    const cardType: CardType = req.body.cardType
    const fields: Field[] = req.body.fields

    if (!isCardType(cardType)) return res.status(422).json({error: `Invalid request Body. Object ${cardType} is not typeof CardType`})
    if (!isArrayOfFields(fields)) return res.status(422).json({error: `Invalid request Body. Object ${cardType} is not typeof Field[]`})

    const [data, error] = await cardTypeEntityStore.update(client.id, cardType, fields)
    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }
    const [modifiedCardType, modifiedFields] = data as [CardType, Field[]]

    console.log(`${LOG_PREFIX} User(${client.id}) modified CardType(${cardType?.id})`)
    res.json({
        payload: {cardType: modifiedCardType, field: modifiedFields}
    })
}

//no payload
export async function deleteCardType(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware
    if (!req.body) return res.status(422).json({error: "Invalid request Body"})

    const {id: cardTypeId} = req.body

    if (!cardTypeId) return res.sendStatus(422)

    const [_, error] = await cardTypeEntityStore.delete(client.id, cardTypeId)
    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }
    console.log(`${LOG_PREFIX} User(${client.id}) deleted CardType(${cardTypeId})`)
    res.sendStatus(200)
}
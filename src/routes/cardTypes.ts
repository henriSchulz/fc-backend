import {Request, Response} from "express";
import Client from "../types/Client";
import {cardTypeEntityStore, ERROR_PREFIX, LOG_PREFIX} from "../index";
import CardType from "../types/CardType";
import Field from "../types/Field";


export async function getAllCardTypes(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    const [cardTypes, error] = cardTypeEntityStore.getAll(client.id)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }

    res.json(cardTypes)
}

export async function createCardType(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    if (!req.body) return res.sendStatus(422)

    const {name, templateFront, templateBack, fieldNames} = req.body

    if (!name || !templateFront || !templateBack || !fieldNames) return res.sendStatus(422)

    const [[cardType, fields], error] = await cardTypeEntityStore.create(client.id, name, templateFront, templateBack, fieldNames)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }

    res.json({cardType, fields})
    console.log(`${LOG_PREFIX} User(${client.id}) created CardType(${cardType?.id})`)
}

export async function addCardType(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware
    if (!req.body) return res.sendStatus(422)

    const cardType: CardType = req.body.cardType

    //Todo: Check if all cardType properties has sent

    if (!cardType) return res.sendStatus(422)

    const [_, error] = await cardTypeEntityStore.add(client.id, cardType)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }
    console.log(`${LOG_PREFIX} User(${client.id}) added CardType(${cardType?.id})`)
    res.sendStatus(200)
}

export async function updateCardType(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware
    if (!req.body) return res.sendStatus(422)

    const cardType: CardType = req.body.cardType
    const fields: Field[] = req.body.fields

    //Todo: Check if all cardType properties has sent

    if (!cardType || !fields) return res.sendStatus(422)

    const [_, error] = await cardTypeEntityStore.update(client.id, cardType, fields)
    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }
    console.log(`${LOG_PREFIX} User(${client.id}) modified CardType(${cardType?.id})`)
    res.sendStatus(200)
}

export async function deleteCardType(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware
    if (!req.body) return res.sendStatus(422)

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
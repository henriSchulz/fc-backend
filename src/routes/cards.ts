import {Request, Response} from "express";
import Client from "../types/Client";
import {cardEntityStore, ERROR_PREFIX, LOG_PREFIX} from "../index";
import Card from "../types/Card";
import {isArrayOfFieldContent, isCard, isFieldContent} from "../utils";
import FieldContent from "../types/FieldContent";


//payload: Card[]
export async function getAllCards(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    const [cards, error] = await cardEntityStore.getAll(client.id)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.status(500).json({error})
    }
    res.json(cards)
}

//payload: {card: Card, fieldContents: FieldContent[]}
export async function createCard(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    if (!req.body) return res.status(422).json({error: "Invalid request Body"})

    const {stackId, cardTypeId, contents} = req.body

    if (!stackId || !cardTypeId || !contents) if (!req.body) return res.status(422).json({error: "Invalid request Body. Missing properties 'stackId', 'cardTypeId' or 'contents'"})

    const [[card, fieldContents], error] = await cardEntityStore.create(client.id, stackId, cardTypeId, contents)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.status(500).json({error})
    }

    console.log(`${LOG_PREFIX} User(${client.id}) created Card(${card?.id})`)
    res.json({payload: {card, fieldContents}})
}

//payload: Card
export async function addCard(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    if (!req.body) return res.status(422).json({error: "Invalid request Body"})

    const card: Card = req.body["card"]

    if (!isCard(card)) return res.status(422).json({error: `Invalid request Body. Object ${card} is not typeof Card`})

    const [addedCard, error] = await cardEntityStore.add(client.id, card)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.status(500).json({error})
    }
    console.log(`${LOG_PREFIX} User(${client.id}) added Card(${card?.id})`)
    res.json({payload: addedCard})
}

//no payload
export async function deleteCard(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    if (!req.body) return res.status(422).json({error: "Invalid request Body"})

    const {id: cardId} = req.body["id"]

    if (!cardId) return res.status(422).json({error: "Invalid request Body. Missing property 'id'"})

    const [_, error] = await cardEntityStore.delete(client.id, cardId)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.status(500).json({error})
    }

    console.log(`${LOG_PREFIX} User(${client.id}) deleted Card(${cardId})`)
    res.sendStatus(200)
}

//payload: {card: Card, fieldContents: FieldContent[]}
export async function updateCard(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    if (!req.body) return res.status(422).json({error: "Invalid request Body"})

    const {fieldContents, card} = req.body

    if (!isCard(card)) return res.status(422).json({error: `Invalid request Body. Object ${card} is not typeof Card`})

    if (!isArrayOfFieldContent(fieldContents)) return res.status(422).json({error: `Invalid request Body. Object ${card} is not typeof FieldContent[]`})

    const [[updatedCard, updatedFieldContents], error] = await cardEntityStore.update(client.id, card, fieldContents as FieldContent[])

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }
    console.log(`${LOG_PREFIX} User(${client.id}) modified Card(${card?.id})`)
    res.json({
        payload: {card: updatedCard, fieldContents: updatedFieldContents}
    })
}
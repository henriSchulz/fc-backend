import {Request, Response} from "express";
import Client from "../types/Client";
import {cardEntityStore, ERROR_PREFIX} from "../index";
import Card from "../types/Card";

export async function getAllCards(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    const [cards, error] = await cardEntityStore.getAll(client.id)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }
    res.json({cards})
}

export async function createCard(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    if (!req.body) return res.sendStatus(422)

    const {stackId, cardTypeId, contents} = req.body

    if (!stackId || !cardTypeId || !contents) return res.sendStatus(422)

    const [card, error] = await cardEntityStore.create(client.id, stackId, cardTypeId, contents)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }
    res.json({card})
}

export async function addCard(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware
    if (!req.body) return res.sendStatus(422)

    const card: Card = req.body["card"]

    if (!card) return res.sendStatus(422)

    if (!card.id || !card.cardTypeId
        || !card.stackId || !card.dueAt
        || !card.learningState || !card.lastModifiedAt
        || !card.version || !card.createdAt) return res.sendStatus(422)


    const [_, error] = await cardEntityStore.add(client.id, card)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }
    res.sendStatus(200)
}

export async function deleteCard(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    if (!req.body) return res.sendStatus(422)

    const {id: cardId} = req.body["id"]

    if (!cardId) return res.sendStatus(422)

    const [_, error] = await cardEntityStore.delete(client.id, cardId)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }

    res.sendStatus(200)
}

export async function updateCard(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware
    if (!req.body) return res.sendStatus(422)
    const {fieldContents, card} = req.body
    if (!card || !fieldContents) return res.sendStatus(422)

    const [_, error] = await cardEntityStore.update(client.id, card, fieldContents)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }
    res.sendStatus(200)
}
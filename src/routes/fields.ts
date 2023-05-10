import {Request, Response} from "express";
import Client from "../types/Client";
import {cardEntityStore, ERROR_PREFIX, fieldEntityStore, LOG_PREFIX} from "../index";
import Card from "../types/Card";
import {isCard, isField} from "../utils";
import Field from "../types/Field";


//payload: Field[]
export async function getAllFields(req: Request, res: Response) {
    const client: Client = req.client!

    const [fields, error] = await fieldEntityStore.getAll(client.id)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }

    res.json({payload: fields})

}

export async function addField(req: Request, res: Response) {
    const client: Client = req.client!

    if (!req.body) return res.status(422).json({error: "Invalid request Body"})

    const field: Field = req.body["field"]

    if (!isField(field)) return res.status(422).json({error: `Invalid request Body. Object ${field} is not typeof Field`})

    const [addedField, error] = await fieldEntityStore.add(client.id, field)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }
    console.log(`${LOG_PREFIX} User(${client.id}) added Field(${field?.id})`)
    res.json({payload: addedField})
}
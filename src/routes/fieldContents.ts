import {Request, Response} from "express";
import Client from "../types/Client";
import {ERROR_PREFIX, fieldContentEntityStore, LOG_PREFIX} from "../index";
import FieldContent from "../types/FieldContent";
import {isCard} from "../utils";

//payload: FieldContent[]
export async function getAllFieldContents(req: Request, res: Response) {
    const client: Client = req.client!

    const [fieldContentContents, error] = await fieldContentEntityStore.getAll(client.id)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }

    res.json({payload: fieldContentContents})

}

export async function addFieldContent(req: Request, res: Response) {
    const client: Client = req.client!

    if (!req.body) return res.status(422).json({error: "Invalid request Body"})

    const fieldContent: FieldContent = req.body["field"]

    if (!isCard(fieldContent)) return res.status(422).json({error: `Invalid request Body. Object ${fieldContent} is not typeof FieldContent`})

    const [addedFieldContent, error] = await fieldContentEntityStore.add(client.id, fieldContent)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }
    console.log(`${LOG_PREFIX} User(${client.id}) added FieldContent(${fieldContent?.id})`)
    res.json({payload: addedFieldContent})
}
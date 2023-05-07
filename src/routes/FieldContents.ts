import {Request, Response} from "express";
import Client from "../types/Client";
import {ERROR_PREFIX, fieldContentEntityStore} from "../index";

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
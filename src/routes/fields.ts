import {Request, Response} from "express";
import Client from "../types/Client";
import {ERROR_PREFIX, fieldEntityStore} from "../index";


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
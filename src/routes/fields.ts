import {Request, Response} from "express";
import Client from "../types/Client";
import {ERROR_PREFIX, fieldEntityStore} from "../index";


//payload: Field[]
export async function getAllFields(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    const [fields, error] = await fieldEntityStore.getAll(client.id)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }

    res.json({payload: fields})

}
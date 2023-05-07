import {Request, Response} from "express";
import Client from "../types/Client";
import {ERROR_PREFIX, fieldContentEntityStore} from "../index";

//payload: FieldContent[]
export async function getAllFieldContents(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    const [fieldContentContents, error] = await fieldContentEntityStore.getAll(client.id)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.status(500).json({error})
    }

    res.json({payload: fieldContentContents})

}
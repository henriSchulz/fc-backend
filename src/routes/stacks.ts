import {Request, Response} from "express";
import Client from "../types/Client";
import {ERROR_PREFIX, LOG_PREFIX, stackEntityStore} from "../index";
import Stack from "../types/Stack";
import {isStack} from "../utils";

//payload: Stack[]
export async function getAllStacks(req: Request, res: Response) {
    const client: Client = req.client!

    const [stacks, error] = await stackEntityStore.getAll(client.id)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.status(500).json({error})
    }
    res.json({
        payload: stacks ?? []
    })
}

//payload: Stack
export async function createStack(req: Request, res: Response) {
    const client: Client = req.client!

    if (!req.body) return res.status(422).json({error: "Invalid request Body"})

    const {name} = req.body

    if (!name) return res.status(422).json({error: "Invalid request Body. Property 'name' is missing"})

    const [stack, error] = await stackEntityStore.create(client.id, name)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }

    console.log(`${LOG_PREFIX} User(${client.id}) created Stack(${stack?.id})`)
    res.json({
        payload: stack
    })
}

//payload: Stack
export async function addStack(req: Request, res: Response) {
    const client: Client = req.client!

    if (!req.body) return res.status(422).json({error: "Invalid request Body"})

    const stack: Stack = req.body["stack"]



    if (!isStack(stack)) return res.status(422).json({error: `Invalid request Body. Object ${stack} is not typeof Stack`})

    const [modifiedStack, error] = await stackEntityStore.add(client.id, stack)



    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }

    console.log(`${LOG_PREFIX} User(${client.id}) added Stack(${stack.id})`)
    res.json({payload: modifiedStack})
}

//payload: Stack
export async function updateStack(req: Request, res: Response) {
    const client: Client = req.client!

    if (!req.body) return res.status(422).json({error: "Invalid request Body"})

    const {stack} = req.body

    if (!isStack(stack)) return res.status(422).json({error: `Invalid request Body. Object ${stack} is not typeof Stack`})
    const [modifiedStack, error] = await stackEntityStore.updateStack(client.id, stack)
    if (error || !modifiedStack) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }
    console.log(`${LOG_PREFIX} User(${client.id}) modified Stack(${modifiedStack!.id})`)
    res.json({payload: modifiedStack})
}

//no payload
export async function deleteStack(req: Request, res: Response) {
    const client: Client = req.client!

    if (!req.body) return res.sendStatus(422)

    const {id: stackId} = req.body

    if (!stackId) return res.sendStatus(422)

    const [_, error] = await stackEntityStore.delete(client.id, stackId)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }

    console.log(`${LOG_PREFIX} User(${client.id}) deleted Stack(${stackId})`)
    res.sendStatus(200)
}
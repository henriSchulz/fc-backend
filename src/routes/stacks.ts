import {Request, Response} from "express";
import Client from "../types/Client";
import {ERROR_PREFIX, LOG_PREFIX, stackEntityStore} from "../index";
import Stack from "../types/Stack";


export async function getAllStacks(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    const [stacks, error] = await stackEntityStore.getAll(client.id)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }
    res.json(stacks)
}

export async function createStack(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    if (!req.body) return res.sendStatus(422)

    const {name} = req.body

    if (!name) return res.sendStatus(422)

    const [stack, error] = await stackEntityStore.create(client.id, name)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }

    console.log(`${LOG_PREFIX} User(${client.id}) created Stack(${stack?.id})`)
    res.json(stack)
}

export async function addStack(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

    if (!req.body) return res.sendStatus(422)

    const stack: Stack = req.body["stack"]

    if (!stack) return res.sendStatus(422)
    if (!stack.id || !stack.name || !stack.clientId ||
        !stack.version || !stack.createdAt || !stack.lastModifiedAt) res.sendStatus(422)

    const [_, error] = await stackEntityStore.add(client.id, stack)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }

    console.log(`${LOG_PREFIX} User(${client.id}) added Stack(${stack.id})`)
    res.sendStatus(200)
}

export async function updateStack(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware
    if (!req.body) return res.sendStatus(422)

    const {name: newStackName, id: stackId} = req.body


    if (!stackId || !newStackName) return res.sendStatus(422)

    const [_, error] = await stackEntityStore.updateStackName(client.id, stackId, newStackName)

    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }

    console.log(`${LOG_PREFIX} User(${client.id}) modified Stack(${stackId})`)
    res.sendStatus(200)
}

export async function deleteStack(req: Request, res: Response) {
    const client: Client = {id: "11111111"} as Client //later imported using middleware

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
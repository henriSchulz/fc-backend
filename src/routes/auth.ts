import {NextFunction, Request, Response} from "express";
import {isValidUsername} from "../utils";
import {clientEntityStore, ERROR_PREFIX, LOG_PREFIX} from "../index";
import bcrypt from "bcrypt";
import Client from "../types/Client";


declare global {
    namespace Express {
        interface Request {
            client?: Client;
        }
    }
}


//payload: Client
export async function createClient(req: Request, res: Response) {

    if (!req.body) return res.status(422).json({error: "Invalid request Body"})

    const {userName, password} = req.body

    if (!userName || !password) return res.status(422).json({error: "Invalid request Body. Missing properties 'user' or 'password'"})
    if (password === "" || password.length > 100) return res.status(422).json({error: `Invalid password`})
    if (!isValidUsername(userName)) return res.status(422).json({error: `Invalid username`})
    if (await clientEntityStore.isUsernameTaken(userName)) return res.status(422).json({error: `Username already taken`})

    const [client, error] = await clientEntityStore.create(userName, password)

    if (error || !client) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(500)
    }
    console.log(`${LOG_PREFIX} Created Client(${client?.id}) ${client.userName}`)
    res.json({payload: client})
}

//payload: Client
export async function login(req: Request, res: Response) {
    if (!req.body) return res.status(422).json({error: "Invalid request Body"})

    const {userName, password} = req.body

    if (!userName || !password) return res.status(422).json({error: "Invalid request Body. Missing properties 'user' or 'password'"})

    const [client, error] = await clientEntityStore.getByName(userName)

    if (!client) return res.sendStatus(401)


    if (error) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(401)
    }

    if (!bcrypt.compareSync(password, client!.hash)) {
        return res.sendStatus(401)
    }
    console.log(`${LOG_PREFIX} Login Client(${client?.id}) ${client.userName}`)
    res.json({payload: client!})
}

//no payload
export async function logout(req: Request, res: Response) {
    const authorization = req.header("Authorization")
    if (!authorization) return res.sendStatus(401)
    const token = authorization.split(" ")[1]
    if (!token) return res.sendStatus(401)

    const [client, error] = await clientEntityStore.getByToken(token)

    if (error || !client) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(401)
    }

    const [_, deleteError] = await clientEntityStore.deleteToken(client.id)

    if (deleteError) {
        console.log(`${ERROR_PREFIX} ${deleteError}`)
        return res.sendStatus(500)
    }
    console.log(`${LOG_PREFIX} Logout Client(${client?.id}) ${client.userName}`)
    res.sendStatus(200)
}

//payload: Client
export async function getUser(req: Request, res: Response) {
    const authorization = req.header("Authorization")
    if (!authorization) return res.sendStatus(401)
    const token = authorization.split(" ")[1]
    if (!token) return res.sendStatus(401)

    const [client, error] = await clientEntityStore.getByToken(token)

    if (error || !client) {
        console.log(`${ERROR_PREFIX} ${error}`)
        return res.sendStatus(401)
    }

    res.json({payload: client})
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authorization = req.header("Authorization");
        if (!authorization) {
            return res.sendStatus(401);
        }
        const token = authorization.split(" ")[1];
        if (!token) {
            return res.sendStatus(401);
        }
        const [client, error] = await clientEntityStore.getByToken(token);
        if (error || !client) {
            console.log(`${ERROR_PREFIX} ${error}`);
            return res.sendStatus(401);
        }
        req.client = client; // attach the client object to the request object
        next();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

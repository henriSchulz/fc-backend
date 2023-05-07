import {Database} from "sqlite3";
import {VERSION} from "../index";
import {generateModelId, generateSessionToken} from "../utils";
import bcrypt from "bcrypt"
import {DefaultResponse} from "../types/responses/DefaultResponse";
import Client from "../types/Client";

export default class ClientEntityStore {
    private readonly database: Database
    uniqueId: string

    constructor(database: Database) {
        this.database = database
        this.uniqueId = "ef03163c-ecc5-11ed-a05b-0242ac120003"
    }


    async create(userName: string, password: string): Promise<DefaultResponse<Client>> {
        const createdAt = Date.now()
        const lastModifiedAt = Date.now()
        const version = VERSION
        const id = generateModelId()
        const hash = bcrypt.hashSync(password, 10)
        const token = generateSessionToken()
        const error = await new Promise<string|null>(resolve => {
            this.database.run(
                'INSERT INTO clients(id, createdAt, lastModifiedAt, version, userName, hash, token) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [id, createdAt, lastModifiedAt, version, userName, hash,token],
                err => err ? resolve(String(err)) : resolve(null)
            )
        })
        if (error) return [null, error]
        return [{createdAt, lastModifiedAt, version, id, hash, token, userName}, null]
    }

    getByName(userName: string): Promise<DefaultResponse<Client>> {
        return new Promise<DefaultResponse<Client>>(resolve => {
            this.database.get(
                "SELECT id, createdAt, lastModifiedAt, version, userName, hash, token FROM clients WHERE userName = ?",
                [userName],
                (err, row) => {
                    if (err) return resolve([null, String(err)])
                    resolve([row as Client, null])
                }
            )
        })
    }

    getByToken(token: string): Promise<DefaultResponse<Client>> {
        return new Promise<DefaultResponse<Client>>(resolve => {
            this.database.get(
                "SELECT id, createdAt, lastModifiedAt, version, userName, hash, token FROM clients WHERE token = ?",
                [token],
                (err, row) => {
                    if (err) resolve([null, String(err)])
                    resolve([row as Client, null])


                }
            )
        })
    }

    newToken(clientId: string): Promise<DefaultResponse<string>> {
        const token = generateSessionToken()

        return new Promise<DefaultResponse<string>>(resolve => {
            this.database.run(
                'UPDATE clients SET token = ? WHERE id = ?',
                [token, clientId],
                err => err ? resolve([null, String(err)]) : resolve([token, null])
            )
        })
    }

    isUsernameTaken(userName: string): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this.database.get(
                "SELECT id FROM clients WHERE userName = ?",
                [userName],
                (err, row) => {
                    if (err) return resolve(false)
                    if (row) return resolve(true)
                    resolve(false)
                }
            )
        })
    }

    deleteToken(clientId: string): Promise<DefaultResponse<null>> {
        return new Promise<DefaultResponse<null>>(resolve => {
            this.database.run(
                "UPDATE clients SET token = NULL WHERE id = ?",
                [clientId],
                err => {
                    if (err) return resolve([null, String(err)])
                    resolve([null, null])
                }
            )
        })
    }

}
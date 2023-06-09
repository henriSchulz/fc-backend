import {Database} from "sqlite3";
import {DefaultResponse} from "../types/responses/DefaultResponse";
import {generateModelId} from "../utils";
import Stack from "../types/Stack";
import {cardEntityStore, fieldContentEntityStore, VERSION} from "../index";

export default class StackEntityStore {
    private database: Database
    uniqueId: string

    constructor(database: Database) {
        this.database = database
        this.uniqueId = "ec976c00-5c5e-4d80-85e7-c82885cf0a87"
    }

    add(clientId: string, stack: Stack): Promise<DefaultResponse<Stack>> {
        const {id, createdAt, version, name} = stack;

        const lastModifiedAt = Date.now();
        return new Promise((resolve) => {
            this.database.run(
                'INSERT INTO stacks (id, createdAt, lastModifiedAt, version, clientId, name) VALUES (?, ?, ?, ?, ?, ?)',
                [id, createdAt, lastModifiedAt, version, clientId, name],
                (err) => {
                    if (err) {
                        resolve([null, String(err)]);
                    } else {
                        resolve([{...stack, name, lastModifiedAt, clientId}, null]);
                    }
                }
            );
        });
    }

    getAll(clientId: string): Promise<DefaultResponse<Stack[]>> {
        return new Promise((resolve) => this.database.all("SELECT * FROM stacks WHERE clientId = ?", [clientId], (err, rows: Stack[]) => {
            if (err) {
                resolve([
                    null, String(err)
                ])
            } else {
                resolve([rows, null])
            }
        }))
    }

    create(clientId: string, name: string): Promise<DefaultResponse<Stack>> {
        return new Promise((resolve) => {
            const id = generateModelId();
            const createdAt = Date.now()
            const lastModifiedAt = createdAt;
            const version = VERSION;

            const stack: Stack = {
                id, createdAt, lastModifiedAt, version, clientId, name
            }

            this.database.run(
                'INSERT INTO stacks(id, createdAt, lastModifiedAt, version, clientId, name) VALUES (?, ?, ?, ?, ?, ?)',
                [id, createdAt, lastModifiedAt, version, clientId, name],
                (err) => {
                    if (err) {
                        resolve([null, String(err)])
                    } else {
                        resolve([stack, null]);
                    }
                }
            );
        });
    }

    async delete(clientId: string, stackId: string): Promise<DefaultResponse<null>> {
        const [_, error] = await new Promise<DefaultResponse<null>>((resolve) => {
            this.database.run(
                'DELETE FROM stacks WHERE id = ? AND clientId = ?',
                [stackId, clientId],
                (err) => {
                    if (err) {
                        resolve([null, String(err)])
                    } else {
                        resolve([null, null]);
                    }
                }
            );
        });

        if (error) return [null, error]

        const [__, _error] = await cardEntityStore.deleteByStackId(clientId, stackId)

        if (_error) return [null, _error]

        return [null, null]
    }

    updateStack(clientId: string, stack: Stack): Promise<DefaultResponse<Stack>> {
        return new Promise((resolve) => {
            const {version, createdAt, id, ...newStack} = stack
            const {name} = newStack
            const lastModifiedAt = Date.now()

            this.database.run(
                'UPDATE stacks SET name = ?, lastModifiedAt = ? WHERE id = ? AND clientId = ?',
                [name, lastModifiedAt, id, clientId],
                (err) => {
                    if (err) {
                        resolve([null, String(err)])
                    } else {
                        resolve([{...stack, lastModifiedAt, clientId}, null]);
                    }
                }
            );
        });
    }

}
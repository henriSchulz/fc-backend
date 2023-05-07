import {DefaultResponse} from "../types/responses/DefaultResponse";
import Field from "../types/Field";
import {VERSION} from "../index";
import {generateModelId} from "../utils";
import {Database} from "sqlite3";

export default class FieldEntityStore {

    private database: Database;
    uniqueId: string;

    constructor(database: Database) {
        this.database = database;
        this.uniqueId = "bf629b15-e95b-4b52-8571-3e5550e47ee8"
    }

    add(clientId: string, field: Field): Promise<DefaultResponse<Field>> {
        const {id, createdAt, version, name, cardTypeId} = field;
        const lastModifiedAt = Date.now()
        return new Promise((resolve) => {
            this.database.run(
                'INSERT INTO fields (id, createdAt, lastModifiedAt, version, name, cardTypeId, clientId) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [id, createdAt, lastModifiedAt, version, name, cardTypeId, clientId],
                err => {
                    if (err) {
                        resolve([null, String(err)]);
                    } else {
                        resolve([{...field, lastModifiedAt, clientId}, null]);
                    }
                }
            );
        });
    }

    getAll(clientId: string): Promise<DefaultResponse<Field[]>> {
        return new Promise((resolve) => {
            this.database.all(
                'SELECT * FROM fields WHERE clientId = ?',
                [clientId],
                (err, rows: Field[]) => {
                    if (err) {
                        resolve([null, String(err)]);
                    } else {
                        resolve([rows, null]);
                    }
                }
            );
        });
    }

    getAllByCardType(clientId: string, cardTypeId: string): Promise<DefaultResponse<Field[]>> {
        return new Promise((resolve) => {
            this.database.all(
                'SELECT * FROM fields WHERE clientId = ? AND cardTypeId = ?',
                [clientId, cardTypeId],
                (err, rows: Field[]) => {
                    if (err) {
                        resolve([null, String(err)]);
                    } else {
                        resolve([rows, null]);
                    }
                }
            );
        });
    }

    create(clientId: string, cardTypeId: string, name: string): Promise<DefaultResponse<Field>> {
        const id = generateModelId();
        const createdAt = Date.now();
        const lastModifiedAt = createdAt;
        const version = VERSION;

        const field: Field = {
            id,
            createdAt,
            lastModifiedAt,
            version,
            clientId,
            cardTypeId,
            name,
        };

        return new Promise((resolve) => {
            this.database.run(
                'INSERT INTO fields (id, createdAt, lastModifiedAt, version, name, cardTypeId, clientId) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    id,
                    createdAt,
                    lastModifiedAt,
                    version,
                    name,
                    cardTypeId,
                    clientId,
                ],
                err => {
                    if (err) {
                        resolve([null, String(err)]);
                    } else {
                        resolve([field, null]);
                    }
                }
            );
        });
    }

    delete(clientId: string, cardTypeId: string, fieldId: string): Promise<DefaultResponse<null>> {
        return new Promise((resolve) => {
            this.database.run(
                'DELETE FROM fields WHERE id = ? AND cardTypeId = ? AND clientId = ?',
                [fieldId, cardTypeId, clientId],
                (err) => {
                    if (err) {
                        resolve([null, String(err)])
                    } else {
                        resolve([null, null]);
                    }
                }
            );
        });
    }

    deleteByCardTypeId(clientId: string, cardTypeId: string): Promise<DefaultResponse<null>> {
        return new Promise((resolve) => {
            this.database.run(
                'DELETE FROM fields cardTypeId = ? AND clientId = ?',
                [cardTypeId, clientId],
                (err) => {
                    if (err) {
                        resolve([null, String(err)])
                    } else {
                        resolve([null, null]);
                    }
                }
            );
        });
    }


    update(clientId: string, field: Field): Promise<DefaultResponse<Field>> {
        const {id: fieldId, cardTypeId, ...newField} = field;
        return new Promise((resolve) => {
            const {name} = newField;
            const lastModifiedAt = Date.now();
            this.database.run(
                `UPDATE fields
                 SET name           = ?,
                     lastModifiedAt = ?
                 WHERE id = ?
                   AND cardTypeId = ?
                   AND clientId = ?`,
                [name, lastModifiedAt, fieldId, cardTypeId, clientId],
                (err) => {
                    if (err) {
                        resolve([null, String(err)]);
                    } else {
                        resolve([{...field, lastModifiedAt, clientId}, null]);
                    }
                }
            );
        });
    }
}

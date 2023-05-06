import {DefaultResponse} from "../types/responses/DefaultResponse";
import Field from "../types/Field";
import {VERSION} from "../index";
import {generateModelId} from "../utils";
import {Database} from "sqlite3";

export default class FieldEntityStore {

    private database: Database;

    constructor(database: Database) {
        this.database = database;
    }

    getAll(clientId: string): Promise<DefaultResponse<Field[]>> {
        return new Promise((resolve) => {
            this.database.all(
                'SELECT * FROM fields WHERE client_id = ?',
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
                'SELECT * FROM fields WHERE client_id = ? AND card_type_id = ?',
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
                'INSERT INTO fields (id, created_at, last_modified_at, version, name, card_type_id, client_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
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
                'DELETE FROM fields WHERE id = ? AND card_type_id = ? AND client_id = ?',
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

    update(field: Field): Promise<DefaultResponse<null>> {
        const { id: fieldId, clientId, cardTypeId, ...newField } = field;
        return new Promise((resolve) => {
            const { name } = newField;
            const lastModifiedAt = Date.now();
            this.database.run(
                `UPDATE fields SET name = ?, last_modified_at = ? WHERE id = ? AND card_type_id = ? AND client_id = ?`,
                [name, lastModifiedAt, fieldId, cardTypeId, clientId],
                (err) => {
                    if (err) {
                        resolve([null, String(err)]);
                    } else {
                        resolve([null, null]);
                    }
                }
            );
        });
    }
}

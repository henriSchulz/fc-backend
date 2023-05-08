import {DefaultResponse} from "../types/responses/DefaultResponse";
import FieldContent from "../types/FieldContent";
import {generateModelId, isCard} from "../utils";
import {ERROR_PREFIX, fieldContentEntityStore, fieldEntityStore, LOG_PREFIX, VERSION} from "../index";
import {Database} from "sqlite3";
import {Request, Response} from "express";
import Client from "../types/Client";
import Field from "../types/Field";

export default class FieldContentEntityStore {

    private database: Database
    uniqueId: string

    constructor(database: Database) {
        this.database = database
        this.uniqueId = "aabfcb48-b452-4919-a0a1-51e3c573de81"
    }

    add(clientId: string, fieldContent: FieldContent): Promise<DefaultResponse<FieldContent>> {
        const {id, createdAt, version, fieldId, cardId, stackId, content} = fieldContent;
        const lastModifiedAt = Date.now()
        return new Promise((resolve) => {
            this.database.run(
                'INSERT INTO fieldContents (id, createdAt, lastModifiedAt, version, fieldId, cardId, stackId, clientId, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [id, createdAt, lastModifiedAt, version, fieldId, cardId, stackId, clientId, content],
                err => {
                    if (err) {
                        resolve([null, String(err)]);
                    } else {
                        resolve([{...fieldContent, lastModifiedAt, clientId}, null]);
                    }
                }
            );
        });
    }


    getAll(clientId: string): Promise<DefaultResponse<FieldContent[]>> {
        return new Promise((resolve) => {
            this.database.all(
                'SELECT * FROM fieldContents WHERE clientId = ?',
                [clientId],
                (err, rows: FieldContent[]) => {
                    if (err) {
                        resolve([null, String(err)]);
                    } else {
                        resolve([rows, null]);
                    }
                }
            );
        });
    }

    create(clientId: string, fieldId: string, cardId: string, stackId: string, content: string): Promise<DefaultResponse<FieldContent>> {
        const id = generateModelId();
        const createdAt = Date.now();
        const lastModifiedAt = createdAt;
        const version = VERSION;

        const fieldContent: FieldContent = {
            id,
            createdAt,
            lastModifiedAt,
            version,
            fieldId,
            cardId,
            stackId,
            clientId,
            content
        }

        return new Promise((resolve) => {
            this.database.run(
                'INSERT INTO fieldContents (id, createdAt, lastModifiedAt, version, fieldId, cardId, stackId, clientId, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)',
                [
                    id,
                    createdAt,
                    lastModifiedAt,
                    version,
                    fieldId,
                    cardId,
                    stackId,
                    clientId,
                    content
                ],
                err => {
                    if (err) {
                        resolve([null, String(err)]);
                    } else {
                        resolve([fieldContent, null]);
                    }
                }
            );
        });
    }

    delete(clientId: string, fieldContentId: string): Promise<DefaultResponse<null>> {
        return new Promise((resolve) => {
            this.database.run(
                'DELETE FROM fieldContents WHERE id = ? AND clientId = ?',
                [fieldContentId, clientId],
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

    deleteByCard(clientId: string, cardId: string): Promise<DefaultResponse<null>> {
        return new Promise((resolve) => {
            this.database.run(
                'DELETE FROM fieldContents WHERE cardId = ? AND clientId = ?',
                [cardId, clientId],
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

    update(clientId: string, fieldContent: FieldContent): Promise<DefaultResponse<FieldContent>> {
        const {id: fieldContentId, createdAt, stackId, cardId, fieldId, version, ...newFieldContent} = fieldContent;
        return new Promise((resolve) => {
            const {content} = newFieldContent;
            const lastModifiedAt = Date.now();

            const updatedFieldContent: FieldContent = {
                ...fieldContent, lastModifiedAt, clientId
            }

            this.database.run(`UPDATE fieldContents
                               SET content        = ?,
                                   lastModifiedAt = ?
                               WHERE id = ?
                                 AND clientId = ?`,
                [content, lastModifiedAt, fieldContentId, clientId],
                (err) => {
                    if (err) {
                        resolve([null, String(err)]);
                    } else {
                        resolve([updatedFieldContent, null]);
                    }
                }
            );
        });
    }
}



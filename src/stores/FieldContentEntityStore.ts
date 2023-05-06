import {DefaultResponse} from "../types/responses/DefaultResponse";
import FieldContent from "../types/FieldContent";
import {generateModelId} from "../utils";
import {VERSION} from "../index";
import {Database} from "sqlite3";

export default class FieldContentEntityStore {

    private database: Database
    uniqueId: string

    constructor(database: Database) {
        this.database = database
        this.uniqueId = "aabfcb48-b452-4919-a0a1-51e3c573de81"
    }

    add(clientId: string, fieldContent: FieldContent): Promise<DefaultResponse<null>> {
        const {id, createdAt, version, fieldId, cardId, stackId, content} = fieldContent;
        const lastModifiedAt = Date.now()
        return new Promise((resolve) => {
            this.database.run(
                'INSERT INTO fieldContents (id, created_at, last_modified_at, version, field_id, card_id, stack_id, client_id, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [id, createdAt, lastModifiedAt, version, fieldId, cardId, stackId, clientId, content],
                err => {
                    if (err) {
                        resolve([null, String(err)]);
                    } else {
                        resolve([null, null]);
                    }
                }
            );
        });
    }


    getAll(clientId: string): Promise<DefaultResponse<FieldContent[]>> {
        return new Promise((resolve) => {
            this.database.all(
                'SELECT * FROM fieldContents WHERE client_id = ?',
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
                'INSERT INTO fieldContents (id, created_at, last_modified_at, version, field_id, card_id, stack_id, client_id, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)',
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
                'DELETE FROM fieldContents WHERE id = ? AND client_id = ?',
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
                'DELETE FROM fieldContents WHERE card_id = ? AND client_id = ?',
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

    update(fieldContent: FieldContent): Promise<DefaultResponse<null>> {
        const {id: fieldContentId, clientId, ...newFieldContent} = fieldContent;
        return new Promise((resolve) => {
            const {content} = newFieldContent;
            const lastModifiedAt = Date.now();
            this.database.run(`UPDATE fieldContents
                               SET content = ?,
                                   last_modified_at = ?
                               WHERE id = ?
                                 AND client_id = ?`,
                [content, lastModifiedAt, fieldContentId, clientId],
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

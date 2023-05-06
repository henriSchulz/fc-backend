import {DefaultResponse} from "../types/responses/DefaultResponse";
import FieldContent from "../types/FieldContent";
import {generateModelId} from "../utils";
import {VERSION} from "../index";
import {Database} from "sqlite3";

export default class FieldContentEntityStore {

    private database: Database

    constructor(database: Database) {
        this.database = database
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

    create(fieldId: string, cardId: string, stackId: string, clientId: string, content: string): Promise<DefaultResponse<FieldContent>> {
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

    delete(fieldContentId: string, clientId: string): Promise<DefaultResponse<null>> {
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

    update(fieldContent: FieldContent): Promise<DefaultResponse<null>> {
        const {id: fieldContentId, clientId, ...newFieldContent} = fieldContent;
        return new Promise((resolve) => {
            const {content} = newFieldContent;
            const lastModifiedAt = Date.now();
            this.database.run(`UPDATE fieldContents SET content = ?,last_modified_at = ? WHERE id = ? AND client_id = ?`,
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

import {Database} from "sqlite3";
import {DefaultResponse} from "../types/responses/DefaultResponse";
import Card from "../types/Card";
import {generateModelId} from "../utils";
import {fieldContentEntityStore, VERSION} from "../index";
import FieldContentEntityStore from "./FieldContentEntityStore";
import FieldContent from "../types/FieldContent";


export default class CardEntityStore {
    private readonly database: Database
    uniqueId: string

    constructor(database: Database) {
        this.database = database
        this.uniqueId = "cbeeab63-87f1-4f41-b114-89588f59c8ed"
    }

    add(clientId: string, card: Card): Promise<DefaultResponse<null>> {
        const {id, createdAt, version, stackId, cardTypeId, dueAt, learningState, paused} = card;
        const lastModifiedAt = Date.now()
        return new Promise((resolve) => {
            this.database.run(
                'INSERT INTO cards (id, created_at, last_modified_at, version, client_id, stack_id, card_type_id, due_at, learning_state, paused) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    id,
                    createdAt,
                    lastModifiedAt,
                    version,
                    clientId,
                    stackId,
                    cardTypeId,
                    dueAt,
                    learningState,
                    paused,
                ],
                err => {
                    if (err) {
                        resolve([null, String(err)])
                    } else {
                        resolve([null, null])
                    }
                }
            )
        })
    }

    getAll(clientId: string): Promise<DefaultResponse<Card[]>> {
        return new Promise((resolve) => this.database.all("SELECT * FROM cards WHERE client_id = ?", [clientId], (err, rows: Card[]) => {
            if (err) {
                resolve([
                    null, String(err)
                ])
            } else {
                resolve([rows, null])
            }
        }))
    }

    getAllByStackId(stackId: string, clientId: string): Promise<DefaultResponse<Card[]>> {
        return new Promise((resolve) => {
            this.database.all(
                "SELECT * FROM cards WHERE stack_id = ? AND client_id = ?",
                [stackId, clientId],
                (err, rows: Card[]) => {
                    if (err) {
                        resolve([null, String(err)]);
                    } else {
                        resolve([rows, null]);
                    }
                }
            );
        });
    }

    //contents: Record of Field ID and content of that field
    async create(clientId: string, stackId: string, cardTypeId: string, contents: Record<string, string>): Promise<DefaultResponse<Card>> {
        const id = generateModelId()
        const dueAt = Date.now()
        const createdAt = dueAt
        const lastModifiedAt = dueAt
        const learningState = 0
        const paused = 0
        const version = VERSION

        const card: Card = {
            id,
            createdAt,
            lastModifiedAt,
            version,
            clientId,
            stackId,
            cardTypeId,
            dueAt,
            learningState,
            paused: paused as unknown as boolean
        }

        const [_card, error] = await new Promise<DefaultResponse<Card>>((resolve) => {
            this.database.run(
                'INSERT INTO cards (id, created_at, last_modified_at, version ,client_id, stack_id, card_type_id, due_at, learning_state, paused) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    id,
                    createdAt,
                    lastModifiedAt,
                    version,
                    clientId,
                    stackId,
                    cardTypeId,
                    dueAt,
                    learningState,
                    paused,
                ],
                function (err) {
                    if (err) {
                        resolve([null, String(err)])
                    } else {
                        resolve([card, null])
                    }
                }
            );
        });

        if (error) {
            return [null, error]
        }


        for (const [fieldId, content] of Object.entries(contents)) {
            const [_, error] = await fieldContentEntityStore.create(clientId, fieldId, card.id, stackId, content)
            if (error) return [null, error]
        }

        return [null, null]

    }

    async delete(clientId: string, cardId: string): Promise<DefaultResponse<null>> {

        const [_, error] = await new Promise<DefaultResponse<null>>((resolve) => {
            this.database.run(
                'DELETE FROM cards WHERE id = ? AND client_id = ?',
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

        if (error) return [null, error]

        const [__, _error] = await fieldContentEntityStore.deleteByCard(clientId, cardId)

        return [null, error]

    }

    async update(clientId: string, card: Card, fieldContents: FieldContent[]): Promise<DefaultResponse<null>> {
        const {id: cardId, ...newCard} = card;
        const [_, error] = await new Promise<DefaultResponse<null>>((resolve) => {
            const {dueAt, learningState, paused} = newCard;
            const lastModifiedAt = Date.now();
            this.database.run(
                `UPDATE cards
                 SET due_at           = ?,
                     learning_state   = ?,
                     paused           = ?,
                     last_modified_at = ?
                 WHERE id = ?
                   AND client_id = ?`,
                [
                    dueAt,
                    learningState,
                    paused,
                    lastModifiedAt,
                    cardId,
                    clientId,
                ],
                (err) => {
                    if (err) {
                        resolve([null, String(err)]);
                    } else {
                        resolve([null, null]);
                    }
                }
            );
        });
        if (error) {
            return [null, error]
        }


        for (const fieldContent of fieldContents) {
            const [__, _error] = await fieldContentEntityStore.update(clientId, fieldContent)
            if (_error) return [null, _error]
        }
    }
}
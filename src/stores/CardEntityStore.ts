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

    add(clientId: string, card: Card): Promise<DefaultResponse<Card>> {
        const {id, createdAt, version, stackId, cardTypeId, dueAt, learningState, paused} = card;
        const lastModifiedAt = Date.now()
        const addedCard: Card = {...card, lastModifiedAt, clientId}
        return new Promise((resolve) => {
            this.database.run(
                'INSERT INTO cards (id, createdAt, lastModifiedAt, version, clientId, stackId, cardTypeId, dueAt, learningState, paused) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
                        resolve([addedCard, null])
                    }
                }
            )
        })
    }

    getAll(clientId: string): Promise<DefaultResponse<Card[]>> {
        return new Promise((resolve) => this.database.all("SELECT * FROM cards WHERE clientId = ?", [clientId],
            (err, rows: { paused: 0 | 1, [key: string]: any }[]) => {
            if (err) {
                resolve([
                    null, String(err)
                ])
            } else {
                const updatedRows = rows.map((row) => {
                    return {
                        ...row,
                        paused: row.paused === 1
                    };
                });
                resolve([updatedRows as Card[], null]);
            }

        }))
    }

    //updating row is unimportant, bc its only use for the id's
    getAllByCardTypeId(clientId: string, cardTypeId: string): Promise<DefaultResponse<Card[]>> {
        return new Promise((resolve) => this.database.all("SELECT * FROM cards WHERE clientId = ? AND cardTypeId = ?", [clientId, cardTypeId], (err, rows: Card[]) => {
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
                "SELECT * FROM cards WHERE stackId = ? AND clientId = ?",
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
    async create(clientId: string, stackId: string, cardTypeId: string, contents: Record<string, string>): Promise<DefaultResponse<[Card, FieldContent[]]>> {
        const id = generateModelId()
        const dueAt = Date.now()
        const createdAt = dueAt
        const lastModifiedAt = dueAt
        const learningState = 0
        const paused = 0
        const version = VERSION


        const [card, error] = await new Promise<DefaultResponse<Card>>((resolve) => {
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
            this.database.run(
                'INSERT INTO cards (id, createdAt, lastModifiedAt, version ,clientId, stackId, cardTypeId, dueAt, learningState, paused) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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

        const fieldContents: FieldContent[] = []

        for (const [fieldId, content] of Object.entries(contents)) {
            const [fieldContent, error] = await fieldContentEntityStore.create(clientId, fieldId, card!.id, stackId, content)
            if (error) return [null, error]
            fieldContents.push(fieldContent!)
        }

        return [[card!, fieldContents], null]

    }

    async delete(clientId: string, cardId: string): Promise<DefaultResponse<null>> {

        const [_, error] = await new Promise<DefaultResponse<null>>((resolve) => {
            this.database.run(
                'DELETE FROM cards WHERE id = ? AND clientId = ?',
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

        if (_error) return [null, _error]

        return [null, null]

    }

    async deleteByCardTypeId(clientId: string, cardTypeId: string) {

        const [cardsToDelete, ___error] = await this.getAllByCardTypeId(clientId, cardTypeId)

        if (___error) return [null, ___error]

        const [_, error] = await new Promise<DefaultResponse<null>>((resolve) => {
            this.database.run(
                'DELETE FROM cards WHERE cardTypeId = ? AND clientId = ?',
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

        if (error) return [null, error]

        for (const cardToDelete of cardsToDelete || []) {
            const [__, _error] = await fieldContentEntityStore.deleteByCard(clientId, cardToDelete.id)
            if (_error) return [null, _error]
        }

        return [null, null]
    }

    async deleteByStackId(clientId: string, stackId: string) {

        const [cardsToDelete, ___error] = await this.getAllByStackId(clientId, stackId)

        if (___error) return [null, ___error]

        const [_, error] = await new Promise<DefaultResponse<null>>((resolve) => {
            this.database.run(
                'DELETE FROM cards WHERE stackId = ? AND clientId = ?',
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
        for (const cardToDelete of cardsToDelete || []) {
            const [__, _error] = await fieldContentEntityStore.deleteByCard(clientId, cardToDelete.id)
            if (_error) return [null, _error]
        }
        return [null, null]
    }

    async update(clientId: string, card: Card, fieldContents: FieldContent[]): Promise<DefaultResponse<[Card, FieldContent[]]>> {
        const {id: cardId, version, createdAt, ...newCard} = card;
        const [updatedCard, error] = await new Promise<DefaultResponse<Card>>((resolve) => {
            const {dueAt, learningState, paused} = newCard;
            const lastModifiedAt = Date.now();

            const updatedCard: Card = {
                ...card, lastModifiedAt, clientId
            }

            this.database.run(
                `UPDATE cards
                 SET dueAt          = ?,
                     learningState  = ?,
                     paused         = ?,
                     lastModifiedAt = ?
                 WHERE id = ?
                   AND clientId = ?`,
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
                        resolve([updatedCard, null]);
                    }
                }
            );
        });
        if (error) {
            return [null, error]
        }
        const updatedFieldContents: FieldContent[] = []

        for (const fieldContent of fieldContents) {
            const [updatedFieldContent, _error] = await fieldContentEntityStore.update(clientId, fieldContent)
            if (_error) return [null, _error]
            updatedFieldContents.push(updatedFieldContent!)
        }
        return [[updatedCard!, updatedFieldContents], null]
    }
}
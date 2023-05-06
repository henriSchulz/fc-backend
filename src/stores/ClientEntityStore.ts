import {Database} from "sqlite3";
import {DefaultResponse} from "../types/responses/DefaultResponse";
import Card from "../types/Card";
import {generateModelId} from "../utils";
import {VERSION} from "../index";

export class ClientEntityStore {
    private database: Database

    constructor(database: Database) {
        this.database = database
    }

    getAll(clientId: string): Promise<DefaultResponse<Card>> {
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

    create(clientId: string, stackId: string, cardTypeId: string): Promise<DefaultResponse<Card>> {

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
            paused: paused === 1
        }

        return new Promise((resolve) => {
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
    }

    delete(clientId: string, cardId: string): Promise<DefaultResponse<null>> {
        return new Promise((resolve) => {
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
    }

    updateDueAt(clientId: string, cardId: string, newDueAt: number): Promise<DefaultResponse<null>> {
        return new Promise((resolve) => {
            this.database.run(
                'UPDATE cards SET due_at = ?, last_modified_at = ? WHERE id = ? AND client_id = ?',
                [newDueAt, Date.now(), cardId, clientId],
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

    updateLearningState(clientId: string, cardId: string, newLearningState: number): Promise<DefaultResponse<null>> {
        return new Promise((resolve) => {
            this.database.run(
                'UPDATE cards SET learning_state = ?, last_modified_at = ? WHERE id = ? AND client_id = ?',
                [newLearningState, Date.now(), cardId, clientId],
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

    updatePaused(clientId: string, cardId: string, newPaused: boolean): Promise<DefaultResponse<null>> {
        return new Promise((resolve) => {
            this.database.run(
                'UPDATE cards SET paused = ?, last_modified_at = ? WHERE id = ? AND client_id = ?',
                [newPaused ? 1 : 0, Date.now(), cardId, clientId],
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

    update(card: Card): Promise<DefaultResponse<null>> {
        const { clientId, id: cardId, ...newCard } = card;
        return new Promise((resolve) => {
            const { cardTypeId, dueAt, learningState, paused } = newCard;
            const lastModifiedAt = Date.now();
            this.database.run(
                `UPDATE cards SET
        card_type_id = ?,
        due_at = ?,
        learning_state = ?,
        paused = ?,
        last_modified_at = ?
      WHERE
        id = ? AND client_id = ?`,
                [
                    cardTypeId,
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
    }


}
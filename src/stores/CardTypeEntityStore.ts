import {Database} from "sqlite3";
import {DefaultResponse} from "../types/responses/DefaultResponse";
import CardType from "../types/CardType";
import {generateModelId} from "../utils";
import {VERSION} from "../index";

export default class CardTypeEntityStore {

    private database: Database

    constructor(database: Database) {
        this.database = database
    }

    add(cardType: CardType): Promise<DefaultResponse<null>> {
        const {id, createdAt, version, clientId, name, templateFront, templateBack} = cardType;
        const lastModifiedAt = Date.now()
        return new Promise((resolve) => {
            this.database.run(
                'INSERT INTO card_types (id, created_at, last_modified_at, version, client_id, name, template_front, template_back) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [id, createdAt, lastModifiedAt, version, clientId, name, templateFront, templateBack],
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


    getAll(clientId: string): Promise<DefaultResponse<CardType[]>> {
        return new Promise((resolve) => {
            this.database.all(
                'SELECT * FROM card_types WHERE client_id = ?',
                [clientId],
                (err, rows: CardType[]) => {
                    if (err) {
                        resolve([null, String(err)]);
                    } else {
                        resolve([rows, null]);
                    }
                }
            );
        });
    }

    create(clientId: string, name: string, templateFront: string, templateBack: string): Promise<DefaultResponse<CardType>> {
        const id = generateModelId();
        const createdAt = Date.now();
        const lastModifiedAt = createdAt;
        const version = VERSION;

        const cardType: CardType = {
            id,
            createdAt,
            lastModifiedAt,
            version,
            clientId,
            name,
            templateFront,
            templateBack,
        };

        return new Promise((resolve) => {
            this.database.run(
                'INSERT INTO card_types (id, created_at, last_modified_at, version, client_id, name, template_front, template_back) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    id,
                    createdAt,
                    lastModifiedAt,
                    version,
                    clientId,
                    name,
                    templateFront,
                    templateBack,
                ],
                err => {
                    if (err) {
                        resolve([null, String(err)]);
                    } else {
                        resolve([cardType, null]);
                    }
                }
            );
        });
    }

    delete(clientId: string, cardTypeId: string): Promise<DefaultResponse<null>> {
        return new Promise((resolve) => {
            this.database.run(
                'DELETE FROM card_types WHERE id = ? AND client_id = ?',
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

    update(cardType: CardType): Promise<DefaultResponse<null>> {
        const {id: cardTypeId, clientId, ...newCardType} = cardType;
        return new Promise((resolve) => {
            const {name, templateFront, templateBack} = newCardType;
            const lastModifiedAt = Date.now();
            this.database.run(
                `UPDATE card_types
                 SET name             = ?,
                     template_front   = ?,
                     template_back    = ?,
                     last_modified_at = ?
                 WHERE id = ?
                   AND client_id = ?`,
                [name, templateFront, templateBack, lastModifiedAt, cardTypeId, clientId],
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
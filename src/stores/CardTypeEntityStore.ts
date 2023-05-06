import {Database} from "sqlite3";
import {DefaultResponse} from "../types/responses/DefaultResponse";
import CardType from "../types/CardType";
import {generateModelId} from "../utils";
import {fieldEntityStore, VERSION} from "../index";
import FieldEntityStore from "./FieldEntityStore";
import Field from "../types/Field";

export default class CardTypeEntityStore {

    private database: Database
    uniqueId: string

    constructor(database: Database) {
        this.database = database
        this.uniqueId = "8cd6cae3-8486-4136-8e34-b59279b7b6bd"
    }

    add(clientId: string, cardType: CardType): Promise<DefaultResponse<null>> {
        const {id, createdAt, version, name, templateFront, templateBack} = cardType;
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

    async create(clientId: string, name: string, templateFront: string, templateBack: string, fieldNames: string[]): Promise<DefaultResponse<[CardType, Field[]]>> {
        const id = generateModelId();
        const createdAt = Date.now();
        const lastModifiedAt = createdAt;
        const version = VERSION;


        const [cardType, error] = await new Promise<DefaultResponse<CardType>>((resolve) => {
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

        if (error) return [null, error]

        const fields: Field[] = []

        for (const fieldName of fieldNames) {
            const [field, error] = await fieldEntityStore.create(clientId, cardType!.id, fieldName)
            if (error) return [null, error]
            fields.push(field!)
        }

        return [[cardType!, fields], null]
    }

    async delete(clientId: string, cardTypeId: string): Promise<DefaultResponse<null>> {
        const [_, error] = await new Promise<DefaultResponse<null>>((resolve) => {
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
        if (error) return [null, error]
        const [__, _error] = await fieldEntityStore.deleteByCardTypeId(clientId, cardTypeId)

        if(_error) return [null, _error]

        return [null, null]
    }

    async update(clientId: string, cardType: CardType, fields: Field[]): Promise<DefaultResponse<null>> {
        const {id: cardTypeId, ...newCardType} = cardType;
        const [_, error] = await new Promise<DefaultResponse<null>>((resolve) => {
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

        if (error) return [null, error]

        for (const field of fields) {
            const [__, _error] = await fieldEntityStore.update(clientId, field)
            if (_error) return [null, _error]
        }

        return [null, null]

    }
}
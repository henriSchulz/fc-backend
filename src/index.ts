import express, {Request, Response} from 'express';
import sqlite3 from "sqlite3";
import fs from "fs"
import {createSQLTables} from "./sqlUntils";
import StackEntityStore from "./stores/StackEntityStore";
import CardEntityStore from "./stores/CardEntityStore";
import FieldContentEntityStore from "./stores/FieldContentEntityStore";
import FieldEntityStore from "./stores/FieldEntityStore";
import CardTypeEntityStore from "./stores/CardTypeEntityStore";


export const VERSION = 1

const database = new sqlite3.Database(`${__dirname}/data/fc_data.db`)

createSQLTables(database)

const stackEntityStore = new StackEntityStore(database)
const cardEntityStore = new CardEntityStore(database)
const fieldEntityStore = new FieldEntityStore(database)
const fieldContentEntityStore = new FieldContentEntityStore(database)
const cardTypeEntityStore = new CardTypeEntityStore(database)

async function main() {
    const clientId = "11111111"
    const stackId = "cc061128"
    const cardTypeId = "40f9dccc"
    const field1Id = "c0c3264b"
    const field2Id = "ed481638"
    const cardId = "e92dedda"


    await fieldContentEntityStore.create(clientId,field1Id, cardId,stackId, "Hallo")
    await fieldContentEntityStore.create(clientId,field2Id, cardId,stackId, "Hallo")


}

main()

// const app = express();
//
//
// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello, World!');
// });
//
// const port = process.env.PORT || 3000;
//
//
// app.listen(port, () => {
//     console.log(`Server listening on port ${port}.`);
// });

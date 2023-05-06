import express, {Request, Response} from 'express';
import sqlite3 from "sqlite3";
import fs from "fs"
import {createSQLTables} from "./sqlUntils";
import {StackEntityStore} from "./stores/StackEntityStore";
import {ClientEntityStore} from "./stores/ClientEntityStore";


export const VERSION = 1

const database = new sqlite3.Database(`${__dirname}/data/fc_data.db`)

createSQLTables(database)

const stackEntityStore = new StackEntityStore(database)
const clientEntityStore = new ClientEntityStore(database)


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

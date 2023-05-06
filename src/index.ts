import express, {Request, Response} from 'express';
import sqlite3 from "sqlite3";
import fs from "fs"
import {createSQLTables} from "./sqlUntils";
import StackEntityStore from "./stores/StackEntityStore";
import CardEntityStore from "./stores/CardEntityStore";
import FieldContentEntityStore from "./stores/FieldContentEntityStore";
import FieldEntityStore from "./stores/FieldEntityStore";
import CardTypeEntityStore from "./stores/CardTypeEntityStore";
import Client from "./types/Client";
import {addStack, createStack, deleteStack, getAllStacks, updateStack} from "./routes/stacks";
import {addCard, createCard, deleteCard, getAllCards, updateCard} from "./routes/cards";


export const VERSION = 1
export const DEFAULT_ROUTE = `/api/v${VERSION}`
export const LOG_PREFIX = "[LOG]"
export const ERROR_PREFIX = "[ERROR]"

const database = new sqlite3.Database(`${__dirname}/data/fc_data.db`)

createSQLTables(database)

export const stackEntityStore = new StackEntityStore(database)
export const cardEntityStore = new CardEntityStore(database)
export const fieldEntityStore = new FieldEntityStore(database)
export const fieldContentEntityStore = new FieldContentEntityStore(database)
export const cardTypeEntityStore = new CardTypeEntityStore(database)


const app = express();

app.use(express.json())

//stack routes
app.get(`${DEFAULT_ROUTE}/${stackEntityStore.uniqueId}`, getAllStacks)
app.post(`${DEFAULT_ROUTE}/${stackEntityStore.uniqueId}/create`, createStack)
app.post(`${DEFAULT_ROUTE}/${stackEntityStore.uniqueId}/add`, addStack)
app.post(`${DEFAULT_ROUTE}/${stackEntityStore.uniqueId}/update`, updateStack)
app.post(`${DEFAULT_ROUTE}/${stackEntityStore.uniqueId}/delete`, deleteStack)


//card routes
app.get(`${DEFAULT_ROUTE}/${cardEntityStore.uniqueId}`, getAllCards)
app.post(`${DEFAULT_ROUTE}/${cardEntityStore.uniqueId}/create`, createCard)
app.post(`${DEFAULT_ROUTE}/${cardEntityStore.uniqueId}/add`, addCard)
app.post(`${DEFAULT_ROUTE}/${cardEntityStore.uniqueId}/update`, updateCard)
app.post(`${DEFAULT_ROUTE}/${cardEntityStore.uniqueId}/delete`, deleteCard)

const port = process.env.PORT || 4000;


app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});

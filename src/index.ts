import express, {Request, Response} from 'express';
import sqlite3 from "sqlite3";
import fs from "fs"
import {createSQLTables} from "./sqlUntils";
import StackEntityStore from "./stores/StackEntityStore";
import CardEntityStore from "./stores/CardEntityStore";
import FieldContentEntityStore from "./stores/FieldContentEntityStore";
import FieldEntityStore from "./stores/FieldEntityStore";
import CardTypeEntityStore from "./stores/CardTypeEntityStore";
import {addStack, createStack, deleteStack, getAllStacks, updateStack} from "./routes/stacks";
import {addCard, createCard, deleteCard, getAllCards, updateCard} from "./routes/cards";
import {addCardType, createCardType, deleteCardType, getAllCardTypes, updateCardType} from "./routes/cardTypes";
import {getAllFields} from "./routes/fields";
import {getAllFieldContents} from "./routes/FieldContents";


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
app.get(`${DEFAULT_ROUTE}/${stackEntityStore.uniqueId}`, getAllStacks) //payload: Stack[]
app.post(`${DEFAULT_ROUTE}/${stackEntityStore.uniqueId}/create`, createStack) //payload: Stack
app.post(`${DEFAULT_ROUTE}/${stackEntityStore.uniqueId}/add`, addStack) //payload: Stack
app.post(`${DEFAULT_ROUTE}/${stackEntityStore.uniqueId}/update`, updateStack) //payload: Stack
app.post(`${DEFAULT_ROUTE}/${stackEntityStore.uniqueId}/delete`, deleteStack) //no payload

//card routes
app.get(`${DEFAULT_ROUTE}/${cardEntityStore.uniqueId}`, getAllCards) //payload: Card[]
app.post(`${DEFAULT_ROUTE}/${cardEntityStore.uniqueId}/create`, createCard) //payload: {card: Card, fieldContents: FieldContent[]}
app.post(`${DEFAULT_ROUTE}/${cardEntityStore.uniqueId}/add`, addCard) //payload: Card
app.post(`${DEFAULT_ROUTE}/${cardEntityStore.uniqueId}/update`, updateCard)  //payload: {card: Card, fieldContents: FieldContent[]}
app.post(`${DEFAULT_ROUTE}/${cardEntityStore.uniqueId}/delete`, deleteCard) //no payload

//cardType routes
app.get(`${DEFAULT_ROUTE}/${cardTypeEntityStore.uniqueId}`, getAllCardTypes) //payload: CardType[]
app.post(`${DEFAULT_ROUTE}/${cardTypeEntityStore.uniqueId}/create`, createCardType) //payload: {cardType: CardType, fields: Field[]}
app.post(`${DEFAULT_ROUTE}/${cardTypeEntityStore.uniqueId}/add`, addCardType) //payload: CardType[]
app.post(`${DEFAULT_ROUTE}/${cardTypeEntityStore.uniqueId}/update`, updateCardType) //no payload
app.post(`${DEFAULT_ROUTE}/${cardTypeEntityStore.uniqueId}/delete`, deleteCardType) //payload: {cardType: CardType, fields: Field[]}

//fieldRoutes
app.get(`${DEFAULT_ROUTE}/${fieldEntityStore.uniqueId}`, getAllFields) //payload: Field[]

//fieldContentRoutes
app.get(`${DEFAULT_ROUTE}/${fieldContentEntityStore.uniqueId}`, getAllFieldContents) //payload: FieldContent[]


const port = process.env.PORT || 4000;


app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});

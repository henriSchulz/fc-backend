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
import {addField, getAllFields} from "./routes/fields";
import {addFieldContent, getAllFieldContents} from "./routes/fieldContents";
import exp from "constants";
import ClientEntityStore from "./stores/ClientEntityStore";
import {authMiddleware, createClient, getUser, login, logout} from "./routes/auth";
import cors from "cors"


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
export const clientEntityStore = new ClientEntityStore(database)


const app = express();

app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000"
}));




//stack routes
app.get(`${DEFAULT_ROUTE}/${stackEntityStore.uniqueId}`, authMiddleware, getAllStacks) //payload: Stack[]
app.post(`${DEFAULT_ROUTE}/${stackEntityStore.uniqueId}/create`, authMiddleware, createStack) //payload: Stack
app.post(`${DEFAULT_ROUTE}/${stackEntityStore.uniqueId}/add`, authMiddleware, addStack) //payload: Stack
app.post(`${DEFAULT_ROUTE}/${stackEntityStore.uniqueId}/update`, authMiddleware, updateStack) //payload: Stack
app.post(`${DEFAULT_ROUTE}/${stackEntityStore.uniqueId}/delete`, authMiddleware, deleteStack) //no payload

//card routes
app.get(`${DEFAULT_ROUTE}/${cardEntityStore.uniqueId}`, authMiddleware, getAllCards) //payload: Card[]
app.post(`${DEFAULT_ROUTE}/${cardEntityStore.uniqueId}/create`, authMiddleware, createCard) //payload: {card: Card, fieldContents: FieldContent[]}
app.post(`${DEFAULT_ROUTE}/${cardEntityStore.uniqueId}/add`, authMiddleware, addCard) //payload: Card
app.post(`${DEFAULT_ROUTE}/${cardEntityStore.uniqueId}/update`, authMiddleware, updateCard)  //payload: {card: Card, fieldContents: FieldContent[]}
app.post(`${DEFAULT_ROUTE}/${cardEntityStore.uniqueId}/delete`, authMiddleware, deleteCard) //no payload

//cardType routes
app.get(`${DEFAULT_ROUTE}/${cardTypeEntityStore.uniqueId}`,authMiddleware, getAllCardTypes) //payload: CardType[]
app.post(`${DEFAULT_ROUTE}/${cardTypeEntityStore.uniqueId}/create`,authMiddleware, createCardType) //payload: {cardType: CardType, fields: Field[]}
app.post(`${DEFAULT_ROUTE}/${cardTypeEntityStore.uniqueId}/add`,authMiddleware, addCardType) //payload: CardType[]
app.post(`${DEFAULT_ROUTE}/${cardTypeEntityStore.uniqueId}/update`,authMiddleware, updateCardType) //no payload
app.post(`${DEFAULT_ROUTE}/${cardTypeEntityStore.uniqueId}/delete`,authMiddleware, deleteCardType) //payload: {cardType: CardType, fields: Field[]}

//fieldRoutes
app.get(`${DEFAULT_ROUTE}/${fieldEntityStore.uniqueId}`,authMiddleware, getAllFields) //payload: Field[]
app.post(`${DEFAULT_ROUTE}/${fieldEntityStore.uniqueId}/add`,authMiddleware, addField) //payload: Field

//fieldContentRoutes
app.get(`${DEFAULT_ROUTE}/${fieldContentEntityStore.uniqueId}`,authMiddleware, getAllFieldContents) //payload: FieldContent[]
app.post(`${DEFAULT_ROUTE}/${fieldContentEntityStore.uniqueId}/add`,authMiddleware, addFieldContent)

//auth routes
app.post(`${DEFAULT_ROUTE}/${clientEntityStore.uniqueId}/signup`, createClient) //payload: Client
app.post(`${DEFAULT_ROUTE}/${clientEntityStore.uniqueId}/login`, login) //payload: Client
app.delete(`${DEFAULT_ROUTE}/${clientEntityStore.uniqueId}`, logout) //no payload
app.get(`${DEFAULT_ROUTE}/${clientEntityStore.uniqueId}`, getUser) //payload: Client


const port = process.env.PORT || 4000;



app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});

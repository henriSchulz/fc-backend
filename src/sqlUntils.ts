import fs from "fs";
import {Database} from "sqlite3";
import {DefaultResponse, NoData} from "./types/responses/DefaultResponse";
import Stack from "./types/Stack";
import {generateModelId} from "./utils";

export type SQLFile = "clients" |
    "stacks" | "cards" | "fields" |
    "fieldContents" | "cardTypes"

export type SQLTable = "client" | "stacks" | "card_types"
    | "cards" | "fields" | "field_contents"

function readSQLFile(file: SQLFile) {
    return fs.readFileSync(`${__dirname}/sql/${file}.sql`).toString()
}


export function createSQLTables(database: Database) {
    database.exec(readSQLFile("clients"))
    database.exec(readSQLFile("stacks"))
    database.exec(readSQLFile("cardTypes"))
    database.exec(readSQLFile("cards"))
    database.exec(readSQLFile("fields"))
    database.exec(readSQLFile("fieldContents"))
}





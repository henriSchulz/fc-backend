import Stack from "./types/Stack";
import Card from "./types/Card";
import Field from "./types/Field";
import CardType from "./types/CardType";
import FieldContent from "./types/FieldContent";
import crypto from 'crypto';

export function generateUUID() {
    let d = new Date().getTime();
    let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export function generateModelId(): string {
    return generateUUID().split("-")[0]
}


export function numberArray(from: number, to: number) {
    const list = [];
    for (let i = from; i <= to; i++) {
        list.push(i);
    }
    return list
}

export function formatDuration(timestamp: number): string {
    const millisecondsPerSecond = 1000;
    const millisecondsPerMinute = 1000 * 60;
    const millisecondsPerHour = millisecondsPerMinute * 60;
    const millisecondsPerDay = millisecondsPerHour * 24;

    const days = Math.floor(timestamp / millisecondsPerDay);
    const hours = Math.floor((timestamp % millisecondsPerDay) / millisecondsPerHour);
    const minutes = Math.floor((timestamp % millisecondsPerHour) / millisecondsPerMinute);
    const seconds = Math.floor((timestamp % millisecondsPerMinute) / millisecondsPerSecond);


    if (days === 0 && hours === 0) {
        if (minutes === 0) {
            return `${seconds}s`
        } else {
            return `${minutes}m`
        }
    }

    if (days === 0) {
        if (minutes === 0) {
            return `${hours}h`
        } else return `${hours}h ${minutes}m`
    }


    return `${days}d ${hours}h ${minutes}m`;
}

export function shuffle<T>(a: T[]): T[] {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function generateFormatExampleArray(fieldNames: string[]): string {
    let result: string[][] = [];
    for (let i = 1; i <= 3; i++) {
        let subArray: string[] = [];
        for (const fieldName of fieldNames) {
            subArray.push(fieldName);
        }


        result.push(subArray);
    }

    return JSON.stringify(result);
}

function replaceMultipleChars(inputString: string, charToReplace: string): string {
    return inputString.replace(new RegExp(charToReplace + "{2,}", "g"), charToReplace);
}

export function formatTextForAI(text: string): string {
    return replaceMultipleChars(text.trim().replaceAll("\n", " "), " ")
}


export function randomBoolean() {
    return Math.random() < 0.5;
}



function isId(str: any): boolean {
    return typeof str === 'string' && str.length === 8
}


export function isStack(obj: any): obj is Stack {
    return !(obj === null ||
        typeof obj !== 'object' ||
        !isId(obj.id) ||
        typeof obj.lastModifiedAt !== 'number' ||
        typeof obj.version !== 'number' ||
        typeof obj.name !== 'string');
}

export function isCard(obj: any): obj is Card {
    return !(typeof obj !== 'object' ||
        obj === null ||
        !isId(obj.id) ||
        !isId(obj.cardTypeId) ||
        typeof obj.createdAt !== 'number' ||
        typeof obj.lastModifiedAt !== 'number' ||
        typeof obj.version !== 'number' ||
        typeof obj.dueAt !== 'number' ||
        typeof obj.learningState !== 'number' ||
        typeof obj.paused !== 'boolean' );
}

export function isField(obj: any): obj is Field {
    return !(typeof obj !== 'object' ||
        obj === null ||
        !isId(obj.id) ||
        !isId(obj.cardTypeId) ||
        typeof obj.createdAt !== 'number' ||
        typeof obj.lastModifiedAt !== 'number' ||
        typeof obj.version !== 'number' ||
        typeof obj.name !== 'string');
}

export function isCardType(obj: any): obj is CardType {
    return !(typeof obj !== 'object' ||
        obj === null ||
        !isId(obj.id) ||
        typeof obj.createdAt !== 'number' ||
        typeof obj.lastModifiedAt !== 'number' ||
        typeof obj.version !== 'number' ||
        typeof obj.name !== 'string' ||
        typeof obj.templateFront !== 'string' ||
        typeof obj.templateBack !== 'string');
}

export function isFieldContent(obj: any): obj is FieldContent {
    return !(typeof obj !== 'object' ||
        obj === null ||
        !isId(obj.id) ||
        typeof obj.createdAt !== 'number' ||
        typeof obj.lastModifiedAt !== 'number' ||
        typeof obj.version !== 'number' ||
        typeof obj.fieldId !== 'string' ||
        typeof obj.cardId !== 'string' ||
        typeof obj.stackId !== 'string' ||
        typeof obj.content !== 'string');
}

export function isArrayOfFieldContent(arr: any): arr is FieldContent[] {
    if (!Array.isArray(arr)) {
        return false;
    }
    return arr.every(item => isFieldContent(item));
}

export function isArrayOfFields(arr: any): arr is Field[] {
    if (!Array.isArray(arr)) {
        return false;
    }
    return arr.every(item => isField(item));
}

export function isValidUsername(input: string): boolean {
    const regex = /^[a-züäö0-9_.-]+$/i;
    return regex.test(input);
}

export function generateSessionToken(length: number = 32): string {
    const buffer = crypto.randomBytes(length);
    return buffer.toString('hex');
}
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

export function createDownload(name: string, content: string): void {
    const blob = new Blob([content], {type: "text/plain"});
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fileUrl);
}
import { writeFileSync, appendFile } from 'fs';

export namespace File {
    // default path
    export const defpath = process.env.DIST_FILEPATH;

    export const initializeFile = (path: string = defpath): void => {
        writeFileSync(path, '', 'utf8');
    }

    export const writeToCsv = (collection: string[][], path: string = defpath): void => {
        const contents: string = collection.map(c => {
            return Object.values(c).join(',') + '\n';
        }).join('')

        appendFile(path, contents, 'utf8', (e: Error) => {
            if (e) {
                console.log(e);
            }
        });
    }
}
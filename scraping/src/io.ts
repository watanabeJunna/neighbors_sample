import { writeFileSync, appendFile } from 'fs';

export class Writer {
    outfile: string;

    constructor(outfile: string) {
        this.outfile = outfile;
    }

    public initializeFile = (): void => {
        writeFileSync(this.outfile, '', 'utf8');
    }

    public writeToCsv = (collection: string[][]): void => {
        const contents: string = collection.map(c => {
            return Object.values(c).join(',') + '\n';
        }).join('')

        appendFile(this.outfile, contents, 'utf8', (e: Error) => {
            if (e) {
                console.log(e);
            }
        });
    }
}
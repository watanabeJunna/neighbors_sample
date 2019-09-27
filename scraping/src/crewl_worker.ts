import Puppeteer from './puppeteer';
import { Writer } from './io';

/**
 * @see https://github.com/GoogleChrome/puppeteer/issues/594
 */
export default class CrawlWorker {
    urls: string[];
    outfile: string;
    writer: Writer;

    constructor(outfile: string = process.env.DIST_FILEPATH) {
        this.outfile = outfile;
        this.writer = new Writer(outfile);
    }

    public async run() {
        this.writer.initializeFile();

        this.writer.writeToCsv([['bpm', 'genre', 'title', 'artist']]);

        this.urls = await this.getWorkUrls();

        this.crawlPage(this.urls.shift());
    }

    public async getWorkUrls(): Promise<string[]> {
        let pup: Puppeteer;

        try {
            pup = await new Puppeteer().initialize();

            const works_url = 'http://bemaniwiki.com/index.php?%B2%E1%B5%EE%BA%EE%C9%CA/beatmania%20IIDX';

            await pup.page.goto(works_url);

            const links: string[] = await pup.page.$$eval('a[title*=旧曲リスト]', (links: Element[]) => {
                return links.map(link => link.getAttribute('href'));
            });

            pup.browser.close();

            return new Promise((resolve) => {
                resolve(links);
            });
        } catch (e) {
            throw (e.message);
        } finally {
            if (pup) {
                pup.browser.close();
            }
        }
    }

    async crawlPage(url: string) {
        let pup: Puppeteer;

        console.log(`crawl: ${url}`);

        try {
            pup = await new Puppeteer().initialize();

            await pup.page.goto(url, { waitUntil: "domcontentloaded" });

            const contents = await pup.page.$$eval('.ie5', (dataTables: Element[]) => {
                const enableRows = dataTables.map(dataTable => {
                    const rows = Array.from(dataTable.querySelectorAll('tbody tr'));
                    const count = rows.length;

                    if (count <= 11) {
                        return;
                    }

                    const contents = rows.map(row => {
                        const cells = row.querySelectorAll('td');
                        const count = cells.length;

                        if (count <= 7) {
                            return;
                        }

                        const contents = []

                        contents.push(cells[count - 4].innerText);
                        contents.push(cells[count - 3].innerText);
                        contents.push(cells[count - 2].innerText);
                        contents.push(cells[count - 1].innerText);

                        return contents;
                    }).filter(e => e);

                    return contents.filter(e => e);
                });

                return enableRows.filter(e => e);
            });

            this.writer.writeToCsv(contents[0]);
        } catch (e) {
            console.log(e);

            if (pup) {
                pup.browser.close();
            }

            process.exit(0);
        } finally {
            if (pup) {
                pup.browser.close();
            }

            if (this.urls.length) {
                this.crawlPage(this.urls.shift())
            } else {
                process.exit(0);
            }
        }
    }
}
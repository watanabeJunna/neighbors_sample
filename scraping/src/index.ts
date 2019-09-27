import Puppeteer from './puppeteer';
import { File } from './io';

(async () => {
    let pup: Puppeteer;

    try {
        File.initializeFile();
    } catch(e) {
        console.log(e);
        return;
    }

    try {
        pup = await new Puppeteer().initialize();

        const works_url = 'http://bemaniwiki.com/index.php?%B2%E1%B5%EE%BA%EE%C9%CA/beatmania%20IIDX';

        await pup.page.goto(works_url);

        /**
         * await pup.page.$$eval('a[title*=旧曲リスト]', (links: Element[]) => {
         *     links.forEach(link => {
         *         link.click()
         *     });
         * });
         */

        pup.page.click('a[title*=旧曲リスト]');

        await pup.page.waitForNavigation({  
            timeout: 60000, 
            waitUntil: 'domcontentloaded' 
        });

        await pup.page.screenshot({
            path: `${process.env.SCREENSHOT_PATH}/test.jpeg`,
        });

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

        contents.unshift([['bpm', 'genre', 'title', 'artist']]);

        File.writeToCsv(contents[0]);
        File.writeToCsv(contents[1]);

        pup.browser.close();
    } catch (e) {
        if (pup !== null) {
            pup.browser.close();
        }

        console.log(e);
    }
})();
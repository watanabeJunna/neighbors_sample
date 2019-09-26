import * as puppeteer from 'puppeteer'

class Puppeteer {
    public browser: puppeteer.Browser;
    public page: puppeteer.Page;

    private launchArg: any = {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    };

    public async initialize() {
        return new Promise<Puppeteer>(async (resolve, reject) => {
            try {
                this.browser = await puppeteer.launch(this.launchArg);
                this.page = await this.browser.newPage();
            } catch (e) {
                reject(e);
            }

            resolve(this);
        });
    }
}

namespace ColllectionUtil {
    export const filterDataTable = (dataTables: Element[]): Element[] => {
        const result = dataTables.filter(dataTable => {
            dataTable.querySelectorAll('tbody tr').length > 12;
        });

        return result;
    }

    export const filterRows = (tableRows: Element[]): Element[] => {
        // enable rows
        let result: Element[] = []

        tableRows.forEach(row => {
            let cell = row.querySelectorAll('td');

            if (cell.length < 7) {
                return;
            }

            cell = row.querySelectorAll('tdtd[style*=background-color]');

            if (cell.length >= 7) {
                return;
            }

            result.push(row)
        })

        return result
    }
}

(async () => {
    let pup: Puppeteer

    try {
        pup = await new Puppeteer().initialize();

        const works_url = 'http://bemaniwiki.com/index.php?%B2%E1%B5%EE%BA%EE%C9%CA/beatmania%20IIDX';

        await pup.page.goto(works_url);

        await pup.page.screenshot({
            path: `${process.env.SCREENSHOT_PATH}/test.jpeg`,
        });

        const titles = await pup.page.$$eval('a[title*=旧曲リスト]', (links: Element[]) => {
            links.map(link => link.getAttribute('title'));
        });

        console.log(titles);
        
        // DOMElementの属性取得など、DOMを触る場合はEvalを利用しないと
        // pup.browser.close()が走りエラーになる.
        //
        // メソッドを選択する場合は、注意が必要.
        // 
        // (await pup.page.$$('a[title*=旧曲リスト]')).map(async link => {
        //     const title: string = await (await link.getProperty('title')).jsonValue()
        //     console.log(title)
        // })

        /**
         * $$('a[title*=旧曲リスト]').map(e => e.title) // これで把握、これをクリックして回る
         * 
         * $$('.ie5')[0].querySelectorAll('tbody')[0]
         * 
         * const dataTables = $$('.ie5').filter(e => 
         *         e.querySelectorAll('tbody tr').length > 12)
         * 
         * dataTables.forEach(dataTable => {
         *     const rows = dataTable.querySelectorAll('tbody tr')
         * 
         *     rows.rows.querySelectorAll('td')
         * })
         */
        pup.browser.close();
    } catch (e) {
        if (pup !== null) {
            pup.browser.close();
        }

        console.log(e);
    }
})();
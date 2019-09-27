namespace ColllectionUtil {
    export const filterDataTable = (dataTables: Element[]): Element[] => {
        const result = dataTables.filter(dataTable => {
            dataTable.querySelectorAll('tbody tr').length > 12;
        });

        return result;
    }

    export const filterRows = (tableRows: Element[]): Element[] => {
        let enableRows: Element[] = []

        tableRows.forEach(row => {
            let cell = row.querySelectorAll('td');

            if (cell.length < 7) {
                return;
            }

            cell = row.querySelectorAll('td[style*=background-color]');

            if (cell.length >= 7) {
                return;
            }

            enableRows.push(row)
        })

        return enableRows
    }
}

export default ColllectionUtil
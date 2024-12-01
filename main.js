const spreadsheetId = "14dV7S3zm1IX3bOTpvhstvq4uRwqXjEXpFsuZ0Q_QMuc";
const sheetName = encodeURIComponent("Form Responses 1");
const sheetURL = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?sheet=${sheetName}`;
const apiURL = 'https://corsproxy.io/?';

$(document).ready(function () {
    fetch(apiURL + encodeURIComponent(sheetURL)
        )
        .then((r) => r.text())
        .then(function(data) { 
            const text = formatData(data);
            const table_data = getData(text).map(row => {
                // row[4] = 
                //     "<a href='" + row[4] + "'>" + row[4] + "</a>";
                return row;
                });
            const table_heads = getHeadings(text).map(col => ({ title: col }));

            const table =  new DataTable('#leaderboard', {
                columns: table_heads,
                data: table_data,
                scrollX: true,
                scrollY: '45vh',
                columnDefs: [
                    {
                        "className": "dt-center", "targets": "_all"
                    }
                  ],
                order: [
                    [3, 'desc']
                ],
                dom: "Bfrtip"
            });

            table
                .on('order.dt search.dt', function () {
                    let i = 1;
            
                    table
                        .cells(null, 0, { search: 'applied', order: 'applied' })
                        .every(function (cell) {
                            this.data(i++);
                        });
                })
                .draw();
        });
    });


    function formatData(data) {
        return JSON.parse((data.slice(0, data.length - 2)).split("setResponse(")[1]);
    }

    function getData(text) {
        var arr = [];
        const rows = text.table.rows;
        rows.forEach(row => {
            let r = row.c;
            var a = [0, 0, 0, 0, 0];
            a[0] = r[0].f;
            for(i = 1; i < r.length; i++) {
                a[i] = r[i].v
            }
            // a[i] = r[4].v.split("id=")[1];
            a.unshift(0);
            a.splice(1, 1);
            a.splice(4, 4);
            arr.push(a);
        });
        return arr;
    }

    function getHeadings(text) {
        var arr = [];
        const cols = text.table.cols;
        cols.forEach(col => {
            arr.push(col.label)
        });
        arr.unshift('Rank');
        arr.splice(1, 1);
        arr.splice(4, 4);
        return arr;
    }

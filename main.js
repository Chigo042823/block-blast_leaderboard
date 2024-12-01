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
                row[4] = 
                    "<img src='" + 
                    "https://drive.google.com/thumbnail?id=" + 
                    row[4] + "' alt=" +
                    row[1] + 
                    "'s score>"
                return row;
                });
            const table_heads = getHeadings(text).map(col => ({ title: col }));

            $('#leaderboard').DataTable({
                columns: table_heads,
                data: table_data,
                dom: "Bfrtip"
            });
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
            for(i = 1; i < r.length - 1; i++) {
                a[i] = r[i].v
            }
            a[i] = r[4].v.split("id=")[1];
            arr.push(a);
        });
        return arr;
    }

    function getHeadings(text) {
        var arr = [];
        const cols = text.table.cols;
        cols.forEach(col => {
            arr.push(col.label)
        })
        return arr;
    }

// sheetID you can find in the URL of your spreadsheet after "spreadsheet/d/"
const spreadsheetId = "14dV7S3zm1IX3bOTpvhstvq4uRwqXjEXpFsuZ0Q_QMuc";
// sheetName is the name of the TAB in your spreadsheet
const sheetName = encodeURIComponent("Form Responses 1");
const sheetURL = `docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?sheet=${sheetName}`;
const apiURL = 'https://cors-anywhere.herokuapp.com/';

$(document).ready(function () {
    fetch(apiURL + sheetURL, {
            'mode': 'cors'
        })
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

            // Initialize DataTables with dynamically loaded data
            $('#leaderboard').DataTable({
                columns: table_heads,
                data: table_data,
                dom: "Bfrtip"
            });


            // cols.forEach(col => {
            //     const header = "<th>" + col + "</th>";
            //     $("#headers").append(header);
            // });
            // rows.forEach(row => {
            //     var inner = "<tr>"
            //     inner += "<tr><td>" + row[0] + "</td>";  
            //     for(i = 1; i < row.length - 1; i++) {
            //         inner += "<td>" + row[i] + "</td>"
            //     };

            //     inner += "<td><img src='" + "https://drive.google.com/thumbnail?id=" + row[4] + "' alt=" + row[1] + "'s score></td></tr>"
            //     $("#leaderboard tbody").append(inner);
            // });
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

module.exports = ({ selectedDepartment, _allRecords }) => {
  const today = new Date();
  return `
   <!doctype html>
   <html>
      <head>
         <meta charset="utf-8">
         <style>
            .tableform {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            box-shadow: 0 0 10px rgba(0, 0, 0, .15);
            font-size: 16px;
            line-height: 24px;
            font-family: 'Helvetica Neue', 'Helvetica;
            color: black;
            }
            .margin-top {
            margin-top: 50px;
            }
            .tableform table {
            width: 100%;
            line-height: inherit;
            text-align: left;
            }
            .tableform table td {
            padding: 5px;
            vertical-align: top;
            border: 1px solid black;
            }
            .tableform table tr.information table td {
            text-align: center;
            }
            .tableform table tr.heading {
            background: #eee;
            font-weight: bold;
            }
         </style>
      </head>
      <body>
         <div class="tableform">                                     
            <h4>
               Date: ${`${today.getDate()}. ${today.getMonth() +
                 1}. ${today.getFullYear()}`}
            </h4>      
            <h4 style="text-align: center">
               Department Retention Schedule - ${
                 selectedDepartment.departmentnumber
               } &nbsp; ${selectedDepartment.department}
            </h4>         
               <table>
               <tr class="heading">
                  <td>Function</td>
                  <td>Record Type</td>
                  <td>Retention Description</td>
                  <td>Classification</td>
                  <td>Comments</td>
               </tr>               
                  ${_allRecords
                    .sort((a, b) => (a.function < b.function ? -1 : 1))
                    .filter(x => x.department === selectedDepartment.department)
                    .map(r => {
                      return `
                     <tr>
                     <td>${r.function}</td>
                     <td>${r.recordtype}</td>
                     <td>${r.description}</td>
                     <td>${r.classification}</td>
                     <td>${r.comments}</td>
                     </tr>
                     `;
                    })}               
            </table>           
         </div>
      </body>
   </html>
   `;
};

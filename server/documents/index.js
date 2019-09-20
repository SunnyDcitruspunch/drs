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
            color: #555;
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
            }
            .tableform table tr.top table td {
            padding-bottom: 20px;
            }
            .tableform table tr.information table td {
            text-align: center;
            }
            .tableform table tr.heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
            }
            @media only screen and (max-width: 600px) {
            .tableform table tr.top table td {
            width: 100%;
            display: block;
            text-align: center;
            }
         </style>
      </head>
      <body>
         <div class="tableform">
            <table>
               <tr class="top">
                  <td colspan="6">
                     <table>
                        <tr>
                           <td>
                              Date: ${`${today.getDate()}. ${today.getMonth() +
                                1}. ${today.getFullYear()}`}
                           </td>
                           <td>
                              <h4>
                                 Department Retention Schedule - ${
                                   selectedDepartment.departmentnumber
                                 } &nbsp; ${selectedDepartment.department}
                              </h4>                              
                        </td>
                        </tr>
                     </table>
                  </td>
               </tr>
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
                     <tr class="item">
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

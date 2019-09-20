module.exports = ({ CommonStore, DepartmentStore }) => {
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
             border: 1px solid #eee;
             box-shadow: 0 0 10px rgba(0, 0, 0, .15);
             font-size: 16px;
             line-height: 24px;
             font-family: 'Helvetica Neue', 'Helvetica',
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
             @media only screen and (max-width: 600px) {
             .tableform table tr.top table td {
             width: 100%;
             display: block;
             text-align: center;
             }
             .tableform table tr.information table td {
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
                                  Common Record Department List: ${ CommonStore.record.code } 
                               </h4>                              
                         </td>
                         </tr>
                         <tr>
                            <td>Total Departments: ${
                              CommonStore.record.useddepartment
                            }</td>
                         </tr>
                         <tr>
                            <td>
                                Department Names:
                            </td>
                            <td> 
                            ${DepartmentStore._allRecords
                              .filter(r => r.code === CommonStore.record.code)
                              .map(r => {
                                return `
                                ${r.department}
                                `;
                              })}
                              </td>
                         </tr>
                      </table>
                   </td>
                </tr>                      
             </table>           
          </div>
       </body>
    </html>
    `;
};

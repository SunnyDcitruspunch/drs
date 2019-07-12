import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Container from "react-bootstrap/Container";


const AdminTab = inject("UniqueStore", "DepartmentStore")(
    observer(
      class AdminTab extends Component {
        
        render() {
         
          return (
            <Container>
              <div>this is a admin tab.</div>
            </Container>
          );
        }
      }
    )
  );
  
  export default AdminTab


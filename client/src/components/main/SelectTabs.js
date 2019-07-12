import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import DepartmentRetention from "../tabs/DeptRetention";
import AddCommonRecords from "../tabs/AddCommonRecords";
import AddUniqueRecords from "../tabs/AddUniqueRecords";
import AdminTab from '../tabs/AdminTab'

export default class ControlledTabs extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      key: "drs"
    };
  }

  /*
    ! TODO: show ADMIN TAB if user is admin
    TODO: change tabs to material UI
  */

  render() {
    return (
      <div style={styles.tabsStyle}>
        <Tabs
          id="selectdept"
          transition={false} 
          activeKey={this.state.key}
          onSelect={key => this.setState({ key })}
        >
          <Tab eventKey="drs" title="Department Retention Schedule" intial>
            <DepartmentRetention />
          </Tab>
          <Tab eventKey="addCommon" title="Add Common Records">
            <AddCommonRecords />
          </Tab>
          <Tab eventKey="addUnique" title="Add Unique Records">
            <AddUniqueRecords />
          </Tab>
          <Tab eventKey="admin" title="Admin">
            <AdminTab />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

const styles = {
  tabsStyle: {
    fontSize: 12
  }
};

import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import DeptRetention from "./components/tabs/DeptRetention/DeptRetention";
import AddCommonRecords from "./components/tabs/CommonRecords/AddCommonRecords";
import AddUniqueRecords from "./components/tabs/CommonRecords/AddCommonRecords";
import AdminTab from "./components/tabs/Admin/AdminTab";

class Router extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Router path="/" component={DeptRetention} />
          <Route path="/DeptRetention" component={DeptRetention} />
          <Route path="/AddCommonRecords" component={AddCommonRecords} />
          <Route path="/AddUniqueRecords" component={AddUniqueRecords} />
          <Route path="admin" component={AdminTab} />
        </Switch>
      </div>
    );
  }
}

export default Router;

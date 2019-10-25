import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import AddCommonRecords from "./components/tabs/CommonRecords/AddCommonRecords";
import AddUniqueRecords from "./components/tabs/CommonRecords/AddCommonRecords";
import AdminTab from "./components/tabs/Admin/AdminTab";
import LogIn from './components/main/Login'
import Main from './components/main/Main'
import DeptRetention from './components/tabs/DeptRetention/DeptRetention'

class Router extends Component {
  render() {
    return (
        <Switch>
          <Route exact path="/" component={LogIn} />
          <Route exact path="/main" component={Main} />
          <Route exact path="/deptretention" component={DeptRetention} />
          <Route exact path="/commonrecords" component={AddCommonRecords} />
          <Route exact path="/uniquerecords" component={AddUniqueRecords} />
          <Route exact path="/admin" component={AdminTab} />
        </Switch>
    );
  }
}

export default Router;

import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import DeptRetention from "./components/tabs/DeptRetention/DeptRetention";
import AddCommonRecords from "./components/tabs/CommonRecords/AddCommonRecords";
import AddUniqueRecords from "./components/tabs/CommonRecords/AddCommonRecords";
import AdminTab from "./components/tabs/Admin/AdminTab";
import SelectDepartment from './components/main/SelectDepartments'
import LogIn from './components/main/Login'
import Main from './components/main/Main'
// import Home from './components/main/Home'

class Router extends Component {
  render() {
    return (
        <Switch>
          <Route exact path="/" component={LogIn} />
          {/* <Route path="/" component={Main} /> */}
          <Route exact path="/main" component={Main} />
          <Route exact path="/commonrecords" component={AddCommonRecords} />
          <Route exact path="/uniquerecords" component={AddUniqueRecords} />
          <Route exact path="/admin" component={AdminTab} />
        </Switch>
    );
  }
}

export default Router;

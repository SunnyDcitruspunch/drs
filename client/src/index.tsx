import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "mobx-react";
import { UniqueStore, DepartmentStore, RecordStore, CommonStore, AuthStore, UserStore } from "./stores";

ReactDOM.render(
  <Provider
    UniqueStore={UniqueStore}
    DepartmentStore={DepartmentStore}
    RecordStore={RecordStore}
    CommonStore={CommonStore}
    AuthStore={AuthStore}
    UserStore={UserStore}
  >
    <div>
      <Router>
        <App />
      </Router>
    </div>
  </Provider>,
  document.getElementById("root")
);


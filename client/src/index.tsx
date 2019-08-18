import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "mobx-react";
import { UniqueStore, DepartmentStore, RecordStore, CommonStore } from "./stores";

ReactDOM.render(
  <Provider
    UniqueStore={UniqueStore}
    DepartmentStore={DepartmentStore}
    RecordStore={RecordStore}
    CommonStore={CommonStore}
  >
    <div>
      <Router>
        <App />
      </Router>
    </div>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

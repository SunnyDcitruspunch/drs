import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import UniqueStore from "./stores/UniqueStore";
import DepartmentStore from "./stores/DepartmentStore";
import { Provider } from "mobx-react";

ReactDOM.render(
  <Provider UniqueStore={UniqueStore} DepartmentStore={DepartmentStore}>
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

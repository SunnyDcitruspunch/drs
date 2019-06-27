import React from "react";
import Nav from "./components/main/Nav";
import SelectTabs from "./components/main/SelectTabs";
import "./App.css";
import SelectDepartments from "./components/main/SelectDepartments";
import DeptRetention from './components/tabs/DeptRetention'

function App() {
  return (
    <div className="App">
      <Nav />
      <SelectDepartments />
      <SelectTabs />
    </div>
  );
}

export default App;

import React from "react";
import Nav from "./components/main/Nav";
import SelectTabs from "./components/main/SelectTabs";
import SelectDepartments from './components/main/SelectDepartments'
import "./App.css";

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

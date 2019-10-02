import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { observer, inject } from "mobx-react";
import {
  AuthStore,
  IAuthStore,
  DepartmentStore,
  IDepartmentStore
} from "../../stores";

const Nav = inject("AuthStore", "DepartmentStore")(
  observer(() => {
    const handleLogout = () => {
      DepartmentStore.selectedDepartment = {
        department: "",
        id: "",
        commoncodes: []
      };
      AuthStore.logout();
    };

    if (AuthStore.user) {
      return (
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography
              variant="h6"
              color="inherit"
              style={{ fontSize: 16, flexGrow: 1 }}
            >
              Department Retention Schedule
            </Typography>
            <Link to="/">
              <Button
                color="inherit"
                style={{
                  float: "right",
                  color: "black",
                  textDecoration: "none"
                }}
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </Link>
            <Link to="/" />
          </Toolbar>
        </AppBar>
      );
    } else {
      return (
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" color="inherit" style={{ fontSize: 16 }}>
              Department Retention Schedule
            </Typography>
          </Toolbar>
        </AppBar>
      );
    }
  })
);

export default Nav;

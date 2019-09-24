import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { observer, inject } from "mobx-react";
import { AuthStore, IAuthStore, DepartmentStore, IDepartmentStore } from "../../stores";

interface IProps {
  AuthStore: IAuthStore
  DepartmentStore: IDepartmentStore
}

const Nav = inject("AuthStore", "DepartmentStore")(
  observer(
    class Nav extends Component<IProps, {}> {
      handleLogout = () => {
        this.props.DepartmentStore.selectedDepartment = {department: "", id: "", commoncodes: []};
        this.props.AuthStore.logout()
      }

      render() {
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
                    onClick={this.handleLogout}
                  >
                    Log Out
                  </Button>
                </Link>
                <Link to="/" />
              </Toolbar>
            </AppBar>
          )
        } else {
          return (
            <AppBar position="static" color="default">
              <Toolbar>
                <Typography
                  variant="h6"
                  color="inherit"
                  style={{ fontSize: 16 }}
                >
                  Department Retention Schedule
                </Typography>
              </Toolbar>
            </AppBar>
          );
        }
      }
    }
  )
);

export default Nav;

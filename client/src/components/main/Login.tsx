import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container
} from "@material-ui/core";
import { Redirect } from "react-router-dom";
import { IAuthStore, IUserStore, IDepartmentStore } from "../../stores";

interface IProps {
  DepartmentStore: IDepartmentStore
  AuthStore: IAuthStore;
  UserStore: IUserStore;
  history: any;
}

interface IState {
  toMainpage: boolean;
}

const LogIn = inject("AuthStore", "UserStore", "DepartmentStore")(
  observer(
    class LogIn extends Component<IProps, IState> {
      constructor(props: IProps){
        super(props)

        this.state = {
          toMainpage: false
        }
      }

      componentDidMount() {
        this.props.DepartmentStore.fetchAll();
        this.props.UserStore.fetchUsers();
      };

      handleEmailChange = (e: any) => this.props.AuthStore.setUsername(e);
      handlePasswordChange = (e: any) => this.props.AuthStore.setPassword(e);
      handleSubmitForm = async (e: any) => {
        e.preventDefault();
        this.props.AuthStore.logIn();
        if (this.props.AuthStore.user) {
          await this.setState({ toMainpage: true });
        }
      };

      render() {
        if (this.state.toMainpage) {
          return <Redirect to="/main" />;
        }

        return (
          <Container
            component="main"
            maxWidth="xs"
            style={{
              marginTop: "50px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <CssBaseline />
            <div>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <form onSubmit={this.handleSubmitForm}>
                <TextField
                  onChange={this.handleEmailChange}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  onChange={this.handlePasswordChange}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Sign In
                </Button>
              </form>
            </div>
            <Box mt={8} />
          </Container>
        );
      }
    }
  )
);

export default LogIn;

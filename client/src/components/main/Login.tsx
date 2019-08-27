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
import { IAuthStore, IUserStore } from "../../stores";

interface IProps {
  AuthStore: IAuthStore;
  UserStore: IUserStore;
  history: any;
}

interface IState {
  toMainpage: boolean;
}

const LogIn = inject("AuthStore", "UserStore")(
  observer(
    class LogIn extends Component<IProps, IState> {
      componentWillMount = () => {
        this.props.UserStore.fetchUsers();

        this.setState({
          toMainpage: false
        });
      };

      handleEmailChange = (e: any) => this.props.AuthStore.setUsername(e);
      handlePasswordChange = (e: any) => this.props.AuthStore.setPassword(e);
      handleSubmitForm = async (e: any) => {
        e.preventDefault();
        this.props.AuthStore.logIn();
        if (this.props.AuthStore.user === true) {
          await this.setState({ toMainpage: true });
        }
      };

      render() {
        if (this.state.toMainpage === true) {
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

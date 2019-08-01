import * as React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

function Nav(): JSX.Element {
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

export default Nav;

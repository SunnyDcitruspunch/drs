import * as React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { observer } from "mobx-react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

const Nav = observer(() => {
  const classes = useStyles();

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <Typography variant="h6" color="inherit" style={{ fontSize: 16 }} className={classes.title}>
          Department Retention Schedule
        </Typography>
        <Button color="inherit" style={{ float: "right" }}>
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
});

export default Nav;

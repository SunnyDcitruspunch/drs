import React from "react";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

interface IProps {
  _open: boolean;
  msg: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      body: {
        backgroundColor: theme.palette.background.paper,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    snackbar: {
      [theme.breakpoints.down('xs')]: {
        bottom: 90,
      }
    },
  }),
);

export default function SimpleSnackbar(props: IProps) {
  const { msg, _open } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles()

  function handleClose(
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(_open);
    console.log("closed");
  }

  return (
    <div>
      <Snackbar
        className={classes.snackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={_open}
        autoHideDuration={3000}
        // onClose={handleClose}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">{msg}</span>}
        // action={[
        //   <Button
        //     key="gotit"
        //     color="secondary"
        //     size="small"
        //     onClick={handleClose}
        //   >
        //     GOT IT
        //   </Button>
        // ]}
      />
    </div>
  );
}

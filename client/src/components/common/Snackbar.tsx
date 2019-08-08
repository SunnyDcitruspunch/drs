import React from "react";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";

interface IProps {
  _open: boolean;
  msg: string;
}

export default function SimpleSnackbar(props: IProps) {
  const { msg, _open } = props;
  const [open, setOpen] = React.useState(false);

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

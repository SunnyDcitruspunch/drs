import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { observer } from "mobx-react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    formControl: {
      margin: theme.spacing(3)
    }
  })
);

interface IProps {
  changecheckbox: (e: any) => void;
  disabled: boolean;
  ifvital?: boolean
  ifarchival?: boolean
  ifconfidential?: boolean
}

export const ClassificationCheckboxes = observer((props: IProps) => {
  const classes = useStyles();

  const { disabled, changecheckbox, ifvital, ifarchival, ifconfidential } = props;

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                disabled={disabled}
                onClick={changecheckbox}
                checked={ifarchival}
                value=" Archival "
              />
            }
            label="Archival"
          />
          <FormControlLabel
            control={
              <Checkbox
                disabled={disabled}
                onClick={changecheckbox}
                checked={ifvital}
                value=" Vital "
              />
            }
            label="Vital"
          />
          <FormControlLabel
            control={
              <Checkbox
                disabled={disabled}
                onClick={changecheckbox}
                checked={ifconfidential}
                value=" Highly Confidential "
              />
            }
            label="Highly Confidential"
          />
        </FormGroup>
      </FormControl>
    </div>
  );
});



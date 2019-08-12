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
  change: (e: any) => void
}

const ClassificationCheckboxesGroup = observer((props: IProps) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    archival: true,
    vital: false,
    highlyconfidential: false
  });

  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };

  const { archival, vital, highlyconfidential } = state;
  // const { change } = props

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={archival}
                onChange={handleChange("archival")}
                value="archival"
              />
            }
            label="Archival"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={vital}
                onChange={handleChange("vital")}
                value="vital"
              />
            }
            label="Vital"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={highlyconfidential}
                onChange={handleChange("highlyconfidential")}
                value="highlyconfidential"
              />
            }
            label="Highly Confidential"
          />
        </FormGroup>
      </FormControl>
    </div>
  );
})

export default ClassificationCheckboxesGroup;
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { observer } from 'mobx-react';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

const Progress = observer(() => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgress />
    </div>
  );
})

export default Progress;
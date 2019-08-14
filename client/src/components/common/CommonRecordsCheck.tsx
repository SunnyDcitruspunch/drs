import React from "react";
import { inject, observer } from "mobx-react";
import { Checkbox } from "@material-ui/core";

interface IProps {
    id: string | undefined
    value: string
    onclick: (e: any) => void
    // checked: boolean
}



const CommmonRecordsCheck = observer((props: IProps) => {
  const { id, value, onclick} = props;

  return (
    <Checkbox
      id={id}
      value={value}
      onClick={onclick}
      color="primary"
    //   checked={checked}
      // checked={boolean}
    />
  );
});

export default CommmonRecordsCheck;

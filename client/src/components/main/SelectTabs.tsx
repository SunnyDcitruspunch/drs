import React from "react";
import DepartmentRetention from "../tabs/DeptRetention";
import AddCommonRecords from "../tabs/AddCommonRecords";
import AddUniqueRecords from "../tabs/AddUniqueRecords";
import AdminTab from "../tabs/AdminTab";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import { DepartmentStore } from "../../stores/DepartmentStore";
import { UniqueStore } from "../../stores/UniqueStore";
import { RecordStore } from "../../stores/RecordStore";

/*
    ! TODO: show ADMIN TAB if user is admin
*/

interface ITabProps {
  children: any;
  dir: any;
};

function TabContainer({ children, dir }: ITabProps): JSX.Element {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
  }
}));

interface IProps {
  DepartmentStore?: DepartmentStore;
  UniqueStore?: UniqueStore;
  RecordStore?: RecordStore;
}

export default function FullWidthTabs<IProps>() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  function handleChange(event: Event, newValue: any) {
    setValue(newValue);
  }

  function handleChangeIndex(index: any) {
    setValue(index);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" style={{ height: 48 }}>
        <Tabs
          value={value}
          onChange={e => handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          centered
        >
          <Tab label="Department Retention Schedule" style={styles.tabStyle} />
          <Tab label="Add Common Records" style={styles.tabStyle} />
          <Tab label="Add Unique Records" style={styles.tabStyle} />
          <Tab label="Admin" style={styles.tabStyle} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={(e: any) => handleChangeIndex}
      >
        <TabContainer dir={theme.direction}>
          <DepartmentRetention />
        </TabContainer>
        <TabContainer dir={theme.direction}>
          <AddCommonRecords />
        </TabContainer>
        <TabContainer dir={theme.direction}>
          <AddUniqueRecords />
        </TabContainer>
        <TabContainer dir={theme.direction}>
          <AdminTab />
        </TabContainer>
      </SwipeableViews>
    </div>
  );
}

const styles = {
  tabStyle: {
    fontSize: 8
  }
};

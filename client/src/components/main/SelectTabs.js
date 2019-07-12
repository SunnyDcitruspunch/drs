import React from "react";
// import Tabs from "react-bootstrap/Tabs";
// import Tab from "react-bootstrap/Tab";
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
import { Link } from "react-router-dom";

/*
    ! TODO: show ADMIN TAB if user is admin
  */

function TabContainer({ children, dir }) {
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

export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function handleChangeIndex(index) {
    setValue(index);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" style={{height: 48}}>
        <Tabs
          value={value}
          onChange={handleChange}
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
        onChangeIndex={handleChangeIndex}
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
    fontSize: 10
  }
};

// export default class ControlledTabs extends React.Component {
//   constructor(props, context) {
//     super(props, context);
//     this.state = {
//       key: "drs"
//     };
//   }

//   render() {
//     return (
//       <div style={styles.tabsStyle}>
//         <Tabs
//           id="selectdept"
//           transition={false}
//           activeKey={this.state.key}
//           onSelect={key => this.setState({ key })}
//         >
//           <Tab eventKey="drs" title="Department Retention Schedule" intial>
//             <DepartmentRetention />
//           </Tab>
//           <Tab eventKey="addCommon" title="Add Common Records">
//             <AddCommonRecords />
//           </Tab>
//           <Tab eventKey="addUnique" title="Add Unique Records">
//             <AddUniqueRecords />
//           </Tab>
//           <Tab eventKey="admin" title="Admin">
//             <AdminTab />
//           </Tab>
//         </Tabs>
//       </div>
//     );
//   }
// }

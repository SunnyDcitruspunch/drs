import React from "react";
import SwipeableViews from "react-swipeable-views";
import {
  makeStyles,
  Theme,
  useTheme,
  createStyles
} from "@material-ui/core/styles";
import { AppBar, Tabs, Tab, Typography, Box } from "@material-ui/core";
import DeptRetention from "../tabs/DeptRetention";
import AddCommonRecords from "../tabs/AddCommonRecords";
import AddUniqueRecords from "../tabs/AddUniqueRecords";
import AdminTab from "../tabs/AdminTab";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper
    }
  })
);

export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    setValue(newValue);
  }

  function handleChangeIndex(index: number) {
    setValue(index);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Department Retention Schedule" {...a11yProps(0)} />
          <Tab label="Add Common Records" {...a11yProps(1)} />
          <Tab label="Add Unique Records" {...a11yProps(2)} />
          <Tab label="Admin" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <DeptRetention />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <AddCommonRecords />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <AddUniqueRecords />
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <AdminTab />
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}

import * as React from "react";
import SelectTabs from "./SelectTabs";
import { inject, observer } from "mobx-react";
import {
  IDepartmentStore,
  ICommonStore,
  IUniqueStore,
  IRecordStore,
  IUserStore,
  IAuthStore
} from "../../stores";
import { FormGroup, Grid } from "@material-ui/core";
import SelectDepartment from "./SelectDepartment";

interface IProps {
  DepartmentStore: IDepartmentStore;
  CommonStore: ICommonStore;
  RecordStore: IRecordStore;
  UniqueStore: IUniqueStore;
  selecteddept: string;
  UserStore: IUserStore;
  AuthStore: IAuthStore;
}

interface IState {
  selecteddept: string;
}

const Main = inject(
  "DepartmentStore",
  "UniqueStore",
  "RecordStore",
  "CommonStore",
  "UserStore"
)(
  observer(
    class Main extends React.Component<IProps, IState> {
      constructor(props: IProps) {
        super(props);

        this.state = { selecteddept: "" };
      }

      componentDidMount() {
        this.props.DepartmentStore.fetchAll();
        this.props.CommonStore.fetchCommonRecords();
        this.props.DepartmentStore.fetchAllRecords();
        this.props.UniqueStore.fetchArchival();
        this.props.UniqueStore.fetchFunctions();
        this.props.UniqueStore.fetchCategory();

        this.setState({ selecteddept: "" });
      }

      render() {
        const { UserStore } = this.props;

        return (
          <React.Fragment>
            <Grid
              container
              justify="center"
              alignItems="center"
              alignContent="center"
              style={{ marginBottom: 50 }}
            >
              {UserStore.currentUser.admin ? (
                <SelectDepartment />
              ) : (
                <FormGroup>
                  <br />
                  <h3>{UserStore.currentUser.department}</h3>
                </FormGroup>
              )}
            </Grid>
            <SelectTabs />
          </React.Fragment>
        );
      }
    }
  )
);

export default Main;

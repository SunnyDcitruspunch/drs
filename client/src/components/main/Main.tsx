import * as React from "react";
import AdminRoute from './AdminRoute'
import { inject, observer } from "mobx-react";
import {
  IDepartmentStore,
  IDepartment,
  ICommonStore,
  IUniqueStore,
  IRecordStore,
  IUserStore,
  IAuthStore
} from "../../stores";
import { FormGroup, Grid, MenuItem, Select } from "@material-ui/core";

interface IProps {
  DepartmentStore: IDepartmentStore;
  CommonStore: ICommonStore;
  history: any;
  RecordStore: IRecordStore;
  UniqueStore: IUniqueStore;
  selecteddept: string;
  UserStore: IUserStore;
  AuthStore: IAuthStore;
}

interface IState {
  selecteddept: string
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
        super(props)

        this.state = { selecteddept: "" }
      }

      componentDidMount() {
        this.props.DepartmentStore.fetchAll();
        this.props.CommonStore.fetchCommonRecords();
        this.props.DepartmentStore.fetchAllRecords();
        this.props.UniqueStore.fetchArchival();
        this.props.UniqueStore.fetchFunctions();
        this.props.UniqueStore.fetchCategory();
        console.log(this.props.UserStore.currentUser.department)

        this.setState({ selecteddept: "" });
      };

      onSelect: any = (e: MouseEvent) => {
        const { value }: any = e.target;
        const dept: IDepartment = this.props.DepartmentStore.allDepartments.find(
          (x: IDepartment) => x.department === value
        );
        this.setState({ selecteddept: value });
        this.props.DepartmentStore.handleSelected(dept);
      };

      render() {
        const { DepartmentStore, UserStore } = this.props;
     
          if (UserStore.currentUser.admin) {
            return (
              <React.Fragment>
              <Grid container justify="center" alignItems="center" alignContent="center" style={{ marginBottom: 50 }}>
                <FormGroup>
                  <Select
                    id="selectdept"
                    style={styles.optionStyle}
                    onChange={this.onSelect}
                    value={this.state.selecteddept}
                  >
                    {DepartmentStore.allDepartments
                      .slice()
                      .sort((a: IDepartment, b: IDepartment) =>
                        a.department < b.department ? -1 : 1
                      )
                      .map((dept: any) => (
                        <MenuItem
                          style={{ height: 30 }}
                          key={dept.id}
                          value={dept.department}
                        >
                          {dept.department}
                        </MenuItem>
                      ))}
                  </Select>
                </FormGroup>
              </Grid>
              <AdminRoute admin={this.props.UserStore.currentUser.admin} />
            </React.Fragment>
            )
          } else {
            return (
              <React.Fragment>
              <Grid container justify="center" alignItems="center" alignContent="center" style={{ marginBottom: 50 }}>
                <FormGroup>
                  <br />
                  <h3>{ UserStore.currentUser.department }</h3>
                </FormGroup>
              </Grid>
              <AdminRoute admin={this.props.UserStore.currentUser.admin} />
            </React.Fragment>
            )
          }       
        }
    }
  )
);

export default Main;

const styles = {
  optionStyle: {
    fontSize: 14,
    marginTop: "40px",
    width: 300
  }
};

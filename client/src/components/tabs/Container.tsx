import * as React from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { inject, observer } from "mobx-react";
import {
  IDepartmentStore,
  IUniqueStore,
  IRecord,
  IRecordStore,
  UserStore
} from "../../stores";
import EnhancedTableHead from "../common/EnhancedTableHead";
import { EditModal, IOrder, IHeadRow } from "../common";
import { DepartmentTable, DeleteModal } from "./DeptRetention";

interface IProps {
  DepartmentStore: IDepartmentStore;
  UniqueStore: IUniqueStore;
  RecordStore: IRecordStore;
}

interface IState {
  openEdit: boolean;
  confirmDelete: boolean;
  order: IOrder;
  orderBy: string;
  sortDirection: string;
  snackbar: boolean;
  disable: boolean;
  onlycommentEdit: boolean;
  selectedclassification: string[];
  loadingPdf: boolean;
}

const headrows: IHeadRow[] = [
  { id: "function", label: "Function" },
  {
    id: "recordtype",
    label: "Record Type"
  },
  {
    id: "description",
    label: "Retention Description"
  },
  { id: "classification", label: "Classification" },
  { id: "comments", label: "Comments" },
  { id: "status", label: "Status" }
];

const Container = (WrappedComponent: any) =>
  inject("DepartmentStore", "UniqueStore", "RecordStore")(
    observer(
      class Container extends React.Component<IProps, IState> {
        constructor(props: IProps) {
          super(props);

          this.showEditModal = this.showEditModal.bind(this);

          this.state = {
            onlycommentEdit: false,
            openEdit: false,
            confirmDelete: false,
            order: "asc",
            orderBy: "recordtype",
            sortDirection: "asc",
            snackbar: false,
            disable: false, //can only edit comments if is common record
            selectedclassification: [],
            loadingPdf: false
          };
        }

        showEditModal(postDetail: IRecord) {
          if (postDetail.recordcategoryid === "common") {
            this.setState({ onlycommentEdit: true });
          } else {
            this.setState({ onlycommentEdit: false });
          }
          this.setState({ openEdit: true });
          this.props.DepartmentStore.updateEditID(postDetail);

          this.setState({ selectedclassification: postDetail.classification });
        }

        //make pdf
        makePdf = () => {
          this.setState({ loadingPdf: true });

          axios
            .post("/create-retention", this.props.DepartmentStore)
            .then(() => axios.get("fetch-retention", { responseType: "blob" }))
            .then((res: any) => {
              this.setState({ loadingPdf: false });
              const pdfBlob = new Blob([res.data], { type: "application/pdf" });
              saveAs(pdfBlob, "retention.pdf");
            })
            .catch((error: any) => console.log(error));
        };

        //pass id to store for delete action
        handleDelete = (deleterecord: IRecord) => {
          //show delete modal
          this.setState({ confirmDelete: true });
          this.props.DepartmentStore.updateDeleteID(deleterecord);
        };

        //click delete in delete modal
        onDelete: any = async () => {
          await this.props.DepartmentStore.deleteRecord();
          this.setState({ confirmDelete: false });
        };

        editRecord: any = async () => {
          await this.props.DepartmentStore.updateRecord(
            this.state.selectedclassification
          );
          // await this.props.DepartmentStore.setRecord()
          this.setState({ openEdit: false });
          this.setState({ snackbar: true });

          this.props.DepartmentStore.fetchAllRecords();
        };

        handleCheck = (e: any) => {
          if (e.target.checked) {
            this.setState({
              selectedclassification: [
                ...this.state.selectedclassification,
                e.target.value
              ]
            });
          } else {
            let remove = this.state.selectedclassification.indexOf(
              e.target.value
            );
            this.setState({
              selectedclassification: this.state.selectedclassification.filter(
                (_: any, i: any) => i !== remove
              )
            });
          }
          console.log(this.state.selectedclassification);
        };

        render() {
          let editClose = () => this.setState({ openEdit: false });
          const { DepartmentStore } = this.props;
          const department = this.props.DepartmentStore.selectedDepartment;
          const functions = this.props.UniqueStore.functionsDropdown;
          const categories = this.props.UniqueStore.categoryDropdown;

          return (
            <WrappedComponent
              openedit={this.state.openEdit}
              confirmdelete={this.state.confirmDelete}
              order={this.state.order}
              orderby={this.state.orderBy}
              sortdirection={this.state.sortDirection}
              snackbar={this.state.snackbar}
              disable={this.state.disable}
              onlycommentedit={this.state.onlycommentEdit}
              selectedclassification={this.state.selectedclassification}
              loadingpdf={this.state.loadingPdf}
              // handlecheck={this.handleCheck}
              // editrecord={this.editRecord}
              // showeditmodal={this.showEditModal}
              // ondelete={this.onDelete}
              // handledelete={this.handleDelete}
              // makepdf={this.makePdf}
              {...this.props}
            />
          );
        }
      }
    )
  );

export default Container;

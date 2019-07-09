import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import * as yup from "yup";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

const AddUniqueRecords = inject("UniqueStore")(
  observer(
    class AddUniqueRecords extends Component {
      componentWillMount() {
        this.props.UniqueStore.fetchFunctions();
      }

      state = {
        modalShow: false
      };

      render() {
        const schema = yup.object({
          RecordType: yup.string().required(),
          ProposedFunction: yup.string(),
          ProposedCategory: yup.string(),
          Notes: yup.string()
        });

        //const { UniqueStore } = this.props

        //this.props.UniqueStore.functionsDropdown.forEach(e=>console.log(e.functiontype))
        return (
          <Container>
            <Col md={{ span: 8, offset: 2 }}>
              <Formik
                validationSchema={schema}
                onSubmit={console.log}
                initialValues={{
                  RecordType: ""
                }}
              >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                  <Form
                    noValidate
                    onSubmit={handleSubmit}
                    style={styles.formStyle}
                  >
                    <Form.Group
                      controlId="recordtype"
                      style={styles.titleStyle}
                    >
                      <Form.Label>Record Type</Form.Label>
                      <Form.Control
                        type="text"
                        name="RecordType"
                        style={styles.inputStyle}
                        value={values.RecordType}
                        onChange={handleChange}
                        isinValid={!touched.RecordType && errors.RecordType}
                      />
                      <span style={styles.errorStyle}>{errors.RecordType}</span>
                    </Form.Group>

                    <Form.Group
                      controlId="proposedfunction"
                      style={styles.titleStyle}
                    >
                      <Form.Label>Proposed Function</Form.Label>
                      <Form.Control
                        as="select"
                        type="text"
                        name="ProposedFunction"
                        value={values.ProposedFunction}
                        style={styles.inputStyle}
                        onChange={handleChange}
                      >
                        <option>Choose...</option>
                        {this.props.UniqueStore.functionsDropdown.slice().map(func => 
                            <option key={func.id} {...func}>{ func.functiontype }</option>
                          )}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group
                      controlId="proposedcategory"
                      style={styles.titleStyle}
                    >
                      <Form.Label>Proposed Category</Form.Label>
                      <Form.Control
                        as="select"
                        type="text"
                        name="RecordCategory"
                        value={values.Category}
                        style={styles.inputStyle}
                        onChange={handleChange}
                      >
                        <option>Choose...</option>
                        <option>...</option>
                        <option>...</option>
                        <option>...</option>
                        <option>...</option>
                      </Form.Control>
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group
                      style={styles.titleStyle}
                      controlId="proposedretention"
                    >
                      <Form.Label>Proposed Retention</Form.Label>
                      <Form.Control
                        type="text"
                        name="ProposedRetention"
                        style={styles.inputStyle}
                        value={values.ProposedRetention}
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group style={styles.titleStyle} controlId="notes">
                      <Form.Label>Notes</Form.Label>
                      <Form.Control
                        style={{ fontSize: 12 }}
                        type="text"
                        name="Notes"
                        value={values.Notes}
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                    <div style={styles.footerStyle}>
                      <Button
                        variant="outline-primary"
                        type="submit"
                        name="terms"
                        label="submit form"
                        style={styles.buttonStyle}
                        isinvalid={!!errors.terms}
                        feedback={errors.terms}
                        onClick={() =>
                          this.setState({ modalShow: true }) && handleChange
                        }
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Col>
          </Container>
        );
      }
    }
  )
);

export default AddUniqueRecords;

const styles = {
  buttonStyle: {
    height: 26,
    width: 60,
    fontSize: 12,
    padding: 0
  },
  formStyle: {
    height: 32,
    fontSize: 11,
    paddingTop: 18
  },
  inputStyle: {
    height: 28,
    fontSize: 11
  },
  titleStyle: {
    textAlign: "left"
  },
  errorStyle: {
    color: "red"
  },
  footerStyle: {
    height: 60
  }
};

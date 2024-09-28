import "react-datepicker/dist/react-datepicker.css";
import { dropdownTypes } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CustomDropdown from "./Dropdown";
import {
  useCreateDataMutation,
  useFetchCategoriesPerUserQuery,
  setDataTimestamp,
  setDataDescription,
  setDataTotal,
  resetData,
} from "../store";
import { Col, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { resetUser } from "../store/slices/userSlice";
import App from "../App";

export default function DataForm({ userId, showSubmit }) {
  /* The @prop userId is used to check whether the user is logged in or not.
  If logged in, enabled the filtering option */

  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();

  // ! application level state (as of now) or component level ???
  const { description, timestamp, total } = useSelector((state) => {
    return state.data;
  });
  const { dataCategory } = useSelector((state) => {
    return state.dropdown;
  }); // ? get the category from the dropdown

  useEffect(() => {
    // transform the actual date in timestamp to set in the store
    if (!timestamp) {
      dispatch(setDataTimestamp(new Date().getTime()));
    }
  }, []);

  let categoriesOptions;
  const { data, error, isFetching } = useFetchCategoriesPerUserQuery({
    userId,
    batchData: false,
  });
  if (!isFetching && !error) {
    categoriesOptions = data.map((c) => {
      return { label: c.name, value: c.name }; // TODO: fix value
    });
  }

  const [createData] = useCreateDataMutation();
  const handleSubmit = (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        const result = createData({
          userId,
          description,
          category: dataCategory,
          timestamp,
          total,
        });
        console.log(`result: ${result}`);
        dispatch(resetData());
      } catch (error) {
        dispatch(resetUser());
        console.error(`[DataForm] error: ${JSON.stringify(error)}`);
        return <App />;
      }
    }
    event.preventDefault();
    setValidated(true);
  };

  return (
    <Form
      key={"data-form"}
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <Form.Group controlId="title" as={Row} className="m-2 align-items-center">
        <Form.Label column xs={4}>
          <h6>Description</h6>
        </Form.Label>
        <Col xs={8}>
          <Form.Control
            required
            type="text"
            className="form-input"
            placeholder="Untitled"
            value={description}
            disabled={userId ? false : true}
            onChange={(event) =>
              dispatch(setDataDescription(event.target.value))
            }
          />
        </Col>
        <Form.Control.Feedback type="invalid">
          Please provide a description.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group
        controlId="category"
        as={Row}
        className="m-2 align-items-center"
      >
        <Form.Label column xs={4}>
          <h6>Category</h6>
        </Form.Label>
        <Col xs={8}>
          <Form.Control
            required
            className="form-input"
            as={CustomDropdown}
            disabled={userId ? false : true}
            style={{ overflowY: "auto" }}
            type={dropdownTypes.DATA_CATEGORY}
            options={categoriesOptions}
          ></Form.Control>
        </Col>
        <Form.Control.Feedback type="invalid">
          Please select a category.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="date" as={Row} className="m-2 align-items-center">
        <Form.Label column xs={4}>
          <h6>Date</h6>
        </Form.Label>
        <Col xs={8}>
          <Form.Control
            required
            as={DatePicker}
            className="form-input"
            dateFormat="dd/MM/yyyy"
            selected={timestamp}
            disabled={userId ? false : true}
            onChange={(date) => dispatch(setDataTimestamp(date.getTime()))}
          ></Form.Control>
        </Col>
      </Form.Group>
      <Form.Group controlId="total" as={Row} className="m-2 align-items-center">
        <Form.Label column xs={4}>
          <h6>Total</h6>
        </Form.Label>
        <Col xs={8}>
          <Form.Control
            required
            type="number"
            className="form-input"
            placeholder="Untitled"
            value={total}
            disabled={userId ? false : true}
            onChange={(event) => dispatch(setDataTotal(event.target.value))}
          />
        </Col>
        <Form.Control.Feedback type="invalid">
          Please provide a total amount.
        </Form.Control.Feedback>
      </Form.Group>
      {showSubmit ? (
        <Row>
          <Col className="d-flex justify-content-center">
            <Button
              type="submit"
              disabled={userId ? false : true}
              className="btn-submit"
            >
              <FaPlus />
            </Button>
          </Col>
        </Row>
      ) : (
        <></>
      )}
    </Form>
  );
}

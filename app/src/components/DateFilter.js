import { useSelector, useDispatch } from "react-redux";
import { setFilterDateRange } from "../store";
import "react-datepicker/dist/react-datepicker.css";
import { FaUndo } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { Button, Row, Col } from "react-bootstrap";
import { resetFilterDateRange } from "../store/slices/filterSlice";
import Form from "react-bootstrap/Form";

export default function DateFilter({ userId }) {
  /* The @prop userId is used to check whether the user is logged in or not.
  If logged in, enabled the filtering option */

  const { dateRange } = useSelector((state) => {
    return state.filter;
  });

  const [startDate, endDate] = dateRange;
  const dispatch = useDispatch();
  const handleDateRangeUpdate = (update) => {
    let timestampList = update.map((date) => {
      return new Date(date).getTime();
    });
    dispatch(setFilterDateRange(timestampList));
  };

  // reset the date filter
  const resetDateToFilter = () => {
    dispatch(resetFilterDateRange());
  };

  return (
    <div>
      <h6 className="filter-title">Filter by date</h6>
      <Row className="justify-content-center align-items-center">
        <Col xs={10}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Form.Group
              controlId="filter-description"
              className="m-2 align-items-center"
            >
              <Form.Control
                required
                autoComplete="off"
                as={DatePicker}
                placeholderText="Filter by date"
                className="form-input"
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateRangeUpdate}
                disabled={userId ? false : true}
              />
            </Form.Group>
          </Form>
        </Col>
        <Col xs={2} className="justify-content-center">
          <Button onClick={resetDateToFilter} disabled={userId ? false : true}>
            <FaUndo />
          </Button>
        </Col>
      </Row>
    </div>
  );
}

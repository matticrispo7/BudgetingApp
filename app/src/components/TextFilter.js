import { useDispatch, useSelector } from "react-redux";
import { resetFilterText, setFilterText } from "../store";
import { FaUndo } from "react-icons/fa";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";

export default function TextFilter({ userId }) {
  /* The userId is used to check whether the user is logged in or not.
  If logged in, enabled the filtering option */

  const { textToSearch } = useSelector((state) => {
    return state.filter;
  });
  const dispatch = useDispatch();

  return (
    <div>
      <h6 className="filter-title">Filter by text</h6>
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
                type="text"
                autoComplete="off"
                className="form-input"
                placeholder="Untitled"
                value={textToSearch}
                disabled={userId ? false : true}
                onChange={(event) =>
                  dispatch(setFilterText(event.target.value))
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a description.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Col>
        <Col xs={2} className="justify-content-center">
          <Button
            disabled={userId ? false : true}
            onClick={() => {
              dispatch(resetFilterText());
            }}
          >
            <FaUndo />
          </Button>
        </Col>
      </Row>
    </div>
  );
}

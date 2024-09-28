import { useDispatch } from "react-redux";
import {
  useFetchCategoriesPerUserQuery,
  setDropdownCategoryToFilter,
} from "../store";
import { dropdownTypes } from "../utils";
import CustomDropdown from "./Dropdown";
import { FaUndo } from "react-icons/fa";
import { Button, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";

export default function CategoryFilter({ userId }) {
  /* The userId is used to check whether the user is logged in or not.
  If logged in, enabled the filtering option */

  const dispatch = useDispatch();

  // DROPDOWN CATEGORY FILTER
  const categoriesFetched = useFetchCategoriesPerUserQuery({
    userId: userId,
    batchData: false,
  });

  //console.log("categoriesFetched: ", categoriesFetched);

  let filterDropdownDisabled, categoriesToFilterOptions;
  if (categoriesFetched.isFetching || categoriesFetched.error) {
    filterDropdownDisabled = true;
  } else {
    filterDropdownDisabled = false;
    categoriesToFilterOptions = categoriesFetched.data.map((c) => {
      return { label: c.name, value: c.name };
    });
  }

  const resetCategoryToFilter = () => {
    dispatch(setDropdownCategoryToFilter(""));
  };

  return (
    <div>
      <h6 className="filter-title">Filter by category</h6>
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
                className="form-input"
                as={CustomDropdown}
                options={categoriesToFilterOptions}
                disabled={filterDropdownDisabled}
                type={dropdownTypes.CATEGORY_TO_FILTER}
              />
            </Form.Group>
          </Form>
        </Col>
        <Col xs={2} className="justify-content-center">
          <Button
            onClick={resetCategoryToFilter}
            disabled={userId ? false : true}
          >
            <FaUndo />
          </Button>
        </Col>
      </Row>
    </div>
  );
}

import CustomDropdown from "./Dropdown";
import {
  setCategoryName,
  setDropdownMainCategory,
  setIsSubCategory,
  useFetchCategoriesPerUserQuery,
  useCreateCategoryMutation,
  resetCategory,
} from "../store";
import { categoryTypesOptions, dropdownTypes } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { getCategoryData } from "../selectors/selectors";
import { Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { FaPlus } from "react-icons/fa";
import Button from "react-bootstrap/Button";

function CategoryForm({ userId, showSubmit }) {
  const dispatch = useDispatch();
  const { name, mainCategory, type } = useSelector(getCategoryData);
  let switchInitState = mainCategory ? true : false;
  // Switch management
  const [switchChecked, setSwitchChecked] = useState(switchInitState);
  const handleSwitchChange = () => {
    if (switchChecked === true) {
      // switch going to 'false' => reset mainCategory
      dispatch(setDropdownMainCategory(""));
      dispatch(setIsSubCategory(0));
    }
    setSwitchChecked(!switchChecked);
  };

  // fetch the options to display for each dropdown
  const {
    data: mainCategories,
    error,
    isFetching,
  } = useFetchCategoriesPerUserQuery({
    userId: userId,
    batchData: false,
    isSubCategory: 1,
  });

  let mainCategoryOptions;
  if (!isFetching && !error) {
    mainCategoryOptions = mainCategories.map((c) => {
      return { label: c.name, value: c.name, mainCategoryType: c.type }; // TODO: fix value
    });
  }
  // handle form submission

  const [createCategory] = useCreateCategoryMutation();
  const handleCreateCategory = (event) => {
    event.preventDefault();
    createCategory({ name, mainCategory, type, userId });
    dispatch(resetCategory());
  };

  return (
    <Form onSubmit={handleCreateCategory}>
      <Form.Group controlId="name" as={Row} className="m-2 align-items-center">
        <Form.Label column xs={4}>
          <h6>Name</h6>
        </Form.Label>
        <Col xs={8}>
          <Form.Control
            required
            type="text"
            placeholder="Untitled"
            value={name}
            disabled={userId ? false : true}
            onChange={(event) => dispatch(setCategoryName(event.target.value))}
          />
        </Col>
        <Form.Control.Feedback type="invalid">
          Please provide a name.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="name" as={Row} className="m-2 align-items-center">
        <Form.Label column xs={4}>
          <h6>Main category</h6>
        </Form.Label>
        <Col xs={8}>
          <Form.Check
            type="switch"
            id="main-category-switch"
            onChange={handleSwitchChange}
            checked={switchChecked}
            disabled={userId ? false : true}
          ></Form.Check>
          {switchChecked && (
            <Form.Control
              as={CustomDropdown}
              disabled={userId ? false : true}
              style={{ overflowY: "auto" }}
              type={dropdownTypes.MAIN_CATEGORY}
              options={mainCategoryOptions}
            ></Form.Control>
          )}
        </Col>
        <Form.Control.Feedback type="invalid">
          Please provide a name.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="name" as={Row} className="m-2 align-items-center">
        <Form.Label column xs={4}>
          <h6>Type</h6>
        </Form.Label>
        <Col xs={8}>
          <Form.Control
            required
            as={CustomDropdown}
            disabled={userId ? false : true}
            style={{ overflowY: "auto" }}
            type={dropdownTypes.CATEGORY_TYPE}
            options={categoryTypesOptions}
          ></Form.Control>
        </Col>
        <Form.Control.Feedback type="invalid">
          Please provide a name.
        </Form.Control.Feedback>
      </Form.Group>
      {showSubmit ? (
        <Row>
          <Col className="d-flex justify-content-center">
            <Button type="submit" disabled={userId ? false : true}>
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

export default CategoryForm;

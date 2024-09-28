import Dropdown from "react-bootstrap/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { dropdownTypes } from "../utils";
import {
  setDropdownCategoryType,
  setDropdownDataCategory,
  setDropdownMainCategory,
  setDropdownCategoryToFilter,
  setDropdownYearExpense,
} from "../store";

function CustomDropdown({ options, disabled, type }) {
  const {
    mainCategory,
    categoryType,
    dataCategory,
    categoryToFilter,
    yearExpense,
  } = useSelector((state) => {
    return state.dropdown;
  });
  const dispatch = useDispatch();

  const handleOptionClick = (option) => {
    let selected;
    switch (type) {
      case dropdownTypes.MAIN_CATEGORY:
        dispatch(setDropdownMainCategory(option));
        // set also the categoryType (inherited from the mainCategory)
        selected = options.filter((opt) => opt.label === option); // get the obj of the mainCategory selected
        if (selected[0]?.mainCategoryType) {
          dispatch(setDropdownCategoryType(selected[0].mainCategoryType));
        }
        break;
      case dropdownTypes.CATEGORY_TYPE:
        dispatch(setDropdownCategoryType(option));
        break;
      case dropdownTypes.DATA_CATEGORY:
        dispatch(setDropdownDataCategory(option));
        break;
      case dropdownTypes.CATEGORY_TO_FILTER:
        dispatch(setDropdownCategoryToFilter(option));
        break;
      case dropdownTypes.YEAR_EXPENSE:
        dispatch(setDropdownYearExpense(option));
        break;
      default:
        break;
    }
  };

  const dropdownOptions =
    options &&
    options.map((opt) => {
      return (
        <Dropdown.Item key={opt.label} eventKey={opt.value}>
          {opt.value}
        </Dropdown.Item>
      );
    });

  let content;
  switch (type) {
    case dropdownTypes.MAIN_CATEGORY:
      content = mainCategory || "Select...";
      break;
    case dropdownTypes.CATEGORY_TYPE:
      content = categoryType || "Select...";
      break;
    case dropdownTypes.DATA_CATEGORY:
      content = dataCategory || "Select...";
      break;
    case dropdownTypes.CATEGORY_TO_FILTER:
      content = categoryToFilter || "Select...";
      break;
    case dropdownTypes.YEAR_EXPENSE:
      content = yearExpense || "Select...";
      break;
    default:
      break;
  }

  return (
    <>
      <Dropdown onSelect={handleOptionClick}>
        <Dropdown.Toggle key={type} variant="success" disabled={disabled}>
          {content}
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "scroll" }}>
          {dropdownOptions}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default CustomDropdown;

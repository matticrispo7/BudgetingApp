import { useState, Fragment } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CategoryForm from "./CategoryForm";
import {
  setCategoryName,
  setDropdownMainCategory,
  setDropdownCategoryType,
  resetCategory,
  usePatchUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../store";
import { useSelector, useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import { getCategoryData } from "../selectors/selectors";

function CategoriesListItem({ data, userId }) {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const { id, name, type, mainCategory, isSubCategory } = data; // original data before editing the category
  const updatedCategoryData = useSelector(getCategoryData);

  const handleClose = () => {
    dispatch(resetCategory());
    setShow(false);
  };

  const handleEditRow = () => {
    // set the selected category properties when the model open
    dispatch(setCategoryName(name));
    dispatch(setDropdownCategoryType(type));
    dispatch(setDropdownMainCategory(mainCategory));
    setShow(true);
  };

  const [updateCategory] = usePatchUpdateCategoryMutation();
  let updatedValues = { id };
  const handleEditCategory = () => {
    //console.log("originalData: ", data);
    //console.log("updatedCategoryData: ", updatedCategoryData);
    // update the category only if the user have submitted new values
    if (name !== updatedCategoryData.name) {
      updatedValues.categoryName = updatedCategoryData.name;
    }
    if (type !== updatedCategoryData.type) {
      updatedValues.type = updatedCategoryData.type;
    }
    if (mainCategory !== updatedCategoryData.mainCategory) {
      updatedValues.mainCategory = updatedCategoryData.mainCategory;
    }
    if (isSubCategory !== updatedCategoryData.isSubCategory) {
      updatedValues.isSubCategory = updatedCategoryData.isSubCategory;
    }

    updatedValues.userId = userId;
    // send the PATCH request if at least a value is updated
    if (Object.keys(updatedValues).length > 1) {
      console.log("updated values: ", updatedValues);
      updateCategory(updatedValues);
    }
    dispatch(resetCategory());
    setShow(false);
  };

  const [deleteCategory] = useDeleteCategoryMutation();
  const handleDelete = () => {
    deleteCategory(id);
    dispatch(resetCategory());
    setShow(false);
  };

  return (
    <Fragment key={id}>
      <tr onClick={handleEditRow}>
        <td>{name}</td>
        <td>{mainCategory || ""}</td>
        <td>{type}</td>
      </tr>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CategoryForm userId={userId} showSubmit={false} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDelete}>
            <MdDelete />
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditCategory}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}

export default CategoriesListItem;

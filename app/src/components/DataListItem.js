import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DataForm from "./DataForm";
import {
  resetData,
  setData,
  useDeleteDataMutation,
  usePatchUpdateDataMutation,
} from "../store";
import { getUpdatedData } from "../selectors/selectors";
import { MdDelete } from "react-icons/md";

export default function DataListItem({ data, userId }) {
  let { id, timestamp, description, category, total } = data;
  const updatedData = useSelector(getUpdatedData); // using memoization
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  // let date = Date(timestamp);
  let date = new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  // * HANDLERS
  const handleEditRow = () => {
    dispatch(setData({ timestamp, description, category, total }));
    setShow(true);
  };

  const handleClose = () => {
    dispatch(resetData());
    setShow(false);
  };
  const [sendUpdateData] = usePatchUpdateDataMutation();
  let updatedValues = { id };

  const handleEditData = () => {
    if (timestamp !== updatedData.timestamp) {
      updatedValues.timestamp = updatedData.timestamp;
    }
    if (description !== updatedData.description) {
      updatedValues.description = updatedData.description;
    }
    if (category !== updatedData.category) {
      updatedValues.category = updatedData.category;
    }
    if (total !== updatedData.total) {
      updatedValues.total = updatedData.total;
    }
    updatedValues.userId = userId;
    // send the PATCH request if at least a value is updated
    if (
      updatedValues?.timestamp ||
      updatedValues?.description ||
      updatedValues?.category ||
      updatedValues?.total
    ) {
      console.log("updated values: ", updatedValues);
      sendUpdateData(updatedValues);
    }
    dispatch(resetData());
    setShow(false);
  };

  const [deleteData] = useDeleteDataMutation();
  const handleDelete = () => {
    deleteData({ dataId: id, userId: userId });
    //dispatch(resetCategory());
    setShow(false);
  };

  return (
    <Fragment>
      <tr onClick={handleEditRow}>
        <td>{date}</td>
        <td>{description}</td>
        <td>{category}</td>
        <td>{total} €</td>
      </tr>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DataForm userId={userId} showSubmit={false} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDelete}>
            <MdDelete />
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditData}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}

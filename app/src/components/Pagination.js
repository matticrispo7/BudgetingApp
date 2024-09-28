import Pagination from "react-bootstrap/Pagination";
import { setPaginationCurrentPage } from "../store";
import { useSelector, useDispatch } from "react-redux";

export default function CustomPagination({ totPages }) {
  const { currentPage } = useSelector((state) => {
    return state.pagination;
  });
  const dispatch = useDispatch();

  const handlePreviousPage = () => {
    dispatch(setPaginationCurrentPage(Math.max(currentPage - 1, 1)));
  };
  const handleNextPage = () => {
    dispatch(setPaginationCurrentPage(currentPage + 1));
  };

  return (
    <>
      <Pagination>
        <Pagination.Prev
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        />
        <Pagination.Item active>{currentPage}</Pagination.Item>
        <Pagination.Next
          onClick={handleNextPage}
          disabled={currentPage === totPages}
        />
      </Pagination>
    </>
  );
}

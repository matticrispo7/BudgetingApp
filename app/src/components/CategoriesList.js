import Table from "react-bootstrap/Table";
import CategoriesListItem from "./CategoriesListItem";
import { useFetchCategoriesPerUserQuery } from "../store";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useSelector } from "react-redux";

function CategoriesList({ userId }) {
  const { currentPage } = useSelector((state) => {
    return state.pagination;
  });
  const { data, error, isFetching } = useFetchCategoriesPerUserQuery({
    userId: userId,
    page: currentPage,
    batchData: true,
  });
  let content, initContent;
  let showInitContent = false;
  if (isFetching) {
    initContent = <ProgressBar animated now={45} />;
    showInitContent = true;
  } else if (error) {
    if (error?.status === 401) {
      initContent = <h1>Unauthorized</h1>;
    }
    showInitContent = true;
  } else {
    content = data.map((d) => {
      return <CategoriesListItem key={d.id} data={d} userId={userId} />;
    });
  }

  return (
    <>
      {showInitContent ? (
        initContent
      ) : (
        <Table hover className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Main Category</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </Table>
      )}
    </>
  );
}

export default CategoriesList;

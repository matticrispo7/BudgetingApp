import Table from "react-bootstrap/Table";
import DataListItem from "./DataListItem";
import { useFetchDataPerUserQuery } from "../store";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";

export default function DataList({ userId }) {
  console.log("[DataList] Render");
  // TODO: one single useSelector with multiple return values
  const { currentPage, categoryToFilter, dateRange, textToSearch } =
    useSelector((state) => {
      return {
        currentPage: state.pagination.currentPage,
        categoryToFilter: state.dropdown.categoryToFilter,
        dateRange: state.filter.dateRange,
        textToSearch: state.filter.textToSearch,
      };
    });

  let dateFilter;
  if (dateRange[0] && dateRange[1]) {
    dateFilter = dateRange;
  } else {
    dateFilter = null;
  }
  // get data in batch
  const { data, error, isFetching } = useFetchDataPerUserQuery({
    userId: userId,
    page: currentPage,
    batchData: true,
    filterCategory: categoryToFilter,
    filterDateRange: dateFilter,
    filterText: textToSearch,
  });

  let content, initContent;
  let showInitContent = false; // FIX: migliora codice perchè orrendo così
  if (isFetching) {
    initContent = (
      <Col>
        <ProgressBar animated now={45} />;
      </Col>
    ); // TODO: change "now" prop to loading percent
    showInitContent = true;
  } else if (error) {
    if (error?.status === 401) {
      initContent = (
        <Col>
          <h1>Unauthorized</h1>;
        </Col>
      );
    }
    showInitContent = true;
  } else {
    content = data
      .filter((d) => d.description.startsWith(textToSearch))
      .map((d) => {
        return <DataListItem key={d.id} data={d} userId={userId} />;
      });
  }

  return showInitContent ? (
    initContent
  ) : (
    <Row>
      <Col>
        <Table hover className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </Table>
      </Col>
    </Row>
  );
}

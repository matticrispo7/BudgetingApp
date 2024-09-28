import { Container, Row, Col } from "react-bootstrap";
import DataForm from "../components/DataForm";
import Chart from "../components/Chart";
import {
  useFetchDataPerUserLastPeriodQuery,
  useFetchTotDataPagesPerUserQuery,
  resetPage,
} from "../store";
import CustomPagination from "../components/Pagination";
import DataList from "../components/DataList";
import DateFilter from "../components/DateFilter";
import CategoryFilter from "../components/CategoryFilter";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import TextFilter from "../components/TextFilter";

export default function HomePage() {
  const dispatch = useDispatch();
  // reset the pagination when the page loads
  useEffect(() => {
    dispatch(resetPage());
  }, []);

  const userId = useSelector((state) => {
    return state.user.id;
  });

  let days = 90; // TODO: change these vars
  const { data, error, isFetching } = useFetchDataPerUserLastPeriodQuery({
    userId: userId,
    days: days,
  });
  const pagesFetched = useFetchTotDataPagesPerUserQuery(userId);
  let chart;
  if (!error && !isFetching) {
    chart = <Chart data={data} />;
  } else {
    if (error?.status === 401) {
      chart = <h1>Unauthorized</h1>;
    } else {
      chart = <h3>NO DATA TO DISPLAY</h3>;
    }
  }

  let pagination;
  if (!pagesFetched.error && !pagesFetched.isFetching) {
    pagination = (
      <>
        <CustomPagination
          activePage={1}
          totPages={pagesFetched.data.totPages}
          userId={userId}
        />
      </>
    );
  }

  return (
    <Container>
      <Row className="m-2">
        <Col sm={4}>
          <Row>
            <Col className="text-center">
              <h3>Add data</h3>
            </Col>
          </Row>
          <DataForm userId={userId} showSubmit={true} />
        </Col>
        <Col sm={8}>
          <h3 className="text-center">Balance last {days} days</h3>
          {chart}
        </Col>
      </Row>
      <Row className="m-2">
        <h1 className="p-2">Your latest data</h1>
        <Col xs={12} sm={4}>
          <TextFilter userId={userId} />
        </Col>

        <Col xs={12} sm={4} className=" d-flex justify-content-center">
          <CategoryFilter userId={userId} />
        </Col>
        <Col xs={12} sm={4}>
          <DateFilter userId={userId} />
        </Col>
      </Row>
      <Row>
        <DataList userId={userId} />
      </Row>
      <Row className="m-2">
        <Col className="d-flex justify-content-end">{pagination}</Col>
      </Row>
    </Container>
  );
}

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CategoriesList from "../components/CategoriesList";
import CategoryForm from "../components/CategoryForm";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useFetchTotPagesPerUserQuery, resetPage } from "../store";
import CustomPagination from "../components/Pagination";

export default function CategoriesPage() {
  const userId = useSelector((state) => {
    return state.user.id;
  });
  const dispatch = useDispatch();

  // reset the pagination when the page loads
  useEffect(() => {
    dispatch(resetPage());
  }, []);

  const { data, error, isFetching } = useFetchTotPagesPerUserQuery(userId);
  // show the pagination+categoryList if everything is fetched
  let pagination;
  if (!error && !isFetching) {
    pagination = (
      <>
        <CustomPagination
          activePage={1}
          totPages={data.totPages}
          userId={userId}
        />
      </>
    );
  }

  return (
    <Container>
      <Row className="m-2">
        <Col sm={8}>
          <Row>
            <Col>
              <CategoriesList userId={userId} />
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-end">{pagination}</Col>
          </Row>
        </Col>
        <Col sm={4}>
          <Row>
            <Col>
              <h3 className="text-center">Add new category</h3>
            </Col>
          </Row>
          <CategoryForm key="category-form" userId={userId} showSubmit={true} />
        </Col>
      </Row>
    </Container>
  );
}

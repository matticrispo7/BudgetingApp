import { Container, Row, Col } from "react-bootstrap";
import CustomPieChart from "../components/PieChart";
import {
  useFetchAggregateTotalPerUserLastPeriodQuery,
  useFetchDataPerUserLastYearQuery,
  useFetchListOfYearsPerUserQuery,
  useFetchDataPerUserLastPeriodQuery,
} from "../store";
import CustomAccordion from "../components/Accordion";
import { wrangleAccordionData, dropdownTypes } from "../utils";
import Chart from "../components/Chart";
import CustomBarChart from "../components/BarChart";
import { useSelector } from "react-redux";
import ProgressBar from "react-bootstrap/ProgressBar";
import Form from "react-bootstrap/Form";
import CustomDropdown from "../components/Dropdown";
import DateFilter from "../components/DateFilter";

export default function DashboardPage() {
  const userId = useSelector((state) => {
    return state.user.id;
  });

  const yearExpense = useSelector((state) => {
    return state.dropdown.yearExpense;
  });

  const { dateRange } = useSelector((state) => {
    return state.filter;
  });

  const days = 30;
  const aggregatedData = useFetchAggregateTotalPerUserLastPeriodQuery({
    userId: userId,
    dateRange,
  });

  // get the linePlot data
  const {
    data: linePlotData,
    error: linePlotError,
    isFetching: isFetchingLinePlot,
  } = useFetchDataPerUserLastPeriodQuery({ userId: userId, days: days });
  let linePlot;
  if (!linePlotError && !isFetchingLinePlot) {
    linePlot = <Chart data={linePlotData} />;
  } else {
    linePlot = <ProgressBar animated now={45} />;
  }
  const {
    data: barPlotData,
    error: barPlotError,
    isFetching: isFetchingBarPlot,
  } = useFetchDataPerUserLastYearQuery({ userId: userId, year: yearExpense });
  let barPlot, totalYearExpense, totalYearIncome;

  if (!barPlotError && !isFetchingBarPlot) {
    totalYearExpense = barPlotData.reduce((acc, data) => acc + data.expense, 0);
    totalYearIncome = barPlotData.reduce((acc, data) => acc + data.income, 0);
    barPlot = <CustomBarChart data={barPlotData} />;
  } else {
    totalYearExpense = "None";
    totalYearIncome = "None";
    barPlot = <ProgressBar animated now={45} />;
  }

  let pieChartExpense, accordionExpense, pieChartIncome, accordionIncome;
  if (!aggregatedData.error && !aggregatedData.isFetching) {
    //console.log("aggregatedData expense: ", aggregatedData.data.expense);

    let wrangledExpense = wrangleAccordionData(aggregatedData.data.expense);
    let mainCategoriesExpense = wrangledExpense.map((d) => {
      return { name: d.mainCategory, total: d.total };
    });
    pieChartExpense = <CustomPieChart data={mainCategoriesExpense} />;
    accordionExpense = <CustomAccordion data={aggregatedData.data.expense} />;

    //console.log("aggregatedData income: ", aggregatedData.data.income);
    let wrangledIncome = wrangleAccordionData(aggregatedData.data.income);
    let mainCategoriesIncome = wrangledIncome.map((d) => {
      return { name: d.mainCategory, total: d.total };
    });
    pieChartIncome = <CustomPieChart data={mainCategoriesIncome} />;
    accordionIncome = <CustomAccordion data={aggregatedData.data.income} />;
  }

  // get the list of years to show as options in the barplot dropdown
  const {
    data: yearsData,
    error: yearsError,
    isFetching: yearsIsFetching,
  } = useFetchListOfYearsPerUserQuery({ userId });

  let yearsList;
  if (!yearsIsFetching && !yearsError) {
    yearsList = yearsData.map((y) => {
      return { label: y.year, value: y.year };
    });
  }

  let textExpense, textDetailExpense, textIncome, textDetailIncome;
  if (dateRange[0] > 0 && dateRange[1] > 0) {
    textExpense = "Expense for given period";
    textDetailExpense = "Expense details";
    textIncome = "Income for given period";
    textDetailIncome = "Income detail";
  } else {
    textExpense = "Expense last 30 days";
    textDetailExpense = "Expense details";
    textIncome = "Income last 30 days";
    textDetailIncome = "Income detail";
  }

  return (
    <Container>
      <Row className="m-2 align-items-center">
        <Col xs={12} sm={6} className="text-center">
          <Row>
            <h4 className="form-label">Balance last {days} days</h4>
          </Row>
          <Row>{linePlot}</Row>
        </Col>
        <Col xs={12} sm={6} className="text-center">
          <Form.Group as={Row}>
            <Form.Label column xs={3}>
              <h4>Expenses</h4>
            </Form.Label>
            <Col xs={3}>
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
                    options={yearsList}
                    style={{ overflowY: "auto" }}
                    disabled={false}
                    type={dropdownTypes.YEAR_EXPENSE}
                  />
                </Form.Group>
              </Form>
            </Col>
            <Form.Label column xs={3}>
              <Row>
                <h6 className="year-income">Income: {totalYearIncome} </h6>
              </Row>
            </Form.Label>
            <Form.Label column xs={3}>
              <Row>
                <h6 className="year-expense">Expense: {totalYearExpense} </h6>
              </Row>
            </Form.Label>
          </Form.Group>
          <Row>{barPlot}</Row>
        </Col>
      </Row>
      <Row className="m-2">
        <Col xs={11} sm={4} className="">
          <DateFilter userId={userId} />
        </Col>
        <Col xs={1} sm={8}></Col>
      </Row>
      <Row className="m-2">
        <Col sm={3} className="text-center">
          <h4 className="mt-2">{textExpense}</h4>
          {pieChartExpense}
        </Col>
        <Col sm={3} className="text-center">
          <h5>{textDetailExpense}</h5>
          {accordionExpense}
        </Col>
        <Col sm={3} className="text-center">
          <h4 className="mt-2">{textIncome}</h4>
          {pieChartIncome}
        </Col>
        <Col sm={3} className="text-center">
          <h5>{textDetailIncome}</h5>
          {accordionIncome}
        </Col>
      </Row>
    </Container>
  );
}

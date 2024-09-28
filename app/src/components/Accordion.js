import Accordion from "react-bootstrap/Accordion";
import { wrangleAccordionData } from "../utils";
import { Row, Col } from "react-bootstrap";

export default function CustomAccordion({ data }) {
  const wrangledData = wrangleAccordionData(data);
  let accordion;
  accordion = (
    <Accordion>
      {wrangledData.map((mainCat, mainIndex) => {
        let accordionBody, subCatData;
        let showAccordionBody = true;
        if (mainCat.subCategories) {
          subCatData = mainCat.subCategories.map((subCat) => {
            return (
              <Row key={subCat.name} className="d-flex justify-content-center">
                <Col className="accordion-body-category">{subCat.name}</Col>
                <Col className="accordion-body-total">{subCat.total} €</Col>
              </Row>
            );
          });
        }
        let totalSubCategories = mainCat.subCategories.reduce((acc, sub) => {
          return acc + sub.total;
        }, 0);
        // avoid to show the mainCategory name (with a total == 0)
        if (mainCat.subCategories.length === 0) {
          showAccordionBody = false;
        }
        if (totalSubCategories === mainCat.total) {
          accordionBody = subCatData;
        } else {
          accordionBody = (
            <>
              <Row
                key={mainCat.mainCategory}
                className="d-flex justify-content-center"
              >
                <Col xs={6} sm={6} className="accordion-body-category">
                  {mainCat.mainCategory}
                </Col>
                <Col xs={6} sm={6} className="accordion-body-total">
                  {mainCat.total - totalSubCategories} €
                </Col>
              </Row>
              {subCatData}
            </>
          );
        }

        return (
          <Accordion.Item eventKey={mainIndex} key={mainIndex}>
            <Accordion.Header>
              <Row className="d-flex justify-content-center">
                <Col className="accordion-header-category">
                  {mainCat.mainCategory}
                </Col>
                <Col className="accordion-header-total">{`${mainCat.total} €`}</Col>
              </Row>
            </Accordion.Header>
            {showAccordionBody ? (
              <Accordion.Body>
                <Row className="d-flex justify-content-center">
                  {accordionBody}
                </Row>
              </Accordion.Body>
            ) : (
              <></>
            )}
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
  return accordion;
}

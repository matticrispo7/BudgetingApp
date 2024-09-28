import { Row, Col } from "react-bootstrap";
import { useState } from "react";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

export default function JoinPage() {
  const { REACT_APP_DISABLE_SIGNUP: disable_signup } = process.env;
  const [currentForm, setCurrentForm] = useState("login");

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  let content;
  if (parseInt(disable_signup)) {
    content = <SignIn className="join-component" />;
  } else {
    content =
      currentForm === "login" ? (
        <SignIn onFormSwitch={toggleForm} className="join-component" />
      ) : (
        <SignUp onFormSwitch={toggleForm} className="join-component" />
      );
  }

  return (
    <Row className="m-2 join-content">
      <Col></Col>
      <Col xs={10} sm={6}>
        {content}
      </Col>
      <Col></Col>
    </Row>
  );
}

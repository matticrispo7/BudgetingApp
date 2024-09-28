import { useState } from "react";
import { useDispatch } from "react-redux";
import useRequest from "../hooks/useRequest";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../store/slices/userSlice";
import { Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { baseURL } from "../utils";

export default function SignIn({ onFormSwitch }) {
  const { REACT_APP_DISABLE_SIGNUP: disable_signup } = process.env;
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doRequest } = useRequest({
    url: `${baseURL}/api/users/signin`,
    method: "post",
    body: {
      emailOrUsername,
      password,
    },
    onSuccess: () => {},
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    // make the request with the custom hook
    const response = await doRequest();
    if (response) {
      //console.log("**** Setting token in redux store. Response: ", response);
      dispatch(setUserData(response));
      navigate("/");
    }
  };

  let contentSignUp;
  if (parseInt(disable_signup)) {
    contentSignUp = (
      <>
        <Col sm={4} />
        <Col sm={4}>
          <Button type="submit" className="btn-join">
            Sign In
          </Button>
        </Col>
        <Col sm={4} />
      </>
    );
  } else {
    contentSignUp = (
      <>
        <Col sm={3}>
          <Button type="submit" className="btn-join">
            Sign In
          </Button>
        </Col>
        <Col sm={9} className="text-center">
          <Button onClick={() => onFormSwitch("register")} className="link-btn">
            Don't have an account? Sign up here
          </Button>
        </Col>
      </>
    );
  }

  return (
    <Form noValidate onSubmit={onSubmit}>
      <Form.Group controlId="emailOrUsername" as={Row} className="m-2">
        <Row>
          <h4>Email or Username</h4>
        </Row>
        <Row>
          <Form.Control
            required
            type="text"
            placeholder="email or username"
            autoComplete="off"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />
        </Row>
        <Form.Control.Feedback type="invalid">
          Please provide an email.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="password" as={Row} className="m-2">
        <Row>
          <h4>Password</h4>
        </Row>
        <Row>
          <Form.Control
            required
            type="password"
            placeholder="password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Row>
        <Form.Control.Feedback type="invalid">
          Please provide a password.
        </Form.Control.Feedback>
      </Form.Group>

      <Row className="m-2">{contentSignUp}</Row>
    </Form>
  );
}

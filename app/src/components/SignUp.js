import { useState } from "react";
import { useDispatch } from "react-redux";
import useRequest from "../hooks/useRequest";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../store/slices/userSlice";
import { Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { baseURL } from "../utils";

export default function SignUp({ onFormSwitch }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [initBalance, setInitBalance] = useState(0);
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doRequest, errors } = useRequest({
    url: `${baseURL}/api/users/signup`,
    method: "post",
    body: {
      email,
      username,
      password,
    },
    onSuccess: () => {},
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    // make the request with the custom hook
    const response = await doRequest();

    if (errors) {
      console.log("Unable to process request");
      return;
    }

    if (response) {
      dispatch(setUserData(response));
      navigate("/");
    }
  };

  return (
    <Form noValidate onSubmit={onSubmit}>
      <Form.Group controlId="email" as={Row} className="m-2">
        <Row>
          <h4>Email</h4>
        </Row>
        <Row>
          <Form.Control
            required
            type="text"
            placeholder="email@email.com"
            value={email}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Row>
        <Form.Control.Feedback type="invalid">
          Please provide an email.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="username" as={Row} className="m-2">
        <Row>
          <h4>Username</h4>
        </Row>
        <Row>
          <Form.Control
            required
            type="text"
            placeholder="username"
            value={username}
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Row>
        <Form.Control.Feedback type="invalid">
          Please provide a password.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="initBalance" as={Row} className="m-2">
        <Row>
          <h4>Initial balance</h4>
        </Row>
        <Row>
          <Form.Control
            required
            type="number"
            value={initBalance}
            autoComplete="off"
            onChange={(e) => setInitBalance(e.target.value)}
          />
        </Row>
        <Form.Control.Feedback type="invalid">
          Please provide a password.
        </Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col sm={3}>
          <Button type="submit" className="btn-join">
            Sign Up
          </Button>
        </Col>

        <Col sm={9} className="text-center">
          <Button onClick={() => onFormSwitch("login")} className="link-btn">
            Already have an account? Sign in here
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

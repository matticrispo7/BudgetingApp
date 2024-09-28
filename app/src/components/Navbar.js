import { FaSignInAlt } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useSelector, useDispatch } from "react-redux";
import { resetUser } from "../store/slices/userSlice";
import useRequest from "../hooks/useRequest";
import { useState } from "react";
import { baseURL } from "../utils";

export default function CustomNavbar() {
  console.log("Navbar render");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get the user token (if logged in)
  const [userToken, refreshToken, userId] = useSelector((state) => {
    //console.log("[Navbar] Get state from redux");
    return [state.user.token, state.user.refreshToken, state.user.id];
  });

  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const handleNavbarToggle = () => {
    setNavbarExpanded(!navbarExpanded);
  };

  // define the signout request
  const { doRequest } = useRequest({
    url: `${baseURL}/api/users/signout`,
    method: "post",
    body: {
      refreshToken,
    },
    onSuccess: () => {},
  });

  const signOutUser = async () => {
    const response = await doRequest();
    if (response) {
      dispatch(resetUser());
      setNavbarExpanded(false);
      navigate("/");
    }
  };

  let joinContent;

  if (userToken) {
    // show logout
    joinContent = (
      <NavLink className="nav-link" onClick={signOutUser}>
        <BiLogOut />
      </NavLink>
    );
  } else {
    joinContent = (
      <NavLink to="/join" className="nav-link" onClick={handleNavbarToggle}>
        <FaSignInAlt />
      </NavLink>
    );
  }

  const navLinkClassName = userId ? "nav-link" : "nav-link disabled";

  return (
    <Navbar
      key={"navbar"}
      expand="lg"
      bsPrefix="navbar"
      expanded={navbarExpanded}
    >
      <Container>
        <Navbar.Brand>Budget App</Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={handleNavbarToggle}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" variant="underline">
            <NavLink to="/" className="nav-link" onClick={handleNavbarToggle}>
              Home
            </NavLink>
            <NavLink
              to="/categories"
              className={navLinkClassName}
              onClick={handleNavbarToggle}
            >
              Categories
            </NavLink>
            <NavLink
              to="/dashboard"
              className={navLinkClassName}
              onClick={handleNavbarToggle}
            >
              Dashboard
            </NavLink>
            {joinContent}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

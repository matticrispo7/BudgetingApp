import { Outlet } from "react-router-dom";
import CustomNavbar from "../components/Navbar";

export default function SharedLayout() {
  return (
    <>
      <CustomNavbar />
      <Outlet />
    </>
  );
}

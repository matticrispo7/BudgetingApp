import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from "./pages/errorPage";
import HomePage from "./pages/homePage";
import CategoriesPage from "./pages/categoriesPage";
import SharedLayout from "./pages/sharedLayout";
import DashboardPage from "./pages/dashboardPage";
import JoinPage from "./pages/joinPage";
import { useSelector } from "react-redux";

export default function App() {
  const userId = useSelector((state) => {
    return state.user.id;
  });

  let homePage, joinPage;
  if (userId !== "") {
    homePage = <Route index element={<HomePage />} />;
    joinPage = <Route path="join" element={<JoinPage />} />;
  } else {
    homePage = <Route path="/" element={<HomePage />} />;
    joinPage = <Route index element={<JoinPage />} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          {homePage}
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          {joinPage}
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

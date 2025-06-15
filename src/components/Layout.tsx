import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="pt-20 bg-white dark:bg-gray-800">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;

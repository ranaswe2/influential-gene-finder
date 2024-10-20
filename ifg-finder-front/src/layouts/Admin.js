import React from "react";
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";
import routes from "routes.js";

var ps;

function Admin(props) {
  const location = useLocation();
  const [backgroundColor, setBackgroundColor] = React.useState("blue");
  const mainPanel = React.useRef();

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.body.classList.toggle("perfect-scrollbar-on");
      }
    };
  });

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
  }, [location]);

  const handleColorClick = (color) => {
    setBackgroundColor(color);
  };

  // Check if the current route is "/dashboard"
  const isDashboardPage = location.pathname === "/dashboard";

  return (
    <div className="wrapper">
      <Sidebar {...props} routes={routes} backgroundColor={backgroundColor} />
      <div className="main-panel" ref={mainPanel}>
        {/* Conditionally render DemoNavbar only on the Dashboard page */}
        {isDashboardPage && <DemoNavbar {...props} />}
        <Routes>
  {routes.map((prop, key) => {
    return (
      <Route
        path={`${prop.layout}${prop.path}`}
        element={prop.component}
        key={key}
        exact
      />
    );
  })}
  {/* Redirect root path to /admin/dashboard */}
  <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
</Routes>
        <Footer fluid />
      </div>
      <FixedPlugin
        bgColor={backgroundColor}
        handleColorClick={handleColorClick}
      />
    </div>
  );
}

export default Admin;


import React, { Component } from "react";

function FixedPlugin(props) {
  const [classes, setClasses] = React.useState("dropdown show");
  const handleClick = () => {
    if (classes === "dropdown") {
      setClasses("dropdown show");
    } else {
      setClasses("dropdown");
    }
  };
  return (
    <div className="fixed-plugin">
      <div className={classes}>
        <div onClick={handleClick}>
         <i className="fa fa-cog fa-2x" />
        </div>
        <ul className="dropdown-menu show">
          <li className="header-title">Sidebar Color</li>
          <li className="adjustments-line">
            <div className="badge-colors text-center">
              <span
                className={
                  props.bgColor === "merun"
                    ? "badge filter badge-merun active"
                    : "badge filter badge-merun"
                }
                data-color="merun"
                onClick={() => {
                  props.handleColorClick("merun");
                }}
              />
              <span
                className={
                  props.bgColor === "blue"
                    ? "badge filter badge-blue active"
                    : "badge filter badge-blue"
                }
                data-color="blue"
                onClick={() => {
                  props.handleColorClick("blue");
                }}
              />
              <span
                className={
                  props.bgColor === "green"
                    ? "badge filter badge-green active"
                    : "badge filter badge-green"
                }
                data-color="green"
                onClick={() => {
                  props.handleColorClick("green");
                }}
              />
              <span
                className={
                  props.bgColor === "orange"
                    ? "badge filter badge-orange active"
                    : "badge filter badge-orange"
                }
                data-color="orange"
                onClick={() => {
                  props.handleColorClick("orange");
                }}
              />
              {/* <span
                className={
                  props.bgColor === "red"
                    ? "badge filter badge-red active"
                    : "badge filter badge-red"
                }
                data-color="red"
                onClick={() => {
                  props.handleColorClick("red");
                }}
              /> */}
              <span
                className={
                  props.bgColor === "dark-blue"
                    ? "badge filter badge-dark-blue active"
                    : "badge filter badge-dark-blue"
                }
                data-color="dark-blue"
                onClick={() => {
                  props.handleColorClick("dark-blue");
                }}
              />
            </div>
          </li>

        </ul>
      </div>
    </div>
  );
}

export default FixedPlugin;

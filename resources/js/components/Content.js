import React from "react";
import { Outlet } from "react-router-dom";
import "../../sass/components/Content.scss";

export default function Content() {
  return (
    <div className="content">
      <Outlet />
    </div>
  );
}

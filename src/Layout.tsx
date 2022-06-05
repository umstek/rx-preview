import { Outlet, Route, Routes } from "react-router-dom";

import PreviewPane from "./PreviewPane";
import PropertiesPane from "./PropertiesPane";
import ToolboxPane from "./ToolboxPane";

export function Layout() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="grid gap-2 grid-cols-12 grid-rows-3">
            <Outlet />
          </div>
        }
      >
        <Route
          path=":fileId"
          element={
            <>
              <div className="row-span-3 col-span-2">
                <ToolboxPane />
              </div>
              <div className="row-span-3 col-span-6">
                <PreviewPane />
              </div>
              <div className="row-span-3 col-span-4">
                <Outlet />
              </div>
            </>
          }
        >
          <Route path=":componentId" element={<PropertiesPane />} />
        </Route>
      </Route>
    </Routes>
  );
}


import React, { useEffect, useState } from "react";
import { createBrowserRouter, createHashRouter, Route, RouterProvider, Routes } from "react-router-dom";
import { Box } from "@mui/material";

import '../src/style/index.css'
import { Category } from "./page/category";
import { Color, ColorPage } from "./page/color";
import { ProductPage } from "./page/product";
import { DetailPage } from "./page/detail";
import { LoginPage } from "./page/login";
import { PageContainer } from "./component/pageContainer";
export const router = createHashRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/category",
    element: <Category />,
  },
  {
    path: "/color",
    element: <ColorPage />,
  },
  {
    path: "/product",
    element: <ProductPage />,
  },
  {
    path: "/detail/:productId",
    element: <DetailPage />,
  },
]);
export default function App() {
  console.log('app render')
  return (
    <PageContainer>
      <RouterProvider router={router} />
    </PageContainer>

  );
}

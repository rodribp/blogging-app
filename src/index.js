import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./routes/app";
import Article from "./routes/article"
import Wallet from "./routes/wallet"
import Login from "./routes/login"
import SignUp from "./routes/signup"
import ErrorPage from "./error-page";
import Profile from "./routes/profile";
import { isLoggedIn } from "./session";
import 'bootstrap/dist/css/bootstrap.min.css';

const loggedRoutes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />
  },
  {
    path: "/article",
    element: <Article />
  },
  {
    path: "/wallet",
    element: <Wallet />
  },
  {
    path: "/profile",
    element: <Profile />
  }
];

const noLoggedRoutes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <SignUp />
  }
];

const router = isLoggedIn() ? createBrowserRouter(loggedRoutes) : createBrowserRouter(noLoggedRoutes)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
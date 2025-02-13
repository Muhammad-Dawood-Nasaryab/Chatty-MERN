import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import LayoutComponent from "./components/LayoutComponent";

const router = createBrowserRouter([
	{
		path: "/",
		element: <LayoutComponent />,
		children: [
			{
				path: "/",
				element: <HomePage />,
			},
			{
				path: "/signup",
				element: <SignUpPage />,
			},
			{
				path: "/login",
				element: <LoginPage />,
			},
			{
				path: "/settings",
				element: <SettingsPage />,
			},
			{
				path: "/profile",
				element: <ProfilePage />,
			},
		],
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);

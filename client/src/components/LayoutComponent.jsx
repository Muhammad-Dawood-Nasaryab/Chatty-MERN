import React from "react";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import { useAuthStore } from "../store/useAuthStore.js";

const LayoutComponent = () => {
	const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
	const navigate = useNavigate();
	const location = useLocation();

	const allowedPaths = ["/signup", "/login", "/settings"];

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!isCheckingAuth) {
			if (!authUser && !allowedPaths.includes(location.pathname)) {
				navigate("/login", { replace: true });
			} else if (authUser && ["/login", "/signup"].includes(location.pathname)) {
				navigate("/", { replace: true });
			};
		};
	}, [isCheckingAuth, authUser, navigate, location.pathname]);

	// Show loading message if authUser is null
	if (isCheckingAuth && !authUser) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader className="size-10 animate-spin" />
			</div>
		);
	};

	return (
		<div>
			<Navbar />
			<Outlet />
			<Toaster />
		</div>
	);
};

export default LayoutComponent;

import toast from "react-hot-toast";
import { create } from "zustand";

import { fetchServer } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
	// User data
	onlineUsers: [],
	authUser: null,

	// Loading variables
	isUpdatingProfile: false,
	isSigningUp: false,
	isLoggingIn: false,
	isCheckingAuth: true,

	// Check user auth
	checkAuth: async () => {
		try {
			const res = await fetchServer("/auth/check");
			set({ authUser: res.data });
		} catch (error) {
			console.error("Error in checking auth: ", error);
			set({ authUser: null });
		} finally {
			set({ isCheckingAuth: false });
		}
	},

	// Sign up
	signup: async (data) => {
		set({ isSigningUp: true });
		try {
			const res = await fetchServer.post("/auth/register", data);
			set({ authUser: res.data });
			toast.success("Account created successfully");
			get().connectSocket();
		} catch (error) {
			toast.error(error.response.data.error);
		} finally {
			set({ isSigningUp: false });
		}
	},

	// Log in
	login: async (data) => {
		set({ isLoggingIn: true });
		try {
			const res = await fetchServer.post("/auth/login", data);
			set({ authUser: res.data });
			toast.success("Logged in successfully");
		} catch (error) {
			toast.error(error.response.data.error);
		} finally {
			set({ isLoggingIn: false });
		}
	},

	// Log out
	logout: async () => {
		try {
			await fetchServer.post("/auth/logout");
			set({ authUser: null });
			toast.success("Logged out successfully");
		} catch (error) {
			toast.error(error.response.data.error);
		}
	},

	// Update profile
	updateProfile: async (data) => {
		set({ isUpdatingProfile: true });
		try {
			const res = await fetchServer.put("/auth/update-profile", data);
			set({ authUser: res.data });
			toast.success("Profile updated successfully");
		} catch (error) {
			console.log("error in updating profile: ", error);
			toast.error(error.response.data.error);
		} finally {
			set({ isUpdatingProfile: false });
		}
	},
}));

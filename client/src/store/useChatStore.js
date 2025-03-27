import toast from "react-hot-toast";

import { create } from "zustand";
import { fetchServer } from "../lib/axios.js";

export const useChatStore = create((set, get) => ({
	messages: [],
	users: [],
	selectedUser: null,
	isMessagesLoading: false,
	isUsersLoading: false,

	getUsers: async () => {
		set({ isUsersLoading: true });
		try {
			const res = await fetchServer("/messages/users");
			set({ users: res.data });
		} catch (error) {
			console.log("Error in getting users: ", error);
			toast.error(error.response.data.error);
		} finally {
			set({ isUsersLoading: false });
		}
	},

	getMessages: async (userId) => {
		set({ isMessagesLoading: true });
		try {
			const res = await fetchServer(`/messages/${userId}`);
			set({ messages: res.data });
		} catch (error) {
			console.log("Error in getting messages: ", error);
			toast.error(error.response.data.error);
		} finally {
			set({ isMessagesLoading: false });
		}
	},

	sendMessage: async (message) => {
		const { messages, selectedUser } = get();
		try {
			const res = await fetchServer(
				`/messages/send/${selectedUser._id}`,
				message
			);
			set({ messages: [...messages, res.data] });
		} catch (error) {
			toast.error(error.response.data.error);
		}
	},

	setSelectedUser: async (selectedUser) => set({ selectedUser }),
}));

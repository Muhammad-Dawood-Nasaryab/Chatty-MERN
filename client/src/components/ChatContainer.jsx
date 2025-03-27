import React from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

const ChatContainer = () => {
	const { messages, getMessages, isMessagesLoading, selectedUser } =
		useChatStore();

	useEffect(() => {
		if (selectedUser) {
			getMessages(selectedUser._id);
		}
	}, [selectedUser, getMessages]);

	if (isMessagesLoading) {
		return (
			<div>
				<ChatHeader />
				<MessageSkeleton />
				<MessageInput />
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col overflow-auto">
			<ChatHeader />

			<p>messages...</p>

			<MessageInput />
		</div>
	);
};

export default ChatContainer;

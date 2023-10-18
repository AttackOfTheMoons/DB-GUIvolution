import {
	ChatContainer,
	MainContainer,
	Message,
	MessageInput,
	MessageList,
	TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.css";
import axios from "axios"; // Import the Axios library
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./index.css";

function DynamicChatbot() {
	const [messages, setMessages] = useState([
		{
			message: "Hello, I'm your SQL query assistant!",
			sentTime: "just now",
			sender: "ChatGPT",
		},
	]);

	const [isTyping, setIsTyping] = useState(false);

	const handleSend = async (userMessage) => {
		// Create a new message from the user
		const newUserMessage = {
			message: userMessage,
			direction: "outgoing",
			sender: "user",
		};

		// Add the user's message to the message list
		const newMessages = [...messages, newUserMessage];
		setMessages(newMessages);

		// Show typing indicator while waiting for a response
		setIsTyping(true);

		try {
			// Make an API request to the backend
			const response = await axios.post("/api/nlp/generate_sql", {
				user_input: userMessage,
			});

			// Get the chatbot's response
			const chatbotResponse = response.data.sql_query;

			// Create a new message for the chatbot's response
			const newChatbotMessage = {
				message: chatbotResponse,
				direction: "incoming",
				sender: "ChatGPT",
			};

			// Add the chatbot's response to the message list
			const updatedMessages = [...newMessages, newChatbotMessage];
			setMessages(updatedMessages);

			// Hide typing indicator
			setIsTyping(false);
		} catch (error) {
			console.error("Error sending user message:", error);

			// Handle errors, show an error message, etc.
			setIsTyping(false);
		}
	};

	return (
		<div className="App">
			<div style={{ position: "relative", height: "100%", width: "415px" }}>
				<MainContainer>
					<ChatContainer>
						<MessageList
							scrollBehavior="smooth"
							typingIndicator={
								isTyping ? (
									<TypingIndicator content="AI assistant is typing" />
								) : null
							}
						>
							{messages.map((message) => {
								return <Message key={uuidv4()} model={message} />;
							})}
						</MessageList>
						<MessageInput
							placeholder="Type message here"
							onSend={(message) => handleSend(message)}
						/>
					</ChatContainer>
				</MainContainer>
			</div>
		</div>
	);
}

export default DynamicChatbot;

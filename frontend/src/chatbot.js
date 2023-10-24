import {
	ChatContainer,
	MainContainer,
	Message,
	MessageInput,
	MessageList,
	TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.css";
import axios from "axios";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./chatbot.css";
import "./index.css";

function DynamicChatbot() {
	const [messages, setMessages] = useState([
		{
			message: "Hello, I'm your SQL query assistant!",
			sentTime: "just now",
			sender: "assistant",
		},
	]);

	const [engineeredHistory, setEngineeredHistory] = useState([
		{
			role: "assistant",
			content: "Hello, I'm your SQL query assistant!",
		},
	]);

	const [isTyping, setIsTyping] = useState(false);

	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const handleSend = async (userMessage) => {
		const newUserMessage = {
			message: userMessage,
			sentTime: "just now",
			direction: "outgoing",
			sender: "user",
		};

		const newMessages = [...messages, newUserMessage];
		setMessages(newMessages);
		setIsTyping(true);

		try {
			// console.log('User Message:', userMessage);
			// console.log('Engineered History:', engineeredHistory);

			const response = await axios.post("/api/nlp/PostgreSQL/generate_sql", {
				user_input: userMessage,
				conversation_history: engineeredHistory,
			});

			const chatbotResponse = response.data.sql_query;
			const engineeredInput = response.data.engineered_input;

			const updatedEngineeredHistory = [
				...engineeredHistory,
				{
					role: "user",
					content: engineeredInput,
				},
				{
					role: "assistant",
					content: chatbotResponse,
				},
			];
			setEngineeredHistory(updatedEngineeredHistory);

			const newChatbotMessage = {
				message: chatbotResponse,
				sentTime: "just now",
				direction: "incoming",
				sender: "assistant",
			};

			const updatedMessages = [...newMessages, newChatbotMessage];
			setMessages(updatedMessages);
			setIsTyping(false);
		} catch (error) {
			console.error("Error sending user message:", error);
			setIsTyping(false);
		}
	};

	return (
		<>
			<button type="button" className="ai-button" onClick={toggleSidebar}>
				{isSidebarOpen ? "Close AI" : "Open AI"}
			</button>
			<div className={`App ${isSidebarOpen ? "open" : ""}`}>
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
		</>
	);
}

export default DynamicChatbot;

import { useState } from "react";

export default function Greeting({ messages }) {
	const randomMessage = () =>
		messages[Math.floor(Math.random() * messages.length)];

	const [greeting, setGreeting] = useState(messages[0]);

	return (
		<div className="text-black black:text-white my-4">
			<h3>{greeting}! Thank you for visiting!</h3>
			<button
				onClick={() => setGreeting(randomMessage())}
				className="hover:ring-1 py-2 px-4 border border-slate-600 rounded-md hover:bg-slate-300"
			>
				New Greeting
			</button>
		</div>
	);
}

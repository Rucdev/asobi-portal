import { useState } from "hono/jsx";
import { Button } from "../components/ui/Button";

export default function Counter() {
	const [count, setCount] = useState(0);
	return (
		<div>
			<p class="py-2 text-2xl">{count}</p>
			<Button
				variant="primary"
				size="md"
				onClick={() => setCount(count + 1)}
			>
				Increment
			</Button>
		</div>
	);
}

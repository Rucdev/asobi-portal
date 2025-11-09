import type { ErrorHandler } from "hono";

const handler: ErrorHandler = (e, c) => {
	if ("getResponse" in e) {
		return e.getResponse();
	}
	console.error(e.message);
	c.status(500);
	return c.render(
		<div class="flex items-center justify-center min-h-screen">
			<div class="text-center">
				<h1 class="text-6xl font-bold text-text-dark dark:text-text-light mb-4">500</h1>
				<p class="text-xl text-gray-600 dark:text-gray-400 mb-4">サーバーエラーが発生しました</p>
				<p class="text-sm text-gray-500 dark:text-gray-500 mb-8">申し訳ございませんが、しばらくしてから再度お試しください</p>
				<a href="/" class="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-6 rounded-lg transition-colors">
					ホームに戻る
				</a>
			</div>
		</div>
	);
};

export default handler;

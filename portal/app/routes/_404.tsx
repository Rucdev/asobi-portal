import type { NotFoundHandler } from "hono";

const handler: NotFoundHandler = (c) => {
	c.status(404);
	return c.render(
		<div class="flex items-center justify-center min-h-screen">
			<div class="text-center">
				<h1 class="text-6xl font-bold text-text-dark dark:text-text-light mb-4">404</h1>
				<p class="text-xl text-gray-600 dark:text-gray-400 mb-8">ページが見つかりませんでした</p>
				<a href="/" class="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-6 rounded-lg transition-colors">
					ホームに戻る
				</a>
			</div>
		</div>
	);
};

export default handler;

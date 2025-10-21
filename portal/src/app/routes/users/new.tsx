import { createRoute } from "honox/factory";

export default createRoute((c) => {
	return c.render(
		<div class="max-w-2xl mx-auto py-8 px-4">
			<title>ユーザー登録</title>
			<h1 class="text-3xl font-bold mb-6">ユーザー登録</h1>

			<form
				id="user-form"
				class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
			>
				<div class="mb-4">
					<label
						class="block text-gray-700 text-sm font-bold mb-2"
						for="name"
					>
						名前
					</label>
					<input
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="name"
						type="text"
						name="name"
						placeholder="名前を入力"
						required
					/>
				</div>

				<div class="mb-4">
					<label
						class="block text-gray-700 text-sm font-bold mb-2"
						for="type"
					>
						ユーザータイプ
					</label>
					<select
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="type"
						name="type"
					>
						<option value="player">プレイヤー</option>
						<option value="creator">クリエイター</option>
					</select>
				</div>

				<div class="flex items-center justify-between">
					<button
						class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="submit"
					>
						登録
					</button>
					<a
						href="/users"
						class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
					>
						ユーザー一覧へ
					</a>
				</div>
			</form>

			<div id="message" class="hidden mt-4 p-4 rounded"></div>

			<script
				dangerouslySetInnerHTML={{
					__html: `
						document.getElementById('user-form').addEventListener('submit', async (e) => {
							e.preventDefault();
							const form = e.target;
							const name = form.name.value;
							const type = form.type.value;
							const messageDiv = document.getElementById('message');

							try {
								const response = await fetch('/api/users', {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({ name, type }),
								});

								if (response.ok) {
									messageDiv.className = 'mt-4 p-4 rounded bg-green-100 text-green-700';
									messageDiv.textContent = 'ユーザーを登録しました！';
									messageDiv.classList.remove('hidden');
									form.reset();

									setTimeout(() => {
										window.location.href = '/users';
									}, 1500);
								} else {
									const error = await response.json();
									messageDiv.className = 'mt-4 p-4 rounded bg-red-100 text-red-700';
									messageDiv.textContent = 'エラー: ' + (error.error || error.errors?.join(', ') || '登録に失敗しました');
									messageDiv.classList.remove('hidden');
								}
							} catch (error) {
								messageDiv.className = 'mt-4 p-4 rounded bg-red-100 text-red-700';
								messageDiv.textContent = 'エラー: ' + error.message;
								messageDiv.classList.remove('hidden');
							}
						});
					`,
				}}
			/>
		</div>,
	);
});

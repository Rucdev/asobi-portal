// app/routes/users/[id]/edit.tsx
import { createRoute } from "honox/factory";
import { usersService } from "@/lib/services/users";
import { Header, Footer, BackButton } from "@/app/components";

export default createRoute(async (c) => {
	const id = c.req.param("id");
	const editUser = await usersService.findById(id);
	const currentUser = c.get("user");

	if (!editUser) {
		return c.render(
			<html lang="ja">
				<head>
					<meta charset="UTF-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0"
					/>
					<title>ユーザーが見つかりません - Portal</title>
					<link rel="stylesheet" href="/app/style.css" />
				</head>
				<body class="bg-gray-900 text-white min-h-screen">
					<Header user={currentUser} />
					<main class="container mx-auto px-4 py-8">
						<div class="bg-gray-800 rounded-lg p-12 text-center">
							<h1 class="text-2xl font-bold mb-4">ユーザーが見つかりません</h1>
							<a href="/users" class="text-blue-400 hover:text-blue-300">
								ユーザー一覧に戻る
							</a>
						</div>
					</main>
					<Footer />
				</body>
			</html>,
		);
	}

	return c.render(
		<html lang="ja">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>ユーザー編集 - Portal</title>
				<link rel="stylesheet" href="/app/style.css" />
			</head>
			<body class="bg-gray-900 text-white min-h-screen">
				<Header user={currentUser} />

				<main class="container mx-auto px-4 py-8 max-w-2xl">
					{/* ヘッダーセクション */}
					<div class="mb-8">
						<BackButton href="/users" />
						<h1 class="text-4xl font-bold mb-2">ユーザー編集</h1>
						<p class="text-gray-400">{editUser.name} の情報を編集します</p>
					</div>

					{/* エラーメッセージ表示エリア */}
					<div
						id="error-message"
						class="hidden mb-6 bg-red-900/50 border border-red-600 text-red-200 rounded-lg p-4"
					></div>

					{/* 成功メッセージ表示エリア */}
					<div
						id="success-message"
						class="hidden mb-6 bg-green-900/50 border border-green-600 text-green-200 rounded-lg p-4"
					>
						更新しました
					</div>

					{/* フォーム */}
					<div class="bg-gray-800 rounded-lg p-6">
						<form id="user-form">
							{/* ユーザーID（非表示） */}
							<input type="hidden" id="userId" value={editUser.id} />

							{/* 名前 */}
							<div class="mb-6">
								<label for="name" class="block text-sm font-medium mb-2">
									名前 <span class="text-red-500">*</span>
								</label>
								<input
									id="name"
									name="name"
									type="text"
									required
									maxlength={100}
									value={editUser.name}
									placeholder="山田太郎"
									class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							{/* パスワード変更セクション */}
							<div class="mb-6 p-4 bg-gray-700 rounded-lg">
								<div class="flex items-center mb-3">
									<input type="checkbox" id="change-password" class="mr-2" />
									<label for="change-password" class="text-sm font-medium">
										パスワードを変更する
									</label>
								</div>

								<div id="password-fields" class="hidden">
									{/* パスワード */}
									<div class="mb-4">
										<label
											for="password"
											class="block text-sm font-medium mb-2"
										>
											新しいパスワード
										</label>
										<input
											id="password"
											name="password"
											type="password"
											minlength="8"
											maxlength="100"
											placeholder="8文字以上"
											class="w-full bg-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
										<p class="text-gray-400 text-xs mt-1">
											8文字以上で入力してください
										</p>
									</div>

									{/* パスワード確認 */}
									<div>
										<label
											for="password-confirm"
											class="block text-sm font-medium mb-2"
										>
											パスワード確認
										</label>
										<input
											id="password-confirm"
											name="password-confirm"
											type="password"
											minlength="8"
											maxlength="100"
											placeholder="パスワードを再入力"
											class="w-full bg-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</div>
							</div>

							{/* ユーザータイプ */}
							<div class="mb-6">
								<label for="userType" class="block text-sm font-medium mb-2">
									ユーザータイプ <span class="text-red-500">*</span>
								</label>
								<select
									id="userType"
									name="userType"
									required
									class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="user" selected={editUser.userType === "user"}>
										一般ユーザー
									</option>
									<option
										value="admin"
										selected={editUser.userType === "admin"}
									>
										管理者
									</option>
								</select>
							</div>

							{/* 作成日・更新日 */}
							<div class="mb-6 p-4 bg-gray-700 rounded-lg">
								<div class="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span class="text-gray-400">作成日:</span>
										<span class="ml-2">
											{new Date(editUser.createdAt).toLocaleString("ja-JP")}
										</span>
									</div>
									<div>
										<span class="text-gray-400">更新日:</span>
										<span class="ml-2">
											{new Date(editUser.updatedAt).toLocaleString("ja-JP")}
										</span>
									</div>
								</div>
							</div>

							{/* ボタン */}
							<div class="flex gap-4">
								<button
									type="submit"
									id="submit-button"
									class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
								>
									更新する
								</button>
								<a
									href="/users"
									class="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition"
								>
									キャンセル
								</a>
							</div>
						</form>
					</div>
				</main>

				<Footer />

				{/* パスワード変更チェックボックスの処理 */}
				<script
					dangerouslySetInnerHTML={{
						__html: `
            const changePasswordCheckbox = document.getElementById('change-password');
            const passwordFields = document.getElementById('password-fields');
            const passwordInput = document.getElementById('password');
            const passwordConfirmInput = document.getElementById('password-confirm');

            changePasswordCheckbox.addEventListener('change', (e) => {
              if (e.target.checked) {
                passwordFields.classList.remove('hidden');
                passwordInput.required = true;
                passwordConfirmInput.required = true;
              } else {
                passwordFields.classList.add('hidden');
                passwordInput.required = false;
                passwordConfirmInput.required = false;
                passwordInput.value = '';
                passwordConfirmInput.value = '';
              }
            });

            // フォーム送信処理
            document.getElementById('user-form').addEventListener('submit', async (e) => {
              e.preventDefault();

              const errorDiv = document.getElementById('error-message');
              const successDiv = document.getElementById('success-message');
              const submitButton = document.getElementById('submit-button');

              // パスワード変更時の確認
              if (changePasswordCheckbox.checked) {
                const password = passwordInput.value;
                const passwordConfirm = passwordConfirmInput.value;

                if (password !== passwordConfirm) {
                  errorDiv.textContent = 'パスワードが一致しません';
                  errorDiv.classList.remove('hidden');
                  successDiv.classList.add('hidden');
                  return;
                }
              }

              // フォームデータ取得
              const formData = {
                name: document.getElementById('name').value,
                userType: document.getElementById('userType').value
              };

              // パスワード変更がチェックされている場合のみ追加
              if (changePasswordCheckbox.checked) {
                formData.password = passwordInput.value;
              }

              // 送信ボタンを無効化
              submitButton.disabled = true;
              submitButton.textContent = '更新中...';
              errorDiv.classList.add('hidden');
              successDiv.classList.add('hidden');

              try {
                const userId = document.getElementById('userId').value;
                const response = await fetch(\`/api/users/\${userId}\`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(formData),
                });

                if (response.ok) {
                  successDiv.classList.remove('hidden');
                  submitButton.textContent = '更新する';
                  submitButton.disabled = false;

                  // パスワードフィールドをリセット
                  if (changePasswordCheckbox.checked) {
                    changePasswordCheckbox.checked = false;
                    passwordFields.classList.add('hidden');
                    passwordInput.value = '';
                    passwordConfirmInput.value = '';
                    passwordInput.required = false;
                    passwordConfirmInput.required = false;
                  }
                } else {
                  const error = await response.json();
                  errorDiv.textContent = error.error || 'ユーザー更新に失敗しました';
                  errorDiv.classList.remove('hidden');
                  submitButton.disabled = false;
                  submitButton.textContent = '更新する';
                }
              } catch (error) {
                errorDiv.textContent = 'ネットワークエラーが発生しました';
                errorDiv.classList.remove('hidden');
                submitButton.disabled = false;
                submitButton.textContent = '更新する';
              }
            });
          `,
					}}
				/>
			</body>
		</html>,
	);
});

import { useEffect } from "hono/jsx";

/**
 * User form submission handler island
 * Handles client-side form submission for user registration
 */

const SUCCESS_MESSAGE_CLASS =
	"mt-4 p-4 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200";
const ERROR_MESSAGE_CLASS =
	"mt-4 p-4 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200";

export default function UserFormHandler() {
	useEffect(() => {
		const form = document.getElementById("user-form") as HTMLFormElement;
		const messageDiv = document.getElementById("message") as HTMLDivElement;

		if (!form || !messageDiv) return;

		const showMessage = (className: string, text: string) => {
			messageDiv.className = className;
			messageDiv.textContent = text;
			messageDiv.classList.remove("hidden");
		};

		const handleSubmit = async (e: Event) => {
			e.preventDefault();

			const formData = new FormData(form);
			const name = formData.get("name") as string;
			const type = formData.get("type") as string;

			try {
				const response = await fetch("/api/users", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ name, type }),
				});

				if (response.ok) {
					showMessage(SUCCESS_MESSAGE_CLASS, "ユーザーを登録しました！");
					form.reset();

					setTimeout(() => {
						window.location.href = "/users";
					}, 1500);
				} else {
					const error = await response.json() as { error?: string; errors?: string[] };
					const errorMessage =
						"エラー: " +
						(error.error || error.errors?.join(", ") || "登録に失敗しました");
					showMessage(ERROR_MESSAGE_CLASS, errorMessage);
				}
			} catch (error: any) {
				showMessage(ERROR_MESSAGE_CLASS, "エラー: " + error.message);
			}
		};

		form.addEventListener("submit", handleSubmit);

		return () => {
			form.removeEventListener("submit", handleSubmit);
		};
	}, []);

	return null;
}

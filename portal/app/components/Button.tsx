import type { ReactElement, JSX } from "hono/jsx";

type ButtonVariant = "primary" | "secondary" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
	children: ReactElement | string;
	variant?: ButtonVariant;
	size?: ButtonSize;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	class?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
	primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-xl",
	secondary: "bg-gray-700 hover:bg-gray-600 text-white",
	accent: "bg-blue-600 hover:bg-blue-700 text-white shadow-md",
};

const sizeClasses: Record<ButtonSize, string> = {
	sm: "text-sm font-semibold py-1.5 px-4 rounded-full",
	md: "font-semibold py-3 px-8 rounded-xl",
	lg: "font-bold py-3 px-6 rounded-lg",
};

export default function Button({
	children,
	variant = "primary",
	size = "md",
	onClick,
	type = "button",
	class: className = "",
}: ButtonProps) {
	const baseClasses = "transition duration-200 transform hover:scale-105";
	const classes =
		`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

	return (
		<button type={type} onClick={onClick} class={classes}>
			{children}
		</button>
	);
}

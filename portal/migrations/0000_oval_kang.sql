CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`user_type` text DEFAULT 'user' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `game_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`tag_value` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_game_tags_game_id` ON `game_tags` (`game_id`);--> statement-breakpoint
CREATE INDEX `idx_game_tags_tag_value` ON `game_tags` (`tag_value`);--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_game_tag` ON `game_tags` (`game_id`,`tag_value`);--> statement-breakpoint
CREATE TABLE `game_thumbnails` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`image_type` text NOT NULL,
	`icon_url` text NOT NULL,
	`detail_url` text,
	`alt_text` text DEFAULT '' NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_game_thumbnails_game_id` ON `game_thumbnails` (`game_id`);--> statement-breakpoint
CREATE INDEX `idx_game_thumbnails_order` ON `game_thumbnails` (`game_id`,`display_order`);--> statement-breakpoint
CREATE INDEX `idx_game_thumbnails_type` ON `game_thumbnails` (`game_id`,`image_type`);--> statement-breakpoint
CREATE TABLE `games` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`url` text NOT NULL,
	`creator_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_games_creator_id` ON `games` (`creator_id`);--> statement-breakpoint
CREATE INDEX `idx_games_title` ON `games` (`title`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

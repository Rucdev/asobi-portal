import { createRoute } from 'honox/factory';
import { url } from 'zod';

export default createRoute(async (c) => {
  const id = c.req.param('id');
  const baseUrl = c.req.url.split('/games')[0];
  const response = await fetch(`${baseUrl}/api/games/${id}`);

  if (!response.ok) {
    return c.notFound();
  }

  // ダミーのゲームデータ型定義
  const game= {
    url: "https://example.com/game-play",
    averageRating: 4.2,
    creatorId: "creator_123",
    reviewCount: 5,
    tags: ["adventure", "multiplayer"],
    title: "Sample Game Title",
    response: [],
    reviews: [
      {
        id: "review_1",
        rating: 5,
        content: "Great game!",
        userId: "user_1",
        createdAt: "2024-01-01T12:00:00Z",
      },
      {
        id: "review_2",
        rating: 4,
        content: "Enjoyed playing it.",
        userId: "user_2",
        createdAt: "2024-01-02T15:30:00Z",
      },
    ],
  }

  return c.render(
    <div class="max-w-4xl mx-auto py-8 px-4">
      <h1 class="text-3xl font-bold text-text-dark dark:text-text-light mb-4">{game.title}</h1>
      <p class="mb-4">
        <a
          href={game.url}
          target="_blank"
          rel="noopener noreferrer"
          class="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary/80 transition-colors inline-block"
        >
          Play Game
        </a>
      </p>
      <div class="bg-white dark:bg-card-dark rounded-lg p-6 mb-6">
        <p class="text-gray-600 dark:text-gray-400 mb-2">Tags: {game.tags.join(', ')}</p>
        <p class="text-gray-600 dark:text-gray-400 mb-2">Created by: {game.creatorId}</p>
        <p class="text-gray-600 dark:text-gray-400">
          Average Rating: {game.averageRating ? game.averageRating.toFixed(1) : 'No ratings yet'}
          ({game.reviewCount} {game.reviewCount === 1 ? 'review' : 'reviews'})
        </p>
      </div>

      <h2 class="text-2xl font-bold text-text-dark dark:text-text-light mb-4">Reviews</h2>
      {game.reviews.length === 0 ? (
        <p class="text-gray-600 dark:text-gray-400 bg-white dark:bg-card-dark rounded-lg p-6">No reviews yet.</p>
      ) : (
        <ul class="space-y-4">
          {game.reviews.map((review) => (
            <li key={review.id} class="bg-white dark:bg-card-dark rounded-lg p-6">
              <p class="font-bold text-text-dark dark:text-text-light mb-2">Rating: {review.rating}/5</p>
              <p class="text-gray-700 dark:text-gray-300 mb-2">{review.content}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">By: {review.userId}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Posted: {new Date(review.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}

      <p class="mt-6">
        <a href="/games" class="text-primary hover:underline font-semibold">Back to Games</a>
      </p>
    </div>
  );
});

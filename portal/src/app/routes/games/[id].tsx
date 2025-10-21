import { createRoute } from 'honox/factory';
import type { GameDto } from '../../../../application/game/queries/dto/GameDto';

export default createRoute(async (c) => {
  const id = c.req.param('id');
  const baseUrl = c.req.url.split('/games')[0];
  const response = await fetch(`${baseUrl}/api/games/${id}`);

  if (!response.ok) {
    return c.notFound();
  }

  const game: GameDto = await response.json();

  return c.render(
    <div>
      <h1>{game.title}</h1>
      <p>
        <a href={game.url} target="_blank" rel="noopener noreferrer">
          Play Game
        </a>
      </p>
      <p>Tags: {game.tags.join(', ')}</p>
      <p>Created by: {game.creatorId}</p>
      <p>
        Average Rating: {game.averageRating ? game.averageRating.toFixed(1) : 'No ratings yet'}
        ({game.reviewCount} {game.reviewCount === 1 ? 'review' : 'reviews'})
      </p>

      <h2>Reviews</h2>
      {game.reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {game.reviews.map((review) => (
            <li key={review.id}>
              <p>Rating: {review.rating}/5</p>
              <p>{review.content}</p>
              <p>By: {review.userId}</p>
              <p>Posted: {new Date(review.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}

      <p>
        <a href="/games">Back to Games</a>
      </p>
    </div>
  );
});

import { createRoute } from 'honox/factory';
import { GameDto } from '../../../application/game/queries/dto/GameDto';

export default createRoute(async (c) => {
  const response = await fetch(`${c.req.url.split('/games')[0]}/api/games`);
  const games: GameDto[] = await response.json();

  return c.render(
    <div>
      <h1>Games</h1>
      <a href="/games/new">Publish New Game</a>
      <div>
        {games.length === 0 ? (
          <p>No games found.</p>
        ) : (
          <ul>
            {games.map((game) => (
              <li key={game.id}>
                <h2>
                  <a href={`/games/${game.id}`}>{game.title}</a>
                </h2>
                <p>URL: <a href={game.url} target="_blank" rel="noopener noreferrer">{game.url}</a></p>
                <p>Tags: {game.tags.join(', ')}</p>
                <p>
                  Average Rating: {game.averageRating ? game.averageRating.toFixed(1) : 'No ratings yet'}
                  ({game.reviewCount} {game.reviewCount === 1 ? 'review' : 'reviews'})
                </p>
                <p>Created by: {game.creatorId}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

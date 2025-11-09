import { createRoute } from 'honox/factory';
import { Header, Footer, Card, EmptyState } from '../../components/ui';

type UserInfo = {
  userId: number;
  userName: string;
  userType: string;
} | null;

export default createRoute(async (c) => {
  // Fetch games
  const gamesResponse = await fetch(`${c.req.url.split('/games')[0]}/api/games`);

  const games = [{
    id: "game_1",
    title: "Adventure Quest",
    imageUrl: "https://example.com/images/adventure_quest.jpg",
    tags: ["adventure", "singleplayer"],
    averageRating: 4.5,
    reviewCount: 10,
    url: "https://example.com/games/adventure_quest/play",
  }
  ]

  // Fetch current user (optional)
  let userInfo: UserInfo = null;
  try {
    const userResponse = await fetch(`${c.req.url.split('/games')[0]}/api/auth/me`, {
      headers: {
        cookie: c.req.header('cookie') || '',
      },
    });
    if (userResponse.ok) {
      userInfo = await userResponse.json();
    }
  } catch (error) {
    // User not logged in, continue without user info
  }

  return c.render(
    <html class="dark" lang="en">
      <head>
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Game Portal - My Library</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <link href="/app/style.css" rel="stylesheet" />
      </head>

      <body class="bg-background-light dark:bg-background-dark font-display text-text-dark dark:text-text-light">
        <div class="relative flex h-auto min-h-screen w-full flex-col">
          <div class="layout-container flex h-full grow flex-col">
            <Header
              userInfo={userInfo}
              navLinks={[
                { href: '/', label: 'Home' },
                { href: '/games', label: 'All Games', active: true },
                { href: '/games', label: 'My Library' },
              ]}
            />

            <main class="px-6 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
              <div class="layout-content-container flex flex-col max-w-[1280px] flex-1">
                <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
                  <h1 class="text-4xl font-black leading-tight tracking-[-0.033em]">My Game Library</h1>
                  <a
                    href="/games/new"
                    class="flex items-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    <span class="material-symbols-outlined text-sm">add</span>
                    Publish New Game
                  </a>
                </div>

                {games.length === 0 ? (
                  <EmptyState
                    icon="videogame_asset_off"
                    title="Your library is empty."
                    description="Discover new games and add your favorites!"
                    actionLabel="Publish Your First Game"
                    actionHref="/games/new"
                  />
                ) : (
                  <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
                    {games.map((game) => (
                      <Card
                        key={game.id}
                        title={game.title}
                        imageUrl={game.imageUrl}
                        tags={game.tags}
                        rating={game.averageRating}
                        reviewCount={game.reviewCount}
                        actionLabel="PLAY"
                        actionHref={game.url}
                      />
                    ))}
                  </div>
                )}
              </div>
            </main>

            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
});

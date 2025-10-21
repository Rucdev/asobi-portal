import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../../../../infrastructure/persistence/database";
import { DrizzleRecommendationRepository } from "../../../../infrastructure/persistence/drizzle/repositories/DrizzleRecommendationRepository";
import { GetRecommendationsQueryHandler } from "../../../../application/recommendation/queries/GetRecommendationsQueryHandler";
import { GetRecommendationsQuery } from "../../../../application/recommendation/queries/GetRecommendationsQuery";

const app = new Hono();

// Query parameter schema
const getRecommendationsSchema = z.object({
  userId: z.string().regex(/^\d+$/).transform(Number),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

/**
 * GET /api/recommendations
 * ユーザーのレコメンデーション一覧を取得
 */
app.get("/", zValidator("query", getRecommendationsSchema), async (c) => {
  const { userId, limit } = c.req.valid("query");

  const recommendationRepository = new DrizzleRecommendationRepository(db);
  const queryHandler = new GetRecommendationsQueryHandler(
    recommendationRepository
  );

  const query = new GetRecommendationsQuery(userId, limit);
  const recommendations = await queryHandler.handle(query);

  return c.json({
    recommendations,
  });
});

export default app;

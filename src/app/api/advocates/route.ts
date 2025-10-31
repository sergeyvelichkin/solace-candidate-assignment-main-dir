import { and, asc, gt, ilike, or, sql } from "drizzle-orm";

import db from "../../../db";
import { advocates } from "../../../db/schema";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

type QueryConfig = {
    searchTerm?: string;
    limit: number;
    cursor?: number;
};

const parseQuery = (request: Request): QueryConfig => {
    const { searchParams } = new URL(request.url);
    const rawLimit = Number.parseInt(searchParams.get("limit") ?? "", 10);
    const limit = Number.isNaN(rawLimit)
        ? DEFAULT_LIMIT
        : Math.min(Math.max(rawLimit, 1), MAX_LIMIT);

    const rawCursor = Number.parseInt(searchParams.get("cursor") ?? "", 10);
    const cursor = Number.isNaN(rawCursor) ? undefined : rawCursor;

    const searchTerm = searchParams.get("searchTerm")?.trim() || undefined;

    return { searchTerm, limit, cursor };
};

export async function GET(request: Request) {
    const { searchTerm, limit, cursor } = parseQuery(request);

    const searchFilter = searchTerm
        ? or(
              ilike(advocates.firstName, `%${searchTerm}%`),
              ilike(advocates.lastName, `%${searchTerm}%`),
              ilike(advocates.city, `%${searchTerm}%`),
              ilike(advocates.degree, `%${searchTerm}%`)
          )
        : undefined;

    const cursorFilter = typeof cursor === "number" ? gt(advocates.id, cursor) : undefined;

    const filters = [searchFilter, cursorFilter].filter(
        (clause): clause is NonNullable<typeof clause> => Boolean(clause)
    );

    const whereClause =
        filters.length === 0
            ? undefined
            : filters.length === 1
              ? filters[0]
              : and(...filters);

    const baseQuery = db.select().from(advocates);
    const filteredQuery = whereClause ? baseQuery.where(whereClause) : baseQuery;

    const rows = await filteredQuery.orderBy(asc(advocates.id)).limit(limit + 1);

    const hasMore = rows.length > limit;
    const data = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? data[data.length - 1]?.id ?? null : null;

    const totalQuery = db
        .select({ count: sql<number>`count(*)` })
        .from(advocates)
        .where(searchFilter ?? sql`TRUE`);

    const [{ count }] = await totalQuery;
    const total = typeof count === "number" ? count : Number(count ?? 0);

    return Response.json({
        data,
        total,
        nextCursor,
        hasMore,
    });
}

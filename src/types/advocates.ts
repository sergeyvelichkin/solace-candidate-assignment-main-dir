import { Advocate } from "@/db/schema";

export type GetAdvocatesQuery = {
    searchTerm?: string;
    limit?: number;
    cursor?: number;
};

export type GetAdvocatesResponse = {
    data: Advocate[];
    total: number;
    nextCursor: number | null;
    hasMore: boolean;
};

export type { Advocate }

import { Advocate, GetAdvocatesResponse } from "@/types";
import { useCallback, useEffect, useState } from "react";

type UseGetAdvocatesOptions = {
    searchTerm?: string;
    limit?: number;
};

export const useGetAdvocates = (options: UseGetAdvocatesOptions = {}) => {
    const { searchTerm, limit } = options;
    const [advocates, setAdvocates] = useState<Advocate[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchPage = useCallback(
        async (cursor?: number, append = false) => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();

                if (searchTerm) {
                    params.set("searchTerm", searchTerm);
                }

                if (typeof limit === "number") {
                    params.set("limit", String(limit));
                }

                if (typeof cursor === "number") {
                    params.set("cursor", String(cursor));
                }

                const queryString = params.toString();
                const response = await fetch(`/api/advocates${queryString ? `?${queryString}` : ""}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch advocates: ${response.statusText}`);
                }

                const payload: GetAdvocatesResponse = await response.json();

                setAdvocates((prev) => (append ? [...prev, ...payload.data] : payload.data));
                setTotal(payload.total);
                setNextCursor(payload.nextCursor);
                setHasMore(payload.hasMore);
            } catch (fetchError) {
                setError(fetchError as Error);
            } finally {
                setLoading(false);
            }
        },
        [searchTerm, limit]
    );

    useEffect(() => {
        setAdvocates([]);
        setTotal(0);
        setNextCursor(null);
        setHasMore(false);
        fetchPage();
    }, [fetchPage]);

    const loadMore = useCallback(() => {
        if (!hasMore || loading) {
            return;
        }

        return fetchPage(nextCursor ?? undefined, true);
    }, [fetchPage, hasMore, loading, nextCursor]);

    const refresh = useCallback(() => fetchPage(undefined, false), [fetchPage]);

    return { advocates, total, nextCursor, hasMore, loading, error, loadMore, refresh };
};

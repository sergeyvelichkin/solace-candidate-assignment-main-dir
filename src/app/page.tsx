"use client";

import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { useDebounce, useGetAdvocates } from "./hooks";
import type { Advocate } from "@/types";
import { InfiniteScroll, Skeleton, Table, type TableColumn } from "./components";

const PAGE_SIZE = 10;

export default function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const { advocates, loading, error, hasMore, loadMore, total } = useGetAdvocates({
        searchTerm: debouncedSearchTerm,
        limit: PAGE_SIZE,
    });

    const columns = useMemo<TableColumn<Advocate>[]>(() => {
        return [
            { key: "firstName", header: "First Name" },
            { key: "lastName", header: "Last Name" },
            { key: "city", header: "City" },
            { key: "degree", header: "Degree" },
            {
                key: "specialties",
                header: "Specialties",
                render: (row) => (
                    <div className="flex flex-wrap gap-1">
                        {row.specialties.map((specialty) => (
                            <span key={specialty} className="bg-gray-200 rounded px-2 py-1 text-sm">
                                {specialty}
                            </span>
                        ))}
                    </div>
                ),
            },
            { key: "yearsOfExperience", header: "Years of Experience" },
            { key: "phoneNumber", header: "Phone Number" },
        ];
    }, []);

    const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const onResetSearch = () => {
        setSearchTerm("");
    };

    const isInitialLoading = loading && advocates.length === 0;

    return (
        <main className="p-4 space-y-4 w-full">
            <header className="space-y-2">
                <h1 className="text-2xl font-semibold">Solace Advocates</h1>
                <div className="space-y-2">
                    <label className="flex flex-col gap-2">
                        <span className="font-medium">Search</span>
                        <input
                            className="border-2 border-black px-3 py-2 rounded"
                            onChange={onSearchChange}
                            value={searchTerm}
                            placeholder="Search advocates..."
                        />
                    </label>
                    {searchTerm && (
                        <div>
                            Searching for: <span className="font-semibold">{searchTerm}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onResetSearch}
                            className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 transition"
                        >
                            Reset Search
                        </button>
                        <span className="text-sm text-gray-600">Total results: {total}</span>
                    </div>
                </div>
            </header>

            {error && <div className="text-red-500">Error: {error.message}</div>}

            {isInitialLoading ? (
                <Skeleton />
            ) : (
                <Table
                    columns={columns}
                    data={advocates}
                    getRowKey={(row) => row.id}
                    emptyState={<div className="text-gray-500">No advocates found.</div>}
                />
            )}

            {loading && advocates.length > 0 && <Skeleton />}

            {hasMore && <InfiniteScroll onLoadMore={loadMore} disabled={loading} />}
        </main>
    );
}

"use client";

import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { useDebounce, useGetAdvocates } from "./hooks";
import type { Advocate } from "@/types";
import { InfiniteScroll, Input, Skeleton, Table, type TableColumn } from "./components";

export default function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const { advocates, loading, error, hasMore, loadMore, total } = useGetAdvocates({
        searchTerm: debouncedSearchTerm,
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
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-center">Solace Advocates</h1>
                <div className="space-y-2">
                    <Input
                        label="Search"
                        onChange={onSearchChange}
                        value={searchTerm}
                        placeholder="Search advocates..."
                        type="search"
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Total results: {total}</span>
                    </div>
                </div>
            </div>

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

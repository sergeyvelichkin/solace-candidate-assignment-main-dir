"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";
import { useDebounce, useGetAdvocates } from "./hooks";
import { Skeleton } from "./components/Skeleton/Skeleton";

export default function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const { advocates, loading, error } = useGetAdvocates({ searchTerm: debouncedSearchTerm });

    const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
    };

    const onClick = () => {
        setSearchTerm("");
    };

    return (
        <main style={{ margin: "24px" }}>
            <h1>Solace Advocates</h1>
            <br />
            <br />
            <div>
                <p>Search</p>
                <p>
                    Searching for: <span id="search-term">{searchTerm}</span>
                </p>
                <input
                    className="border-2 border-black"
                    onChange={onSearchChange}
                    value={searchTerm}
                    placeholder="Search advocates..."
                />
                <button onClick={onClick}>Reset Search</button>
            </div>
            <br />
            <br />
            {loading && <Skeleton />}
            {!loading && advocates !== null && <table>
                <thead>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>City</th>
                    <th>Degree</th>
                    <th>Specialties</th>
                    <th>Years of Experience</th>
                    <th>Phone Number</th>
                </thead>
                <tbody>
                    {advocates.map((advocate) => {
                        return (
                            <tr key={advocate.id}>
                                <td>{advocate.firstName}</td>
                                <td>{advocate.lastName}</td>
                                <td>{advocate.city}</td>
                                <td>{advocate.degree}</td>
                                <td>
                                    {advocate.specialties.map((s) => (
                                        <div key={s}>{s}</div>
                                    ))}
                                </td>
                                <td>{advocate.yearsOfExperience}</td>
                                <td>{advocate.phoneNumber}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>}
        </main>
    );
}

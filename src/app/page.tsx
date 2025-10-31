"use client";

import { useEffect, useState } from "react";
import { useGetAdvocates } from "./hooks/useGetAdvocates";

export default function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const { advocates, loading, error } = useGetAdvocates();


    //   const onChange = (e) => {
    //     const searchTerm = e.target.value;

    //     document.getElementById("search-term").innerHTML = searchTerm;

    //     console.log("filtering advocates...");
    //     const filteredAdvocates = advocates.filter((advocate) => {
    //       return (
    //         advocate.firstName.includes(searchTerm) ||
    //         advocate.lastName.includes(searchTerm) ||
    //         advocate.city.includes(searchTerm) ||
    //         advocate.degree.includes(searchTerm) ||
    //         advocate.specialties.includes(searchTerm) ||
    //         advocate.yearsOfExperience.includes(searchTerm)
    //       );
    //     });

    //     setFilteredAdvocates(filteredAdvocates);
    //   };

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
    }

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
                    Searching for: <span id="search-term"></span>
                </p>
                <input className="border-2 border-black" onChange={onSearchChange} />
                <button onClick={onClick}>Reset Search</button>
            </div>
            <br />
            <br />
            <table>
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
                    {advocates?.map((advocate) => {
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
            </table>
        </main>
    );
}

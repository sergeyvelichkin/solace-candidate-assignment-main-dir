import { GetAdvocatesResponse } from "@/types";
import { useEffect, useState } from "react";

export const useGetAdvocates = () => {
    const [advocates, setAdvocates] = useState<GetAdvocatesResponse["data"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchAdvocates = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/advocates');
                const res: GetAdvocatesResponse = await response.json();
                setAdvocates(res.data);
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdvocates();
    }, []);

    return { advocates, loading, error };
}
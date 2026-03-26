import { useState, useEffect } from "react";
import { searchResources } from "../services/search.service";
import toast from "react-hot-toast";

const useSearch = (query) =>{
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState({
        files: [],
        folders: []
    });

    useEffect(() =>{
        if(!query || query.trim() === "" || query.length < 1){
            setResults({
                files: [],
                folders: []
            });
            return;
        }

        setLoading(true);
        const timer = setTimeout(async () => {
            try {
                const data = await searchResources(query);
                setResults(data);
            } catch (error) {
                console.error("Error loading search results", error);
                toast.error("Could not load Search Results");
                setResults({
                    files: [],
                    folders: []
                });
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);
    return { results, loading };
}

export default useSearch;
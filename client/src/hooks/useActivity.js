import { useState, useEffect } from "react"
import { getActivities } from "../services/activity.service";
import toast from "react-hot-toast";

const useActivity = () =>{
    const [activities, setActivities] = useState([]);
    const fetchActivities = async () =>{
        try {
            const data = await getActivities();
            setActivities(data || []);
        } catch (error) {
            console.error("Error loading activities", error);
            toast.error("Could not load Activities")
        }
    };

    useEffect(() =>{
        fetchActivities();
    }, []);

    return {
        activities,
        refresh: fetchActivities
    };
};

export default useActivity;
import { useState, useEffect } from "react"

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/me`, {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error("Unable to fetch the user");
            }
            setUser(data.user);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return { user, loading, error, reFetch: fetchUser };
};

export default useAuth;
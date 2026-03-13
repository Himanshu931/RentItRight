import { useEffect } from "react";
import useAuth from "./authHook";
import { useNavigate } from "react-router-dom";

const homeRedirect=()=>{
    const {user,loading}=useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        // Wait for auth to finish loading and ensure user exists
        if (!loading && user) {
            if (user.role === "owner") {
                navigate("/owner", { replace: true });
            } else if (user.role === "renter") {
                navigate("/renter", { replace: true });
            }
            else{
                navigate("/", { replace: true });
            }
        }
    }, [user, loading, navigate]);
}
export default homeRedirect;
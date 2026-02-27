import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/authHook";

export default function RoleRedirect() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // useEffect(() => {
    //     if (loading)
    //         if (!user) return;

    //     if (location.pathname.startsWith("/owner") || location.pathname.startsWith("/renter")) {
    //         return;
    //     }

    //     if (user.role === "user") {
    //         navigate("/renter", { replace: true });
    //     }

    //     if (user.role === "admin") {
    //         navigate("/owner", { replace: true });
    //     }
    // }, [user, loading]);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            navigate("/", { replace: true });
            return;
        }

        const roleValue = user.role ?? user.roles ?? [];
        const roles = Array.isArray(roleValue) ? roleValue : [roleValue];

        if (roles.includes("owner") || roles.includes("admin")) {
            navigate("/owner", { replace: true });
            return;
        }

        navigate("/renter", { replace: true });
    }, [loading, user, navigate]);


    return <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Redirecting...</span>
        </div>
    </div>;
}

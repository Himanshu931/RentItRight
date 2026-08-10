import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/authHook";

/**
 * ProtectedRoute
 * @param {string} requiredRole - The role required to access this set of routes ("admin", "owner", "renter")
 *
 * Behaviour:
 *  - Still loading  → show spinner (avoids flash-redirect on fresh page load)
 *  - Not logged in  → redirect to guest home "/"
 *  - Wrong role     → redirect to the user's own dashboard
 *  - Correct role   → render <Outlet />
 */

const ROLE_DASHBOARDS = {
    admin: "/admin",
    owner: "/owner",
    renter: "/renter",
};

export default function ProtectedRoute({ requiredRole }) {
    const { user, loading } = useAuth();

    // Still resolving auth state – show a subtle spinner to avoid flash redirects
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    // Not authenticated → go to guest home
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Normalise roles to an array (handles both `role` and `roles` field names)
    const roleValue = user.role ?? user.roles ?? [];
    const roles = Array.isArray(roleValue) ? roleValue : [roleValue];

    // User has the required role → allow access
    if (roles.includes(requiredRole)) {
        return <Outlet />;
    }

    // User is authenticated but has a different role → redirect to their dashboard
    for (const role of ["admin", "owner", "renter"]) {
        if (roles.includes(role)) {
            return <Navigate to={ROLE_DASHBOARDS[role]} replace />;
        }
    }

    // Fallback: unknown role → guest home
    return <Navigate to="/" replace />;
}

import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

interface ProtectedRouteProps  {
    children: React.ReactNode;
    allowedRole: "TRADER" | "ORG";
}

interface DecodedToken {
    id: string;
    role: "TRADER" | "ORG";
}





export default function ProtectedRoute({
    children,
    allowedRole
}: ProtectedRouteProps) {
    const token = localStorage.getItem('token');

    if(!token) {
        return <Navigate to='/login' replace/>;
    }

    try {

        const decodedToken = jwtDecode<DecodedToken>(token);

        if(allowedRole && (allowedRole !== decodedToken.role)) {
            localStorage.removeItem("token");
            return <Navigate to="/login" replace />
        }

    } catch(err) {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />
    }


    return <>{children}</>
}
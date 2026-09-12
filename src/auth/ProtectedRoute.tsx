import { Navigate } from "react-router-dom";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { PageLoader } from "@/components/common/PageLoader";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('access_token');

    const { isLoading, isError } = useUser();

    useEffect(() => {
        if (isError) {
            toast.error('Server is busy, please try again later');
        }
    }, [isError]);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (isLoading) {
        return (
            <PageLoader label="Loading..." />
        );
    }

    if (isError) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
                <p className="text-destructive font-medium mb-4">Cannot connect to the server.</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90">
                    Retry
                </button>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
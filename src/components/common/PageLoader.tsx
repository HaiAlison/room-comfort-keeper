import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PageLoaderProps {
    label?: string;
}

export function PageLoader({ label = "Loading..." }: PageLoaderProps) {
    return (
        <Card>
            <CardContent className="py-16 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{label}</p>
            </CardContent>
        </Card>
    );
}

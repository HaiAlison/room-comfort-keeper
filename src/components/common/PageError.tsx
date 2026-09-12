import { AlertCircle, RefreshCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PageErrorProps {
    message?: string;
    onRetry?: () => void;
}

export function PageError({
    message = "Something went wrong while loading data.",
    onRetry,
}: PageErrorProps) {
    return (
        <Card>
            <CardContent className="py-16 text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-3 text-destructive" />
                <h3 className="text-sm font-medium text-foreground mb-1">
                    Failed to load
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{message}</p>
                {onRetry && (
                    <Button variant="outline" size="sm" onClick={onRetry}>
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Try again
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

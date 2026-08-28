import { Skeleton } from "../ui/skeleton";


interface ListLoaderProps {
    label?: string;
    numberRow?: number
}

export function ListLoader({ label = "Loading...", numberRow = 3 }: ListLoaderProps) {
    return (
        <div className="space-y-2">
            {Array.from({ length: numberRow }).map((_, index) => (
                <Skeleton key={index} className="w-full h-8" />
            ))}
        </div>
    );
}

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    label?: string;
}

export function LoadingSpinner({ className, size = "md", label }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-5 h-5",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    };

    const ringSize = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-20 h-20",
    };

    return (
        <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
            <div className="relative">
                {/* Pulsing ring */}
                <div
                    className={cn(
                        "absolute inset-0 rounded-full bg-rose-500/20 animate-pulse-ring",
                        ringSize[size]
                    )}
                    style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                />

                {/* Main spinner */}
                <svg
                    className={cn("animate-spin-slow text-rose-500", sizeClasses[size])}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-20"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                    <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            </div>

            {label && (
                <span className="text-sm text-muted-foreground font-medium animate-fade-in">
                    {label}
                </span>
            )}
        </div>
    );
}

// Full page loading overlay
export function LoadingOverlay({ label = "Loading..." }: { label?: string }) {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-card rounded-2xl p-8">
                <LoadingSpinner size="lg" label={label} />
            </div>
        </div>
    );
}

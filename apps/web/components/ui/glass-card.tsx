import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
    blur?: "sm" | "md" | "lg";
}

export function GlassCard({
    children,
    className,
    hoverEffect = true,
    blur = "md",
    ...props
}: GlassCardProps) {
    const blurClasses = {
        sm: "backdrop-blur-sm",
        md: "backdrop-blur-md",
        lg: "backdrop-blur-xl",
    };

    return (
        <div
            className={cn(
                "rounded-2xl p-6 transition-all duration-300",
                "bg-white/70 border border-white/40 shadow-lg",
                blurClasses[blur],
                hoverEffect && "hover:-translate-y-1 hover:shadow-xl hover:bg-white/80",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

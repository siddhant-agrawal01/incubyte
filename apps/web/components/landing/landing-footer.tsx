import { Sparkles } from "lucide-react";

export function LandingFooter() {
    return (
        <footer className="relative py-12 px-4 border-t border-border/50">
            <div className="max-w-6xl mx-auto text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-foreground">Sweet Shop</span>
                </div>
                <p className="text-sm text-muted-foreground">
                    © 2025 Sweet Shop. Crafted with love for confectioneries worldwide.
                </p>
            </div>
        </footer>
    );
}

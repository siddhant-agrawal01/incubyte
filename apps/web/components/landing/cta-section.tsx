import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
    return (
        <section className="relative py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="glass-card rounded-3xl p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                        Ready to <span className="italic text-rose-500">Sweeten</span> Your Business?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Join hundreds of sweet shop owners who've already transformed their operations.
                    </p>
                    <Link href="/register">
                        <Button size="lg" className="text-base px-10 py-6 rounded-xl shadow-lg shadow-rose-500/25">
                            Get Started Free
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

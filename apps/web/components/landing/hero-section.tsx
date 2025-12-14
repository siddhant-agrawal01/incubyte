import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

interface HeroSectionProps {
    mounted: boolean;
}

export function HeroSection({ mounted }: HeroSectionProps) {
    return (
        <section className="relative pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className={`text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mb-8">
                        <Sparkles className="w-4 h-4 text-rose-500" />
                        <span className="text-sm font-medium text-rose-600">Premium Sweet Shop Management</span>
                    </div>

                    {/* Main Heading - Stylish Playfair Display */}
                    <h1 className="text-5xl md:text-7xl mb-6 leading-tight">
                        <span className="font-serif font-bold text-foreground">Manage Your</span>
                        <br />
                        <span className="font-serif italic text-rose-500 font-bold">
                            Sweet
                        </span>
                        <br />
                        <span className="font-serif font-bold text-foreground">Effortlessly</span>
                    </h1>

                    {/* Subtitle - Recruiter focused */}
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Crafted by <span className="text-rose-500 font-semibold">Siddhant </span>
                        where every line of code tells a story of excellence.
                        <br />
                        <span className="font-serif italic text-foreground/80">Hire the developer, not just the code.</span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link href="/register">
                            <Button size="lg" className="text-base px-8 py-6 rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 transition-all">
                                Start Free Trial
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg" className="text-base px-8 py-6 rounded-xl">
                                Sign In to Dashboard
                            </Button>
                        </Link>
                    </div>


                </div>
            </div>
        </section>
    );
}

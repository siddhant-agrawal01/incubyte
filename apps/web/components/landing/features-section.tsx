"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Package, Search, Edit, Shield, Zap } from "lucide-react";

interface FeatureNotification {
    icon: React.ElementType;
    title: string;
    description: string;
    time: string;
}

function NotificationCard({
    icon: Icon,
    title,
    description,
    time,
    isVisible,
    position
}: FeatureNotification & { isVisible: boolean; position: number }) {
    return (
        <div
            className={`
                glass-card rounded-2xl p-4 flex items-start gap-4 
                transition-all duration-700 ease-out
                ${isVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                }
            `}
            style={{
                transitionDelay: `${position * 150}ms`,
            }}
        >
            <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-500/30">
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{title}</h3>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{time}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

export function FeaturesSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);

    const features: FeatureNotification[] = [
        {
            icon: ShoppingCart,
            title: "Purchase Sweets",
            description: "Quick and easy purchasing with real-time stock updates and instant confirmation.",
            time: "Just now",
        },
        {
            icon: Package,
            title: "Restock Inventory",
            description: "One-click restocking with smart quantity suggestions based on sales patterns.",
            time: "2m ago",
        },
        {
            icon: Edit,
            title: "Update Products",
            description: "Edit sweet details, pricing, and images with live preview changes.",
            time: "5m ago",
        },
        {
            icon: Search,
            title: "Smart Search",
            description: "Find any sweet instantly with powerful filters by category, price, and availability.",
            time: "8m ago",
        },
        {
            icon: Shield,
            title: "Secure Admin Panel",
            description: "Role-based access control with admin-only features for complete management.",
            time: "15m ago",
        },
        {
            icon: Zap,
            title: "Real-time Updates",
            description: "Instant stock synchronization across all devices and sessions.",
            time: "20m ago",
        },
    ];

    const cardsPerView = 2;
    const totalGroups = Math.ceil(features.length / cardsPerView);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(false);

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % totalGroups);
                setIsAnimating(true);
            }, 300);
        }, 3500);

        return () => clearInterval(interval);
    }, [totalGroups]);

    const visibleFeatures = features.slice(
        currentIndex * cardsPerView,
        currentIndex * cardsPerView + cardsPerView
    );

    return (
        <section className="relative py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                        Powerful <span className="italic text-rose-500">Features</span>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Everything you need to manage your sweet shop, designed for speed and simplicity.
                    </p>
                </div>

                {/* Animated notification cards carousel */}
                <div className="max-w-xl mx-auto">
                    <div className="space-y-3 min-h-[200px]">
                        {visibleFeatures.map((feature, index) => (
                            <NotificationCard
                                key={`${currentIndex}-${feature.title}`}
                                {...feature}
                                isVisible={isAnimating}
                                position={index}
                            />
                        ))}
                    </div>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: totalGroups }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setIsAnimating(false);
                                    setTimeout(() => {
                                        setCurrentIndex(index);
                                        setIsAnimating(true);
                                    }, 200);
                                }}
                                className={`
                                    w-2 h-2 rounded-full transition-all duration-300
                                    ${index === currentIndex
                                        ? 'bg-rose-500 w-6'
                                        : 'bg-rose-500/30 hover:bg-rose-500/50'
                                    }
                                `}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Animated floating shapes component
export function FloatingShapes() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Large rose circle */}
            <div
                className="absolute w-96 h-96 rounded-full bg-rose-500/10 -top-20 -right-20 animate-pulse-ring"
                style={{ animationDuration: "4s" }}
            />

            {/* Medium floating orb */}
            <div
                className="absolute w-64 h-64 rounded-full bg-rose-400/8 top-1/3 -left-32"
                style={{ animation: "float 8s ease-in-out infinite" }}
            />

            {/* Small accent orbs */}
            <div
                className="absolute w-32 h-32 rounded-full bg-rose-300/10 bottom-1/4 right-1/4"
                style={{ animation: "float 6s ease-in-out infinite reverse" }}
            />

            {/* Tiny floating dots */}
            <div
                className="absolute w-4 h-4 rounded-full bg-rose-500/30 top-1/4 left-1/4"
                style={{ animation: "float 3s ease-in-out infinite" }}
            />
            <div
                className="absolute w-3 h-3 rounded-full bg-rose-400/40 top-1/2 right-1/3"
                style={{ animation: "float 4s ease-in-out infinite reverse" }}
            />
            <div
                className="absolute w-2 h-2 rounded-full bg-rose-600/30 bottom-1/3 left-1/3"
                style={{ animation: "float 5s ease-in-out infinite" }}
            />

            {/* Geometric shapes */}
            <div
                className="absolute w-20 h-20 border-2 border-rose-500/20 rotate-45 top-20 left-1/4"
                style={{ animation: "spin-slow 20s linear infinite" }}
            />
            <div
                className="absolute w-16 h-16 border border-rose-400/15 rounded-lg rotate-12 bottom-40 right-1/3"
                style={{ animation: "float 7s ease-in-out infinite" }}
            />
        </div>
    );
}

// Animated candy/sweet icons
export function AnimatedSweets() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Candy icons floating */}
            <div
                className="absolute text-rose-500/40 text-4xl top-32 right-20"
                style={{ animation: "float 5s ease-in-out infinite" }}
            >
                🍬
            </div>
            <div
                className="absolute text-rose-400/30 text-3xl top-48 left-16"
                style={{ animation: "float 6s ease-in-out infinite reverse" }}
            >
                🍭
            </div>
            <div
                className="absolute text-rose-500/35 text-2xl bottom-40 right-32"
                style={{ animation: "float 4s ease-in-out infinite" }}
            >
                🧁
            </div>
            <div
                className="absolute text-rose-400/25 text-4xl bottom-60 left-20"
                style={{ animation: "float 7s ease-in-out infinite reverse" }}
            >
                🍩
            </div>
            <div
                className="absolute text-rose-500/30 text-3xl top-72 right-1/3"
                style={{ animation: "float 5.5s ease-in-out infinite" }}
            >
                🍪
            </div>
        </div>
    );
}

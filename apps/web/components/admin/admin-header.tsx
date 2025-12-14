import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';

interface AdminHeaderProps {
    onBack: () => void;
    onAddSweet: () => void;
}

export function AdminHeader({ onBack, onAddSweet }: AdminHeaderProps) {
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
            <nav className="glass-nav rounded-2xl px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="hover:bg-gray-900/10 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-2xl font-bold text-foreground">
                            Admin Panel
                        </h1>
                    </div>
                    <Button
                        onClick={onAddSweet}
                        className="bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition-all duration-200"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Sweet
                    </Button>
                </div>
            </nav>
        </div>
    );
}

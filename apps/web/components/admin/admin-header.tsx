import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';

interface AdminHeaderProps {
    onBack: () => void;
    onAddSweet: () => void;
}

export function AdminHeader({ onBack, onAddSweet }: AdminHeaderProps) {
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
            <nav className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-2xl shadow-2xl shadow-black/5 px-6 py-4">
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
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                            Admin Panel
                        </h1>
                    </div>
                    <Button
                        onClick={onAddSweet}
                        className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Sweet
                    </Button>
                </div>
            </nav>
        </div>
    );
}

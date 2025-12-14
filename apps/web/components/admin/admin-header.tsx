import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';

interface AdminHeaderProps {
    onBack: () => void;
    onAddSweet: () => void;
}

export function AdminHeader({ onBack, onAddSweet }: AdminHeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" onClick={onBack}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                    </div>
                    <Button onClick={onAddSweet}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Sweet
                    </Button>
                </div>
            </div>
        </header>
    );
}

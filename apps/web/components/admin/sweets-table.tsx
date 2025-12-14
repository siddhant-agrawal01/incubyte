import type { Sweet } from 'shared-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Package, RefreshCw } from 'lucide-react';

interface SweetsTableProps {
    sweets: Sweet[];
    loading: boolean;
    deletingId: string | null;
    onEdit: (sweet: Sweet) => void;
    onDelete: (id: string) => void;
    onRestock: (sweet: Sweet) => void;
}

export function SweetsTable({
    sweets,
    loading,
    deletingId,
    onEdit,
    onDelete,
    onRestock,
}: SweetsTableProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">Loading sweets...</p>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Sweets ({sweets.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-2">Name</th>
                                <th className="text-left py-3 px-2">Category</th>
                                <th className="text-right py-3 px-2">Price</th>
                                <th className="text-right py-3 px-2">Stock</th>
                                <th className="text-right py-3 px-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sweets.map((sweet) => (
                                <tr key={sweet.id} className="border-b">
                                    <td className="py-3 px-2">
                                        <div className="flex items-center gap-2">
                                            {sweet.imageUrl ? (
                                                <img src={sweet.imageUrl} alt="" className="w-8 h-8 rounded object-cover" />
                                            ) : (
                                                <Package className="w-8 h-8 text-gray-300" />
                                            )}
                                            {sweet.name}
                                        </div>
                                    </td>
                                    <td className="py-3 px-2">{sweet.category}</td>
                                    <td className="py-3 px-2 text-right">${sweet.price.toFixed(2)}</td>
                                    <td className={`py-3 px-2 text-right ${sweet.quantity === 0 ? 'text-red-500' : ''}`}>
                                        {sweet.quantity}
                                    </td>
                                    <td className="py-3 px-2">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onRestock(sweet)}
                                                title="Restock"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onEdit(sweet)}
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={deletingId === sweet.id}
                                                onClick={() => onDelete(sweet.id)}
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

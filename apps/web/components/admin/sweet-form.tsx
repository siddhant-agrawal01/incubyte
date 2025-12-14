import { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { CreateSweetFormInput } from 'validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Sweet } from 'shared-types';

interface SweetFormProps {
    editingSweet: Sweet | null;
    register: UseFormRegister<CreateSweetFormInput>;
    errors: FieldErrors<CreateSweetFormInput>;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export function SweetForm({
    editingSweet,
    register,
    errors,
    isSubmitting,
    onSubmit,
    onCancel,
}: SweetFormProps) {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>{editingSweet ? 'Edit Sweet' : 'Add New Sweet'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register('name')} />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" {...register('category')} />
                            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input id="price" type="number" step="0.01" {...register('price')} />
                            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input id="quantity" type="number" {...register('quantity')} />
                            {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" {...register('description')} />
                            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input id="imageUrl" {...register('imageUrl')} placeholder="https://..." />
                            {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl.message}</p>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : editingSweet ? 'Update Sweet' : 'Add Sweet'}
                        </Button>
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

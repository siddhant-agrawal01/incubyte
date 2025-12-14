import { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { RestockFormInput } from 'validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RestockFormProps {
    sweetName: string;
    register: UseFormRegister<RestockFormInput>;
    errors: FieldErrors<RestockFormInput>;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export function RestockForm({
    sweetName,
    register,
    errors,
    isSubmitting,
    onSubmit,
    onCancel,
}: RestockFormProps) {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Restock: {sweetName}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="flex gap-4 items-end">
                    <div className="space-y-2 flex-1">
                        <Label htmlFor="restockQty">Quantity to Add</Label>
                        <Input id="restockQty" type="number" {...register('quantity')} />
                        {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add Stock'}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSweetFormSchema, restockFormSchema, type CreateSweetFormInput, type RestockFormInput } from 'validation';
import type { Sweet } from 'shared-types';
import { apiClient } from '../lib/api';
import { AdminHeader, SweetForm, RestockForm, SweetsTable } from '@/components/admin';
import { useAuthRedirect } from '../hooks';

type SweetFormData = CreateSweetFormInput;
type RestockFormData = RestockFormInput;

export default function AdminPage() {
    const router = useRouter();
    const { user, isAdmin, loading: authLoading } = useAuthRedirect({
        requireAuth: true,
        requireAdmin: true
    });

    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [restockingSweet, setRestockingSweet] = useState<Sweet | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SweetFormData>({
        resolver: zodResolver(createSweetFormSchema),
    });

    const {
        register: registerRestock,
        handleSubmit: handleRestockSubmit,
        reset: resetRestock,
        formState: { errors: restockErrors, isSubmitting: isRestocking },
    } = useForm<RestockFormData>({
        resolver: zodResolver(restockFormSchema),
    });

    const fetchSweets = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.getSweets({ limit: 100 });
            if (response.data) {
                setSweets(response.data.sweets);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user && isAdmin) {
            fetchSweets();
        }
    }, [user, isAdmin, fetchSweets]);

    useEffect(() => {
        if (editingSweet) {
            reset({
                name: editingSweet.name,
                category: editingSweet.category,
                description: editingSweet.description || '',
                price: editingSweet.price,
                quantity: editingSweet.quantity,
                imageUrl: editingSweet.imageUrl || '',
            });
        }
    }, [editingSweet, reset]);

    const onSubmit = async (data: SweetFormData) => {
        try {
            if (editingSweet) {
                await apiClient.updateSweet(editingSweet.id, data);
            } else {
                await apiClient.createSweet(data);
            }
            reset();
            setEditingSweet(null);
            setShowAddForm(false);
            fetchSweets();
        } catch (error) {
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sweet?')) return;

        setDeletingId(id);
        try {
            await apiClient.deleteSweet(id);
            fetchSweets();
        } catch (error) {
        } finally {
            setDeletingId(null);
        }
    };

    const onRestock = async (data: RestockFormData) => {
        if (!restockingSweet) return;
        try {
            await apiClient.restockSweet(restockingSweet.id, data.quantity);
            resetRestock();
            setRestockingSweet(null);
            fetchSweets();
        } catch (error) {
        }
    };

    const handleAddSweet = () => {
        reset({ name: '', category: '', description: '', price: 0, quantity: 0, imageUrl: '' });
        setEditingSweet(null);
        setShowAddForm(true);
    };

    const handleCancelForm = () => {
        setShowAddForm(false);
        setEditingSweet(null);
        reset();
    };

    const handleCancelRestock = () => {
        setRestockingSweet(null);
        resetRestock();
    };

    const handleEdit = (sweet: Sweet) => {
        setEditingSweet(sweet);
        setShowAddForm(false);
        setRestockingSweet(null);
    };

    const handleRestockClick = (sweet: Sweet) => {
        setRestockingSweet(sweet);
        setShowAddForm(false);
        setEditingSweet(null);
    };

    if (authLoading || !user || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
            <AdminHeader
                onBack={() => router.push('/dashboard')}
                onAddSweet={handleAddSweet}
            />

            <div className="max-w-7xl mx-auto px-4 pt-24 pb-6">
                {(showAddForm || editingSweet) && (
                    <SweetForm
                        editingSweet={editingSweet}
                        register={register}
                        errors={errors}
                        isSubmitting={isSubmitting}
                        onSubmit={handleSubmit(onSubmit)}
                        onCancel={handleCancelForm}
                    />
                )}

                {restockingSweet && (
                    <RestockForm
                        sweetName={restockingSweet.name}
                        register={registerRestock}
                        errors={restockErrors}
                        isSubmitting={isRestocking}
                        onSubmit={handleRestockSubmit(onRestock)}
                        onCancel={handleCancelRestock}
                    />
                )}

                <SweetsTable
                    sweets={sweets}
                    loading={loading}
                    deletingId={deletingId}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRestock={handleRestockClick}
                />
            </div>
        </div>
    );
}

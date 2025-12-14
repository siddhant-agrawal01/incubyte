"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from '../lib/auth-context';
import { apiClient } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, LogOut, Plus, Package, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Sweet, PaginationMeta } from "shared-types";
import { useAuthRedirect, useDebouncedValue } from "../hooks";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    isAdmin,
    logout,
    loading: authLoading,
  } = useAuthRedirect({ requireAuth: true });

  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const loadSweets = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const response = debouncedSearch.trim()
          ? await apiClient.searchSweets({
            q: debouncedSearch,
            category: selectedCategory || undefined,
            page,
          })
          : await apiClient.getSweets({
            page,
            limit: 12,
            category: selectedCategory || undefined,
            sortBy: "name",
            sortOrder: "asc",
          });

        if (response.data) {
          const data =
            "sweets" in response.data
              ? response.data.sweets
              : response.data.results;
          setSweets(data);
          setPagination(response.data.pagination);

          const uniqueCategories = [
            ...new Set(data.map((s: Sweet) => s.category)),
          ];
          setCategories(uniqueCategories);
        }
      } catch (error: any) {
        toast.error(error?.error?.message || "Could not fetch sweets");
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, selectedCategory, toast]
  );

  useEffect(() => {
    if (user) {
      loadSweets();
    }
  }, [user, debouncedSearch, selectedCategory]);

  const handlePurchase = async (sweetId: string) => {
    setPurchasingId(sweetId);
    try {
      const response = await apiClient.purchaseSweet(sweetId, 1);
      if (response.data) {
        toast.success(
          `Purchase successful! Remaining stock: ${response.data.remainingStock}`
        );
        loadSweets(pagination?.page || 1);
      }
    } catch (error: any) {
      toast.error(error?.error?.message || "Could not complete purchase");
    } finally {
      setPurchasingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" label="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <nav className="glass-nav rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">
                Sweet Shop
              </h1>
              {isAdmin && (
                <span className="px-3 py-1 text-xs font-medium bg-rose-500 text-white rounded-full shadow-sm">
                  Admin
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 font-medium">
                Welcome, {user.name}
              </span>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/admin")}
                  className="bg-rose-500 text-white border-rose-500 hover:bg-rose-600 hover:border-rose-600 shadow-sm transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Manage Sweets
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-gray-900/10 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-24 pb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search sweets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-md bg-white text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="md" label="Loading sweets..." />
          </div>
        ) : sweets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No sweets found</p>
          </div>
        ) : (
          <>
            {/* Sweets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sweets.map((sweet) => (
                <Card key={sweet.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    {sweet.imageUrl ? (
                      <img
                        src={sweet.imageUrl}
                        alt={sweet.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <span className="absolute top-2 right-2 px-2 py-1 text-xs bg-white rounded shadow">
                      {sweet.category}
                    </span>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{sweet.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {sweet.description || "No description available"}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xl font-bold">
                        ₹{sweet.price.toFixed(2)}
                      </span>
                      <span
                        className={`text-sm ${sweet.quantity > 0 ? "text-green-600" : "text-red-500"}`}
                      >
                        {sweet.quantity > 0
                          ? `${sweet.quantity} in stock`
                          : "Out of stock"}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      disabled={
                        sweet.quantity === 0 || purchasingId === sweet.id
                      }
                      onClick={() => handlePurchase(sweet.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {purchasingId === sweet.id
                        ? "Purchasing..."
                        : sweet.quantity === 0
                          ? "Out of Stock"
                          : "Purchase"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => loadSweets(pagination.page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => loadSweets(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

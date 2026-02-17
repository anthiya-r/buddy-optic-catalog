'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { API_URLS } from '@/constants/url';
import { api } from '@/lib/request';
import { Eye, EyeOff, FolderOpen, Package, Trash2, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DashboardStats {
  products: {
    total: number;
    active: number;
    hidden: number;
    deleted: number;
  };
  categories: {
    total: number;
    active: number;
  };
  productsByCategory: {
    id: string;
    name: string;
    count: number;
  }[];
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  className,
}: {
  title: string;
  value: number;
  description?: string;
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

function CategoryBreakdown({
  categories,
  totalProducts,
}: {
  categories: DashboardStats['productsByCategory'];
  totalProducts: number;
}) {
  const maxCount = Math.max(...categories.map((c) => c.count), 1);

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          สินค้าตามหมวดหมู่
        </CardTitle>
        <CardDescription>จำนวนสินค้าในแต่ละหมวดหมู่</CardDescription>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">ยังไม่มีหมวดหมู่</p>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => {
              const percentage =
                totalProducts > 0 ? Math.round((category.count / totalProducts) * 100) : 0;
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate max-w-50">{category.name}</span>
                    <span className="text-muted-foreground">
                      {category.count} ({percentage}%)
                    </span>
                  </div>
                  <Progress value={(category.count / maxCount) * 100} className="h-2" />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CategoryBreakdownSkeleton() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickStats({ stats }: { stats: DashboardStats }) {
  const activePercentage =
    stats.products.total > 0 ? Math.round((stats.products.active / stats.products.total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>สถิติโดยรวม</CardTitle>
        <CardDescription>ภาพรวมของระบบ</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">สินค้าที่แสดงอยู่</span>
          <span className="text-sm font-medium">{activePercentage}%</span>
        </div>
        <Progress value={activePercentage} className="h-2" />

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.products.active}</div>
            <div className="text-xs text-muted-foreground">แสดงอยู่</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.products.hidden}</div>
            <div className="text-xs text-muted-foreground">ซ่อนอยู่</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickStatsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await api.get<DashboardStats>(API_URLS.ADMIN.DASHBOARD.STATS);

        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError(response.message || 'Failed to fetch dashboard stats');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p className="font-medium">เกิดข้อผิดพลาด</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">แดชบอร์ด</h1>
        <p className="text-muted-foreground">ภาพรวมข้อมูลร้าน Buddy Optic</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : stats ? (
          <>
            <StatCard
              title="สินค้าทั้งหมด"
              value={stats.products.total}
              description="จำนวนสินค้าในระบบ"
              icon={Package}
            />
            <StatCard
              title="กำลังแสดง"
              value={stats.products.active}
              description="สินค้าที่เปิดขาย"
              icon={Eye}
            />
            <StatCard
              title="ซ่อนอยู่"
              value={stats.products.hidden}
              description="สินค้าที่ปิดการแสดง"
              icon={EyeOff}
            />
            <StatCard
              title="หมวดหมู่"
              value={stats.categories.active}
              description={`จาก ${stats.categories.total} หมวดหมู่`}
              icon={FolderOpen}
            />
          </>
        ) : null}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {loading ? (
          <>
            <CategoryBreakdownSkeleton />
            <QuickStatsSkeleton />
          </>
        ) : stats ? (
          <>
            <CategoryBreakdown
              categories={stats.productsByCategory}
              totalProducts={stats.products.total}
            />
            <QuickStats stats={stats} />
          </>
        ) : null}
      </div>

      {/* Deleted Products Info */}
      {!loading && stats && stats.products.deleted > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-4 py-4">
            <Trash2 className="h-8 w-8 text-destructive" />
            <div>
              <p className="font-medium">มีสินค้าที่ถูกลบ {stats.products.deleted} รายการ</p>
              <p className="text-sm text-muted-foreground">
                สินค้าเหล่านี้ถูกลบแบบ soft delete และยังคงอยู่ในฐานข้อมูล
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

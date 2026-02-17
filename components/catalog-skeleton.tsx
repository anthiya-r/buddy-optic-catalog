import { Skeleton } from '@/components/ui/skeleton';

export default function CatalogSkeleton() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Category filter skeleton - mobile */}
        <div className="mb-6 block md:hidden w-full">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Category filter skeleton - desktop */}
        <div className="mb-8 hidden gap-2 md:flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>

        {/* Products grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card overflow-hidden">
              <Skeleton className="aspect-square w-full rounded-none" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

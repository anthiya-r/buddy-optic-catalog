import CatalogSkeleton from '@/components/catalog-skeleton';
import Catalog from '@/components/catalog';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Buddy Optical | แว่นตาคุณภาพ กรอบแว่นแฟชั่น',
  description:
    'Buddy Optical ร้านแว่นตาคุณภาพ จำหน่ายกรอบแว่นตาแฟชั่น แว่นสายตา หลากหลายรูปแบบ คุณภาพดี ราคาเป็นกันเอง',
  keywords: [
    'แว่นตา',
    'กรอบแว่น',
    'แว่นสายตา',
    'แว่นแฟชั่น',
    'Buddy Optical',
    'ร้านแว่น',
  ],
  openGraph: {
    title: 'Buddy Optical | แว่นตาคุณภาพ กรอบแว่นแฟชั่น',
    description:
      'Buddy Optical ร้านแว่นตาคุณภาพ จำหน่ายกรอบแว่นตาแฟชั่น แว่นสายตา หลากหลายรูปแบบ',
    type: 'website',
    images: ['/buddy-hero.jpeg'],
  },
};

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
      <header className="sticky top-0 z-40 border-b border-amber-200 bg-ci-primary">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="text-2xl font-medium">
            Buddy Optical
          </Link>
        </div>
      </header>

      <section className="relative h-[60vh] md:h-[80vh]">
        <Image
          src="/buddy-hero.jpeg"
          alt="Buddy Optical - กรอบแว่นตาแฟชั่นคุณภาพ"
          fill
          priority
          className="object-cover"
        />
      </section>

      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog />
      </Suspense>
    </div>
  );
}

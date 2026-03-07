import Catalog from '@/components/catalog';
import CatalogSkeleton from '@/components/catalog-skeleton';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'ร้าน Buddy Optical แว่นตา แว่นกรองแสง สายตา ราคาถูก',
  description:
    'ร้านตัดแว่นสายตาทุกชนิด สั้น ยาว เอียง มีเลนส์หลายประเภท  เริ่มต้นเพียง 590 บาท สั่งตัดได้ทั้งออนไลน์และหน้าร้าน พร้อมบริการวัดสายตาฟรี',
  keywords: ['แว่นตา', 'กรอบแว่น', 'แว่นสายตา', 'แว่นแฟชั่น', 'Buddy Optical', 'ร้านแว่น'],
  openGraph: {
    title: 'ร้าน Buddy Optical แว่นตา แว่นกรองแสง สายตา ราคาถูก',
    description:
      'ร้านตัดแว่นสายตาทุกชนิด สั้น ยาว เอียง มีเลนส์หลายประเภท  เริ่มต้นเพียง 590 บาท สั่งตัดได้ทั้งออนไลน์และหน้าร้าน พร้อมบริการวัดสายตาฟรี',
    type: 'website',
    images: ['/buddy-hero.jpg'],
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

      <section className="relative h-[40vh] sm:h-[50vh] md:h-[80vh]">
        <Image
          src="/buddy-hero.jpg"
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

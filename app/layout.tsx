import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Kanit } from 'next/font/google';
import 'react-photo-view/dist/react-photo-view.css';
import './globals.css';

const kanit = Kanit({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['thai', 'latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ร้าน Buddy Optical แว่นตา แว่นกรองแสง สายตา ราคาถูก',
    template: '%s | Buddy Optical',
  },
  description:
    'ร้านตัดแว่นสายตาทุกชนิด สั้น ยาว เอียง มีเลนส์หลายประเภท  เริ่มต้นเพียง 590 บาท สั่งตัดได้ทั้งออนไลน์และหน้าร้าน พร้อมบริการวัดสายตาฟรี',
  metadataBase: new URL('https://www.buddy-optical.com/'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${kanit.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

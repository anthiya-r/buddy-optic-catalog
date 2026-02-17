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
    default: 'Buddy Optical | แว่นตาคุณภาพ กรอบแว่นแฟชั่น',
    template: '%s | Buddy Optical',
  },
  description:
    'Buddy Optical ร้านแว่นตาคุณภาพ จำหน่ายกรอบแว่นตาแฟชั่น แว่นสายตา หลากหลายรูปแบบ คุณภาพดี ราคาเป็นกันเอง',
  metadataBase: new URL('https://buddyoptical.com'),
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

'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <MessageCircle className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="top" align="end" className="mb-2">
          <DropdownMenuItem asChild>
            <a href="https://lin.ee/6qkhefA" target="_blank" className="flex items-center gap-2">
              <Image src="/line-icon.webp" alt="LINE" width={16} height={16} className="h-5 w-5" />
              <span>LINE</span>
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <a
              href="https://www.instagram.com/buddyoptical?igsh=NGRvNWx6NjFpYjN2ram.com/yourpage"
              target="_blank"
              className="flex items-center gap-2"
            >
              <Image
                src="/instagram-icon.png"
                alt="Instagram"
                width={16}
                height={16}
                className="h-4 w-4 ml-0.5"
              />
              <span>Instagram</span>
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

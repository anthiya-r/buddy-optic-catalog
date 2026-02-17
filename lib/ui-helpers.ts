import { API_URLS } from '@/constants/url';
import { cn } from '@/lib/utils';

export const getStatusBadgeClasses = (status: 'active' | 'hidden' | boolean): string => {
  const isActive = typeof status === 'boolean' ? status : status === 'active';

  return cn(
    'cursor-pointer transition-colors',
    isActive
      ? 'bg-green-100 text-green-900 hover:bg-green-200'
      : 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  );
};

export const getCategoryBadgeClasses = (): string => {
  return cn('border-amber-200 bg-amber-50 text-slate-700');
};

export const getActionButtonClasses = (type: 'edit' | 'delete'): string => {
  return cn(
    'transition-colors',
    type === 'edit' ? 'hover:bg-amber-100 hover:text-orange-600' : 'hover:bg-red-100',
  );
};

export const getTableHeaderClasses = (): string => {
  return cn('bg-amber-50 border-amber-100 hover:bg-amber-50');
};

export const getTableRowClasses = (): string => {
  return cn('border-amber-100 hover:bg-amber-50/50 transition-colors');
};

export const getInputClasses = (): string => {
  return cn('border-amber-200 bg-white focus:ring-orange-400 focus:border-orange-400');
};

export const getCardClasses = (): string => {
  return cn('border-amber-100 bg-white shadow-sm hover:shadow-md transition-shadow');
};

export const getStatusDisplay = (isActive: boolean): { icon: string; text: string } => {
  return {
    icon: isActive ? '✓' : '✕',
    text: isActive ? 'แสดง' : 'ซ่อน',
  };
};

export const formatPrice = (price: number): string => {
  return `฿${price.toLocaleString('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

export const getFirstImage = (images: string) => {
  const imageList = images.split(',').filter(Boolean);
  if (imageList[0]) {
    return API_URLS.IMAGES.GET(imageList[0]);
  }
  return '/placeholder.png';
};

export const truncateText = (text: string, length: number = 50): string => {
  return text.length > length ? `${text.slice(0, length)}...` : text;
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface Product {
  id: string;
  name: string;
  color: string;
  images: string;
  status: 'active' | 'hidden';
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProductFormData {
  name: string;
  color: string;
  images: string[];
  categoryId: string;
  status: 'active' | 'hidden';
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

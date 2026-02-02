'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export interface CatalogFiltersState {
  frameStyles: string[];
  materials: string[];
  sizes: string[];
  faceShape: boolean;
}

interface CatalogFiltersProps {
  onFiltersChange: (filters: CatalogFiltersState) => void;
}

const FRAME_FILTERS = [
  { id: 'drop-metal', label: 'รวมแบบกรอบทรงหยดน้ำ (โลหะ)', category: 'frame' },
  { id: 'drop-plastic', label: 'รวมแบบกรอบทรงหยดน้ำ (พลาสติก)', category: 'frame' },
  { id: 'angular-metal', label: 'รวมแบบกรอบทรงเหลี่ยม (โลหะ)', category: 'frame' },
  { id: 'angular-plastic', label: 'รวมแบบกรอบทรงเหลี่ยม (พลาสติก)', category: 'frame' },
  { id: 'cat-eye', label: 'รวมแบบกรอบแคทอาย', category: 'frame' },
  { id: 'frameless', label: 'รวมแบบแว่นไร้กรอบ', category: 'frame' },
  { id: 'small', label: 'รวมแบบกรอบขนาดเล็ก', category: 'size' },
  { id: 'oversized', label: 'รวมแบบกรอบขนาดใหญ่ Oversized', category: 'size' },
  { id: 'face-shape', label: 'แนะนำกรอบให้เหมาะกับแต่ละรูปหน้า', category: 'recommendation' },
];

export default function CatalogFilters({ onFiltersChange }: CatalogFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters((prev) => {
      const updated = prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId];

      // Build filter state
      const frameStyles = updated.filter((id) =>
        [
          'drop-metal',
          'drop-plastic',
          'angular-metal',
          'angular-plastic',
          'cat-eye',
          'frameless',
        ].includes(id),
      );
      const sizes = updated.filter((id) => ['small', 'oversized'].includes(id));
      const faceShape = updated.includes('face-shape');

      onFiltersChange({
        frameStyles,
        materials: [],
        sizes,
        faceShape,
      });

      return updated;
    });
  };

  const frameCategories = {
    frame: FRAME_FILTERS.filter((f) => f.category === 'frame'),
    size: FRAME_FILTERS.filter((f) => f.category === 'size'),
    recommendation: FRAME_FILTERS.filter((f) => f.category === 'recommendation'),
  };

  return (
    <div className="w-full">
      {/* Mobile/Tablet Accordion */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-[#ffe8bf] text-[#1a1a1a] rounded-lg font-medium border border-[#cc9b71]"
        >
          <span>ตัวกรองหมวดหมู่ ({selectedFilters.length})</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="mt-3 space-y-4 p-4 bg-white border border-amber-100 rounded-lg">
            {/* Frame Styles */}
            <div>
              <h4 className="font-semibold text-sm text-[#1a1a1a] mb-2">ประเภทของกรอบ</h4>
              <div className="space-y-2">
                {frameCategories.frame.map((filter) => (
                  <label
                    key={filter.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-amber-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(filter.id)}
                      onChange={() => handleFilterToggle(filter.id)}
                      className="w-4 h-4 rounded border-[#cc9b71] accent-[#cc9b71]"
                    />
                    <span className="text-sm text-slate-700">{filter.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="border-t pt-3">
              <h4 className="font-semibold text-sm text-[#1a1a1a] mb-2">ขนาดกรอบ</h4>
              <div className="space-y-2">
                {frameCategories.size.map((filter) => (
                  <label
                    key={filter.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-amber-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(filter.id)}
                      onChange={() => handleFilterToggle(filter.id)}
                      className="w-4 h-4 rounded border-[#cc9b71] accent-[#cc9b71]"
                    />
                    <span className="text-sm text-slate-700">{filter.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="border-t pt-3">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-amber-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes('face-shape')}
                  onChange={() => handleFilterToggle('face-shape')}
                  className="w-4 h-4 rounded border-[#cc9b71] accent-[#cc9b71]"
                />
                <span className="text-sm font-medium text-[#cc9b71]">
                  {FRAME_FILTERS.find((f) => f.id === 'face-shape')?.label}
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 mb-8 p-6 bg-white border border-amber-100 rounded-lg">
        {/* Column 1: Frame Styles */}
        <div>
          <h3 className="font-semibold text-[#1a1a1a] mb-3 text-sm uppercase tracking-wide">
            ประเภทของกรอบ
          </h3>
          <div className="space-y-2">
            {frameCategories.frame.map((filter) => (
              <label key={filter.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(filter.id)}
                  onChange={() => handleFilterToggle(filter.id)}
                  className="w-4 h-4 rounded border-[#cc9b71] accent-[#cc9b71] cursor-pointer"
                />
                <span className="text-sm text-slate-700 group-hover:text-[#cc9b71] transition-colors">
                  {filter.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Column 2: Sizes */}
        <div>
          <h3 className="font-semibold text-[#1a1a1a] mb-3 text-sm uppercase tracking-wide">
            ขนาดกรอบ
          </h3>
          <div className="space-y-2">
            {frameCategories.size.map((filter) => (
              <label key={filter.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(filter.id)}
                  onChange={() => handleFilterToggle(filter.id)}
                  className="w-4 h-4 rounded border-[#cc9b71] accent-[#cc9b71] cursor-pointer"
                />
                <span className="text-sm text-slate-700 group-hover:text-[#cc9b71] transition-colors">
                  {filter.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Column 3: Recommendation & Clear */}
        <div>
          <h3 className="font-semibold text-[#1a1a1a] mb-3 text-sm uppercase tracking-wide">
            คำแนะนำ
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedFilters.includes('face-shape')}
                onChange={() => handleFilterToggle('face-shape')}
                className="w-4 h-4 rounded border-[#cc9b71] accent-[#cc9b71] cursor-pointer"
              />
              <span className="text-sm font-medium text-[#cc9b71] group-hover:text-[#1a1a1a] transition-colors">
                เหมาะกับรูปหน้า
              </span>
            </label>

            {/* Clear Filters */}
            {selectedFilters.length > 0 && (
              <button
                onClick={() => {
                  setSelectedFilters([]);
                  onFiltersChange({
                    frameStyles: [],
                    materials: [],
                    sizes: [],
                    faceShape: false,
                  });
                }}
                className="mt-4 pt-3 border-t border-amber-100 text-sm text-[#cc9b71] hover:text-[#1a1a1a] font-medium transition-colors"
              >
                ล้างตัวกรอง
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

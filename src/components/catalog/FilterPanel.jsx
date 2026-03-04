import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

const VEHICLE_TYPES = [
  { value: 'bike', label: 'Motorcycles' },
  { value: 'e_auto', label: 'E-Rickshaw' }
];

const CATEGORIES = [
  { value: 'drivetrain', label: 'Drivetrain' },
  { value: 'brakes', label: 'Brakes' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'body', label: 'Body Parts' },
  { value: 'suspension', label: 'Suspension' },
  { value: 'filters', label: 'Filters' },
  { value: 'tyres', label: 'Tyres' },
  { value: 'accessories', label: 'Accessories' }
];

const BRANDS = [
  'Honda', 'Bajaj', 'TVS', 'Hero', 'Yamaha', 'KTM', 'Royal Enfield', 
  'Suzuki', 'Mahindra', 'Piaggio', 'Ather', 'Ola Electric'
];

export default function FilterPanel({ filters, onFilterChange, onClearFilters }) {
  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'all').length;

  return (
    <Card className="glass-effect border-0 sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Filter className="w-5 h-5" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
              {activeFiltersCount}
            </Badge>
          )}
        </CardTitle>
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="self-start text-slate-500 hover:text-red-600"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Vehicle Type */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-3 block">
            Vehicle Type
          </label>
          <Select value={filters.vehicleType || 'all'} onValueChange={(value) => onFilterChange('vehicleType', value)}>
            <SelectTrigger className="hover:border-blue-300">
              <SelectValue placeholder="All Vehicles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              {VEHICLE_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Brand */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-3 block">
            Brand
          </label>
          <Select value={filters.brand || 'all'} onValueChange={(value) => onFilterChange('brand', value)}>
            <SelectTrigger className="hover:border-blue-300">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent className="max-h-48">
              <SelectItem value="all">All Brands</SelectItem>
              {BRANDS.map(brand => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-3 block">
            Category
          </label>
          <Select value={filters.category || 'all'} onValueChange={(value) => onFilterChange('category', value)}>
            <SelectTrigger className="hover:border-blue-300">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-3 block">
            Price Range
          </label>
          <Select value={filters.priceRange || 'all'} onValueChange={(value) => onFilterChange('priceRange', value)}>
            <SelectTrigger className="hover:border-blue-300">
              <SelectValue placeholder="Any Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Price</SelectItem>
              <SelectItem value="0-500">₹0 - ₹500</SelectItem>
              <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
              <SelectItem value="1000-2500">₹1,000 - ₹2,500</SelectItem>
              <SelectItem value="2500-5000">₹2,500 - ₹5,000</SelectItem>
              <SelectItem value="5000+">₹5,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stock Status */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-3 block">
            Availability
          </label>
          <Select value={filters.inStock || 'all'} onValueChange={(value) => onFilterChange('inStock', value)}>
            <SelectTrigger className="hover:border-blue-300">
              <SelectValue placeholder="All Items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="true">In Stock Only</SelectItem>
              <SelectItem value="false">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
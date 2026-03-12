'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import { useProducts } from '@/context/ProductContext';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

const categoryOptions = [
  { value: 'Dairy', label: 'Dairy' },
  { value: 'Produce', label: 'Produce' },
  { value: 'Meat', label: 'Meat' },
  { value: 'Bakery', label: 'Bakery' },
  { value: 'Beverages', label: 'Beverages' },
  { value: 'Snacks', label: 'Snacks' },
  { value: 'Frozen', label: 'Frozen' },
  { value: 'Other', label: 'Other' },
];

export default function ProductForm({
  isOpen,
  onClose,
  product,
}: ProductFormProps) {
  const { addProduct, updateProduct } = useProducts();
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: '',
    category: 'Other',
    stock: '',
    minStock: '',
    expiryDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        stock: product.stock.toString(),
        minStock: product.minStock?.toString() || '',
        expiryDate: product.expiryDate.split('T')[0],
      });
    } else {
      setFormData({
        name: '',
        category: 'Other',
        stock: '',
        minStock: '',
        expiryDate: '',
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a positive number';
    }

    if (formData.minStock && parseInt(formData.minStock) < 0) {
      newErrors.minStock = 'Min stock must be a positive number';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const productData = {
      name: formData.name.trim(),
      category: formData.category,
      stock: parseInt(formData.stock),
      minStock: formData.minStock ? parseInt(formData.minStock) : undefined,
      expiryDate: new Date(formData.expiryDate).toISOString(),
    };

    if (isEditing && product) {
      updateProduct(product.id, productData);
    } else {
      addProduct(productData);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Product' : 'Add Product'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          label="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          placeholder="Enter product name"
        />

        <Select
          id="category"
          label="Category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          options={categoryOptions}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="stock"
            label="Stock Quantity"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            error={errors.stock}
            placeholder="0"
          />

          <Input
            id="minStock"
            label="Min Stock (optional)"
            type="number"
            min="0"
            value={formData.minStock}
            onChange={(e) =>
              setFormData({ ...formData, minStock: e.target.value })
            }
            error={errors.minStock}
            placeholder="Use global"
          />
        </div>

        <Input
          id="expiryDate"
          label="Expiry Date"
          type="date"
          value={formData.expiryDate}
          onChange={(e) =>
            setFormData({ ...formData, expiryDate: e.target.value })
          }
          error={errors.expiryDate}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Save Changes' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

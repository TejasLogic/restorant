import React, { useState } from 'react';
import { NavigationBar } from '@/components/ui/navigation-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Plus, Edit3, Trash2, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Product, AddOn } from '@/types/restaurant';
import { toast } from '@/hooks/use-toast';

const Products: React.FC = () => {
  const { 
    products, 
    addOns, 
    addProduct, 
    removeProduct, 
    updateProduct,
    addAddOn,
    removeAddOn,
    updateAddOn 
  } = useRestaurant();

  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    price: 0,
    description: '',
    category: '',
  });
  const [addOnForm, setAddOnForm] = useState({
    id: '',
    name: '',
    price: 0,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingAddOn, setEditingAddOn] = useState<AddOn | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showAddOnDialog, setShowAddOnDialog] = useState(false);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || productForm.price <= 0 || !productForm.category) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      ...productForm,
      id: editingProduct ? editingProduct.id : `prod_${Date.now()}`,
    };

    if (editingProduct) {
      updateProduct(productData);
      toast({
        title: "Product Updated",
        description: `${productData.name} has been updated successfully.`,
      });
    } else {
      addProduct(productData);
      toast({
        title: "Product Added",
        description: `${productData.name} has been added to the menu.`,
      });
    }

    setProductForm({ id: '', name: '', price: 0, description: '', category: '' });
    setEditingProduct(null);
    setShowProductDialog(false);
  };

  const handleAddOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addOnForm.name || addOnForm.price <= 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const addOnData = {
      ...addOnForm,
      id: editingAddOn ? editingAddOn.id : `addon_${Date.now()}`,
    };

    if (editingAddOn) {
      updateAddOn(addOnData);
      toast({
        title: "Add-on Updated",
        description: `${addOnData.name} has been updated successfully.`,
      });
    } else {
      addAddOn(addOnData);
      toast({
        title: "Add-on Added",
        description: `${addOnData.name} has been added to add-ons.`,
      });
    }

    setAddOnForm({ id: '', name: '', price: 0 });
    setEditingAddOn(null);
    setShowAddOnDialog(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      ...product,
      description: product.description || ''
    });
    setShowProductDialog(true);
  };

  const handleEditAddOn = (addOn: AddOn) => {
    setEditingAddOn(addOn);
    setAddOnForm(addOn);
    setShowAddOnDialog(true);
  };

  const handleDeleteProduct = (id: string) => {
    removeProduct(id);
    toast({
      title: "Product Deleted",
      description: "Product has been removed from the menu.",
    });
  };

  const handleDeleteAddOn = (id: string) => {
    removeAddOn(id);
    toast({
      title: "Add-on Deleted",
      description: "Add-on has been removed.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-cream-light">
      <NavigationBar title="Product Management" showBack={true} />
      
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          {/* Products Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Menu Products</h2>
              <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                <DialogTrigger asChild>
                  <Button variant="chef" onClick={() => {
                    setEditingProduct(null);
                    setProductForm({ id: '', name: '', price: 0, description: '', category: '' });
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="product-name">Product Name</Label>
                      <Input
                        id="product-name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-category">Category</Label>
                      <Input
                        id="product-category"
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        placeholder="e.g., Main Course, Starter"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-price">Price (₹)</Label>
                      <Input
                        id="product-price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                        placeholder="Enter price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-description">Description</Label>
                      <Input
                        id="product-description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Enter description"
                      />
                    </div>
                    <Button type="submit" variant="chef" className="w-full">
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="shadow-card bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-card-foreground">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">₹{product.price}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditProduct(product)}
                          className="h-8 w-8"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Add-ons Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Add-ons</h2>
              <Dialog open={showAddOnDialog} onOpenChange={setShowAddOnDialog}>
                <DialogTrigger asChild>
                  <Button variant="gold" onClick={() => {
                    setEditingAddOn(null);
                    setAddOnForm({ id: '', name: '', price: 0 });
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Add-on
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>{editingAddOn ? 'Edit Add-on' : 'Add New Add-on'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddOnSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="addon-name">Add-on Name</Label>
                      <Input
                        id="addon-name"
                        value={addOnForm.name}
                        onChange={(e) => setAddOnForm({ ...addOnForm, name: e.target.value })}
                        placeholder="Enter add-on name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="addon-price">Price (₹)</Label>
                      <Input
                        id="addon-price"
                        type="number"
                        value={addOnForm.price}
                        onChange={(e) => setAddOnForm({ ...addOnForm, price: parseFloat(e.target.value) })}
                        placeholder="Enter price"
                      />
                    </div>
                    <Button type="submit" variant="gold" className="w-full">
                      {editingAddOn ? 'Update Add-on' : 'Add Add-on'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {addOns.map((addOn) => (
                <Card key={addOn.id} className="shadow-card bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-card-foreground">{addOn.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">₹{addOn.price}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditAddOn(addOn)}
                          className="h-8 w-8"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteAddOn(addOn.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
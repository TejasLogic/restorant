import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavigationBar } from '@/components/ui/navigation-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { AddOn, OrderItem } from '@/types/restaurant';
import { toast } from '@/hooks/use-toast';

const ProductDetail: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, addOns, addToOrder } = useRestaurant();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<{ addOn: AddOn; quantity: number }[]>([]);

  const product = products.find(p => p.id === productId);

  useEffect(() => {
    if (!product) {
      navigate('/');
    }
  }, [product, navigate]);

  if (!product) return null;

  const handleAddOnQuantityChange = (addOnId: string, newQuantity: number) => {
    setSelectedAddOns(prev => {
      if (newQuantity === 0) {
        return prev.filter(item => item.addOn.id !== addOnId);
      }
      
      const existingIndex = prev.findIndex(item => item.addOn.id === addOnId);
      const addOn = addOns.find(a => a.id === addOnId)!;
      
      if (existingIndex >= 0) {
        return prev.map((item, index) => 
          index === existingIndex ? { ...item, quantity: newQuantity } : item
        );
      } else {
        return [...prev, { addOn, quantity: newQuantity }];
      }
    });
  };

  const getAddOnQuantity = (addOnId: string) => {
    const item = selectedAddOns.find(item => item.addOn.id === addOnId);
    return item ? item.quantity : 0;
  };

  const calculateTotal = () => {
    const productTotal = product.price * quantity;
    const addOnsTotal = selectedAddOns.reduce((total, item) => 
      total + (item.addOn.price * item.quantity), 0
    );
    return productTotal + addOnsTotal;
  };

  const handleCreateOrder = () => {
    const orderItem: OrderItem = {
      product,
      quantity,
      addOns: selectedAddOns,
    };
    
    addToOrder(orderItem);
    toast({
      title: "Added to Order",
      description: `${product.name} has been added to your order.`,
    });
    navigate('/order-summary');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-cream-light">
      <NavigationBar title={product.name} showBack={true} />
      
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          {/* Product Info */}
          <Card className="mb-6 shadow-card bg-card">
            <CardHeader>
              <CardTitle className="text-2xl text-card-foreground">
                {product.name}
              </CardTitle>
              <p className="text-muted-foreground">{product.description}</p>
              <div className="text-3xl font-bold text-primary">₹{product.price}</div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Quantity:</span>
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                />
              </div>
            </CardContent>
          </Card>

          {/* Add-ons */}
          <Card className="mb-6 shadow-card bg-card">
            <CardHeader>
              <CardTitle className="text-xl text-card-foreground">Add-ons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {addOns.map((addOn) => (
                <div key={addOn.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div>
                    <span className="font-medium text-foreground">{addOn.name}</span>
                    <span className="text-primary font-semibold ml-2">₹{addOn.price}</span>
                  </div>
                  <QuantitySelector
                    quantity={getAddOnQuantity(addOn.id)}
                    onQuantityChange={(newQuantity) => handleAddOnQuantityChange(addOn.id, newQuantity)}
                    min={0}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="mb-6 shadow-card bg-card">
            <CardHeader>
              <CardTitle className="text-xl text-card-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{product.name} × {quantity}</span>
                  <span>₹{product.price * quantity}</span>
                </div>
                {selectedAddOns.map((item) => (
                  <div key={item.addOn.id} className="flex justify-between text-sm text-muted-foreground">
                    <span>{item.addOn.name} × {item.quantity}</span>
                    <span>₹{item.addOn.price * item.quantity}</span>
                  </div>
                ))}
                <hr className="border-border" />
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>Total</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Order Button */}
          <Button
            variant="chef"
            size="lg"
            onClick={handleCreateOrder}
            className="w-full shadow-floating"
          >
            Create Order - ₹{calculateTotal()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
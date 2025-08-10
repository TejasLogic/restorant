import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationBar } from '@/components/ui/navigation-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Trash2, Edit3 } from 'lucide-react';

const OrderSummary: React.FC = () => {
  const navigate = useNavigate();
  const { currentOrder, removeFromOrder, getOrderTotal, clearOrder } = useRestaurant();

  const handleRemoveItem = (index: number) => {
    removeFromOrder(index);
  };

  const handleProceedToPayment = () => {
    if (currentOrder.length === 0) return;
    navigate('/payment');
  };

  if (currentOrder.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-cream-light">
        <NavigationBar title="Order Summary" showBack={true} />
        <div className="p-4 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">No items in your order</h2>
            <Button variant="chef" onClick={() => navigate('/')}>
              Browse Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-cream-light">
      <NavigationBar title="Order Summary" showBack={true} />
      
      <div className="p-4 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4 mb-6">
            {currentOrder.map((item, index) => (
              <Card key={index} className="shadow-card bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-card-foreground">
                      {item.product.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/product/${item.product.id}`)}
                        className="h-8 w-8"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Quantity: {item.quantity}</span>
                      <span className="font-semibold">₹{item.product.price * item.quantity}</span>
                    </div>
                    {item.addOns.length > 0 && (
                      <div className="pl-4 border-l-2 border-primary/30">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Add-ons:</p>
                        {item.addOns.map((addOnItem, addOnIndex) => (
                          <div key={addOnIndex} className="flex justify-between text-sm">
                            <span>{addOnItem.addOn.name} × {addOnItem.quantity}</span>
                            <span>₹{addOnItem.addOn.price * addOnItem.quantity}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Total */}
          <Card className="shadow-card bg-card mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center text-2xl font-bold text-primary">
                <span>Total Amount</span>
                <span>₹{getOrderTotal()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="chef"
              size="lg"
              onClick={handleProceedToPayment}
              className="w-full shadow-floating"
            >
              Proceed to Payment
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={clearOrder}
              className="w-full"
            >
              Clear Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
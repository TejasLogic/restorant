import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationBar } from '@/components/ui/navigation-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { CreditCard, Banknote, Receipt, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { currentOrder, getOrderTotal, placeOrder, generateReceipt } = useRestaurant();
  const [selectedPayment, setSelectedPayment] = useState<'cash' | 'online' | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);

  const handlePayment = (method: 'cash' | 'online') => {
    // Create order data
    const orderData = {
      id: `order_${Date.now()}`,
      items: [...currentOrder],
      total: getOrderTotal(),
      status: 'pending' as const,
      paymentMethod: method,
      timestamp: new Date(),
    };
    
    // Place order and generate receipt with order data
    const orderId = placeOrder(method);
    const generatedReceipt = generateReceipt(orderId, orderData);
    setReceipt(generatedReceipt);
    setOrderPlaced(true);
    setSelectedPayment(method);
    
    toast({
      title: "Order Placed Successfully!",
      description: `Payment method: ${method.toUpperCase()}`,
    });
  };

  const handlePrintReceipt = () => {
    window.print();
    toast({
      title: "Printing Receipt",
      description: "Receipt is being printed...",
    });
  };

  const handleNewOrder = () => {
    navigate('/');
  };

  useEffect(() => {
    if (currentOrder.length === 0 && !orderPlaced) {
      navigate('/');
    }
  }, [currentOrder.length, orderPlaced, navigate]);

  if (orderPlaced && receipt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-cream-light">
        <NavigationBar title="Order Complete" showBack={false} />
        
        <div className="p-4">
          <div className="max-w-2xl mx-auto">
            {/* Receipt */}
            <Card className="shadow-floating bg-card mb-6" id="receipt">
              <CardHeader className="text-center border-b border-border">
                <CardTitle className="text-2xl text-card-foreground">
                  {receipt.hotelName}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Receipt #{receipt.id}
                </p>
                <p className="text-sm text-muted-foreground">
                  Date: {receipt.generatedAt.toLocaleDateString()} {receipt.generatedAt.toLocaleTimeString()}
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3 mb-6">
                  {receipt.order.items.map((item: any, index: number) => (
                    <div key={index}>
                      <div className="flex justify-between font-medium">
                        <span>{item.product.name} × {item.quantity}</span>
                        <span>₹{item.product.price * item.quantity}</span>
                      </div>
                      {item.addOns.map((addOnItem: any, addOnIndex: number) => (
                        <div key={addOnIndex} className="flex justify-between text-sm text-muted-foreground ml-4">
                          <span>+ {addOnItem.addOn.name} × {addOnItem.quantity}</span>
                          <span>₹{addOnItem.addOn.price * addOnItem.quantity}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                
                <hr className="border-border mb-4" />
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-lg font-bold text-primary">
                    <span>Total Amount</span>
                    <span>₹{receipt.order.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="font-medium uppercase">{receipt.order.paymentMethod}</span>
                  </div>
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  Thank you for your order!
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="gold"
                size="lg"
                onClick={handlePrintReceipt}
                className="w-full shadow-floating"
              >
                <Printer className="w-5 h-5 mr-2" />
                Print Receipt
              </Button>
              <Button
                variant="chef"
                size="lg"
                onClick={handleNewOrder}
                className="w-full"
              >
                New Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-cream-light">
      <NavigationBar title="Payment" showBack={true} />
      
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          {/* Order Summary */}
          <Card className="shadow-card bg-card mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-card-foreground">Final Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {currentOrder.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <hr className="border-border mb-4" />
              <div className="flex justify-between text-xl font-bold text-primary">
                <span>Total</span>
                <span>₹{getOrderTotal()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="shadow-card bg-card mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-card-foreground">Choose Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handlePayment('cash')}
                  className="h-24 flex-col hover:bg-primary/10 hover:border-primary"
                >
                  <Banknote className="w-8 h-8 mb-2 text-primary" />
                  <span className="font-semibold">Cash Payment</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handlePayment('online')}
                  className="h-24 flex-col hover:bg-primary/10 hover:border-primary"
                >
                  <CreditCard className="w-8 h-8 mb-2 text-primary" />
                  <span className="font-semibold">Online Payment</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
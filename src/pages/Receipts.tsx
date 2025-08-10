import React from 'react';
import { NavigationBar } from '@/components/ui/navigation-bar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Receipt, Calendar, CreditCard, Banknote } from 'lucide-react';

const Receipts: React.FC = () => {
  const { receipts } = useRestaurant();

  const sortedReceipts = [...receipts].sort((a, b) => 
    new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-cream-light">
      <NavigationBar title="Receipts" showBack={true} />
      
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          {sortedReceipts.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No receipts found</h2>
              <p className="text-muted-foreground">Receipts will appear here after orders are completed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedReceipts.map((receipt) => (
                <Card key={receipt.id} className="shadow-card bg-card hover:shadow-floating transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                      <Receipt className="w-5 h-5" />
                      Receipt #{receipt.id.slice(-6)}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {receipt.generatedAt.toLocaleDateString()} {receipt.generatedAt.toLocaleTimeString()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Items */}
                      <div>
                        <p className="font-medium text-foreground mb-2">Items ({receipt.order.items.length})</p>
                        <div className="space-y-1">
                          {receipt.order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.product.name} × {item.quantity}</span>
                              <span>₹{item.product.price * item.quantity}</span>
                            </div>
                          ))}
                          {receipt.order.items.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{receipt.order.items.length - 2} more items
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {receipt.order.paymentMethod === 'cash' ? (
                            <Banknote className="w-4 h-4" />
                          ) : (
                            <CreditCard className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium uppercase">
                            {receipt.order.paymentMethod}
                          </span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="pt-2 border-t border-border">
                        <div className="flex justify-between font-bold text-primary">
                          <span>Total</span>
                          <span>₹{receipt.order.total}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Receipts;
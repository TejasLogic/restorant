import React from 'react';
import { NavigationBar } from '@/components/ui/navigation-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Clock, CheckCircle, ChefHat, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ChefDashboard: React.FC = () => {
  const { orders, acceptOrder, completeOrder } = useRestaurant();

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const acceptedOrders = orders.filter(order => order.status === 'accepted');

  const handleAcceptOrder = (orderId: string) => {
    acceptOrder(orderId);
    toast({
      title: "Order Accepted",
      description: "Order has been accepted and is now in preparation.",
    });
  };

  const handleCompleteOrder = (orderId: string) => {
    completeOrder(orderId);
    toast({
      title: "Order Completed",
      description: "Order has been marked as completed.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Pending
        </Badge>;
      case 'accepted':
        return <Badge variant="default" className="flex items-center gap-1 bg-primary">
          <Clock className="w-3 h-3" />
          In Progress
        </Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-cream-light">
      <NavigationBar title="Chef Dashboard" showBack={true} />
      
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="shadow-card bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  Pending Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">
                  {pendingOrders.length}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {acceptedOrders.length}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-chef-orange" />
                  Total Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-chef-orange">
                  {pendingOrders.length + acceptedOrders.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders */}
          {[...pendingOrders, ...acceptedOrders].length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No active orders</h2>
              <p className="text-muted-foreground">New orders will appear here when customers place them.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...pendingOrders, ...acceptedOrders]
                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                .map((order) => (
                <Card key={order.id} className="shadow-card bg-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-card-foreground">
                        Order #{order.id.slice(-6)}
                      </CardTitle>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.timestamp.toLocaleDateString()} {order.timestamp.toLocaleTimeString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Items:</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="bg-muted/30 p-3 rounded-lg">
                              <div className="flex justify-between font-medium">
                                <span>{item.product.name}</span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                              {item.addOns.length > 0 && (
                                <div className="mt-1 pl-4 border-l-2 border-primary/30">
                                  <p className="text-xs font-medium text-muted-foreground mb-1">Add-ons:</p>
                                  {item.addOns.map((addOnItem, addOnIndex) => (
                                    <div key={addOnIndex} className="text-sm text-muted-foreground">
                                      + {addOnItem.addOn.name} × {addOnItem.quantity}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="text-xl font-bold text-primary">₹{order.total}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {order.status === 'pending' && (
                          <Button
                            variant="chef"
                            onClick={() => handleAcceptOrder(order.id)}
                            className="flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept Order
                          </Button>
                        )}
                        {order.status === 'accepted' && (
                          <Button
                            variant="success"
                            onClick={() => handleCompleteOrder(order.id)}
                            className="flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Complete
                          </Button>
                        )}
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

export default ChefDashboard;
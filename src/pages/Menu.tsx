import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationBar } from '@/components/ui/navigation-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { ShoppingCart, Plus } from 'lucide-react';

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { products, currentOrder } = useRestaurant();

  const handleProductSelect = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-cream-light">
      <NavigationBar title="Menu" showMenu={true} />
      
      <div className="p-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome to Delicious Bites
            </h2>
            <p className="text-muted-foreground">
              Choose from our authentic and delicious menu
            </p>
          </div>

          {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4 border-l-4 border-primary pl-3">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="cursor-pointer hover:shadow-floating transition-all duration-300 hover:scale-105 bg-card border-border"
                    onClick={() => handleProductSelect(product.id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-card-foreground">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          ₹{product.price}
                        </span>
                        <Button variant="chef" size="sm" className="shadow-md">
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      {currentOrder.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <Button
            variant="chef"
            size="lg"
            onClick={() => navigate('/order-summary')}
            className="rounded-full shadow-floating h-14 w-14 p-0"
          >
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                {currentOrder.length}
              </span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Menu;
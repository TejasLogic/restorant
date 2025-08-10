import React from 'react';
import { NavigationBar } from '@/components/ui/navigation-bar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  ShoppingBag, 
  Award, 
  Users 
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { getStats } = useRestaurant();
  const stats = getStats();

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-cream-light">
      <NavigationBar title="Admin Panel" showBack={true} />
      
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          {/* Revenue Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="shadow-card bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Today's Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(stats.dailyEarnings)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.totalOrdersToday} orders today
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  Monthly Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">
                  {formatCurrency(stats.monthlyEarnings)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This month's revenue
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gold-accent" />
                  Yearly Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gold-accent">
                  {formatCurrency(stats.yearlyEarnings)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  This year's total
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <Card className="shadow-card bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Top Selling Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.topProducts.length === 0 ? (
                  <p className="text-muted-foreground">No sales data available yet.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.topProducts.map((item, index) => (
                      <div key={item.product.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">₹{item.product.price}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">{item.sales} sold</p>
                          <p className="text-sm text-muted-foreground">
                            ₹{(item.sales * item.product.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Add-ons */}
            <Card className="shadow-card bg-card">
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-accent" />
                  Top Add-ons
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.topAddOns.length === 0 ? (
                  <p className="text-muted-foreground">No add-on sales data available yet.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.topAddOns.map((item, index) => (
                      <div key={item.addOn.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.addOn.name}</p>
                            <p className="text-sm text-muted-foreground">₹{item.addOn.price}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-accent">{item.sales} sold</p>
                          <p className="text-sm text-muted-foreground">
                            ₹{(item.sales * item.addOn.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="shadow-card bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-card-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Avg Order Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.totalOrdersToday > 0 
                    ? formatCurrency(Math.round(stats.dailyEarnings / stats.totalOrdersToday))
                    : '₹0'
                  }
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-card-foreground">
                  Peak Sales Period
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">
                  Evening
                </div>
                <p className="text-xs text-muted-foreground">7-9 PM</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-card-foreground">
                  Most Popular Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">
                  Main Course
                </div>
                <p className="text-xs text-muted-foreground">60% of orders</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-card-foreground">
                  Customer Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-success">
                  98%
                </div>
                <p className="text-xs text-muted-foreground">Based on feedback</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
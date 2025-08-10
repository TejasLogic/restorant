import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RestaurantProvider } from "@/contexts/RestaurantContext";

// Pages
import Menu from "./pages/Menu";
import ProductDetail from "./pages/ProductDetail";
import OrderSummary from "./pages/OrderSummary";
import Payment from "./pages/Payment";
import Receipts from "./pages/Receipts";
import Products from "./pages/Products";
import ChefDashboard from "./pages/ChefDashboard";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RestaurantProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/order-summary" element={<OrderSummary />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/receipts" element={<Receipts />} />
            <Route path="/products" element={<Products />} />
            <Route path="/chef" element={<ChefDashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RestaurantProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

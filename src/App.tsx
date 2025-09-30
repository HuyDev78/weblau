import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Star,
  Plus,
  Minus,
  Trash2,
  Heart,
  Award,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  club: string;
  sizes: string[];
  colors: string[];
  description: string;
  rating: number;
  reviews: number;
}

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

// Context for cart management
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    product: Product,
    size: string,
    color: string,
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider",
    );
  }
  return context;
};

// Sample data
const sampleProducts: Product[] = [
  // ÁO ĐẤU CLB/ĐTQG
  {
    id: "1",
    name: "Áo đấu Manchester United 2024/25",
    price: 1250000,
    originalPrice: 1500000,
    image:
      "https://images.unsplash.com/photo-1662096909687-7c64cde3524b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGplcnNleSUyMHNoaXJ0fGVufDF8fHx8MTc1OTI0OTAwNnww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "jersey",
    club: "manchester-united",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Đỏ", "Trắng"],
    description:
      "Áo đấu chính thức của Manchester United mùa giải 2024/25. Chất liệu Dri-FIT cao cấp.",
    rating: 4.8,
    reviews: 156,
  },
  {
    id: "4",
    name: "Áo đấu Real Madrid Home 2024/25",
    price: 1300000,
    originalPrice: 1600000,
    image:
      "https://images.unsplash.com/photo-1662096909714-e2f206d0a636?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwbWFkcmlkJTIwamVyc2V5fGVufDF8fHx8MTc1OTI0OTQ5MXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "jersey",
    club: "real-madrid",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Trắng", "Xanh đậm"],
    description:
      "Áo đấu sân nhà Real Madrid 2024/25. Thiết kế thanh lịch với chất liệu thoáng khí.",
    rating: 4.9,
    reviews: 203,
  },
  {
    id: "5",
    name: "Áo đấu Barcelona Home 2024/25",
    price: 1280000,
    originalPrice: 1550000,
    image:
      "https://images.unsplash.com/photo-1731335262206-60fc90a7a4e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBqZXJzZXl8ZW58MXx8fHwxNzU5MjQ5NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "jersey",
    club: "barcelona",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Xanh grana", "Vàng"],
    description:
      "Áo đấu Barcelona sân nhà với sọc truyền thống xanh grana và vàng.",
    rating: 4.7,
    reviews: 189,
  },
  {
    id: "6",
    name: "Áo đấu Brazil ĐTQG 2024",
    price: 1100000,
    image:
      "https://images.unsplash.com/photo-1690841813659-813aa4daaba7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmF6aWwlMjBuYXRpb25hbCUyMHRlYW0lMjBqZXJzZXl8ZW58MXx8fHwxNzU5MjQ5NDk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "jersey",
    club: "brazil",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Vàng", "Xanh lá"],
    description:
      "Áo đấu chính thức đội tuyển Brazil với màu vàng truyền thống.",
    rating: 4.6,
    reviews: 145,
  },
  {
    id: "7",
    name: "Áo đấu Argentina ĐTQG 2024",
    price: 1150000,
    image:
      "https://images.unsplash.com/photo-1731335262206-60fc90a7a4e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmdlbnRpbmElMjBqZXJzZXklMjBmb290YmFsbHxlbnwxfHx8fDE3NTkyNDk1MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "jersey",
    club: "argentina",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Xanh trắng", "Vàng"],
    description:
      "Áo đấu Argentina với sọc xanh trắng truyền thống, vô địch World Cup 2022.",
    rating: 4.8,
    reviews: 298,
  },
  {
    id: "8",
    name: "Áo đấu Chelsea FC 2024/25",
    price: 1200000,
    originalPrice: 1450000,
    image:
      "https://images.unsplash.com/photo-1662096909687-7c64cde3524b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGplcnNleSUyMHNoaXJ0fGVufDF8fHx8MTc1OTI0OTAwNnww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "jersey",
    club: "chelsea",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Xanh dương", "Trắng"],
    description:
      "Áo đấu Chelsea FC với màu xanh dương truyền thống.",
    rating: 4.5,
    reviews: 87,
  },

  // GIÀY BÓNG ĐÁ
  {
    id: "2",
    name: "Giày Nike Mercurial Vapor",
    price: 3200000,
    image:
      "https://images.unsplash.com/photo-1674023797405-7bd3826bb471?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGJvb3RzJTIwc2hvZXN8ZW58MXx8fHwxNzU5MjQ5MDA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "shoes",
    club: "nike",
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    colors: ["Đen", "Xanh"],
    description:
      "Giày bóng đá cao cấp Nike Mercurial Vapor với công nghệ Flyknit.",
    rating: 4.9,
    reviews: 89,
  },
  {
    id: "9",
    name: "Giày Adidas Predator Edge",
    price: 2800000,
    originalPrice: 3500000,
    image:
      "https://images.unsplash.com/photo-1684355414454-ed132f6c41cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZGlkYXMlMjBmb290YmFsbCUyMGJvb3RzfGVufDF8fHx8MTc1OTI0OTUwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "shoes",
    club: "adidas",
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    colors: ["Đen", "Đỏ", "Trắng"],
    description:
      "Giày Adidas Predator Edge với thiết kế răng cưa giúp kiểm soát bóng tốt hơn.",
    rating: 4.7,
    reviews: 134,
  },
  {
    id: "10",
    name: "Giày Puma Future Z 1.3",
    price: 2500000,
    image:
      "https://images.unsplash.com/photo-1631472371826-97091cc38df3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdW1hJTIwZm9vdGJhbGwlMjBjbGVhdHN8ZW58MXx8fHwxNzU5MjQ5NTA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "shoes",
    club: "puma",
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    colors: ["Vàng neon", "Đen"],
    description:
      "Giày Puma Future Z 1.3 với công nghệ FUZIONFIT cho sự linh hoạt tối đa.",
    rating: 4.6,
    reviews: 76,
  },
  {
    id: "11",
    name: "Giày Nike Phantom GT2",
    price: 2900000,
    image:
      "https://images.unsplash.com/photo-1674023797405-7bd3826bb471?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGJvb3RzJTIwc2hvZXN8ZW58MXx8fHwxNzU5MjQ5MDA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "shoes",
    club: "nike",
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    colors: ["Trắng", "Hồng"],
    description:
      "Nike Phantom GT2 Elite với thiết kế asymmetrical lacing cho độ chính xác cao.",
    rating: 4.8,
    reviews: 112,
  },
  {
    id: "12",
    name: "Giày Adidas X Speedflow",
    price: 3100000,
    originalPrice: 3600000,
    image:
      "https://images.unsplash.com/photo-1684355414454-ed132f6c41cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZGlkYXMlMjBmb290YmFsbCUyMGJvb3RzfGVufDF8fHx8MTc1OTI0OTUwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "shoes",
    club: "adidas",
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    colors: ["Xanh dương", "Cam"],
    description:
      "Adidas X Speedflow thiết kế cho tốc độ với upper siêu nhẹ.",
    rating: 4.9,
    reviews: 95,
  },

  // PHỤ KIỆN
  {
    id: "3",
    name: "Bóng đá FIFA Quality Pro",
    price: 850000,
    image:
      "https://images.unsplash.com/photo-1687407556702-7e9842d75c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc1OTI0OTAxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "accessories",
    club: "fifa",
    sizes: ["Size 5"],
    colors: ["Trắng/Đen"],
    description:
      "Bóng đá chất lượng FIFA Quality Pro, phù hợp cho thi đấu chuyên nghiệp.",
    rating: 4.7,
    reviews: 234,
  },
  {
    id: "13",
    name: "Găng tay thủ môn Adidas Predator",
    price: 650000,
    originalPrice: 800000,
    image:
      "https://images.unsplash.com/photo-1695194641288-b30eb6bd9eb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGdsb3ZlcyUyMGdvYWxrZWVwZXJ8ZW58MXx8fHwxNzU5MjQ5NTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "accessories",
    club: "adidas",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Đen/Xanh", "Trắng/Đỏ"],
    description:
      "Găng tay thủ môn Adidas Predator với công nghệ URG-T 2.0 grip.",
    rating: 4.8,
    reviews: 67,
  },
  {
    id: "14",
    name: "Tất bóng đá Nike Dri-FIT",
    price: 120000,
    image:
      "https://images.unsplash.com/photo-1684707878583-1d044d9ca708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHNvY2tzJTIwc3BvcnRzfGVufDF8fHx8MTc1OTI0OTUxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "accessories",
    club: "nike",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Đen", "Trắng", "Xanh", "Đỏ"],
    description:
      "Tất bóng đá Nike Dri-FIT chất lượng cao, thấm hút mồ hôi tốt.",
    rating: 4.5,
    reviews: 189,
  },
  {
    id: "15",
    name: "Bảo vệ ống đồng Nike Mercurial",
    price: 350000,
    image:
      "https://images.unsplash.com/photo-1716041189933-046d12d69e39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGluJTIwZ3VhcmRzJTIwZm9vdGJhbGx8ZW58MXx8fHwxNzU5MjQ5NTE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "accessories",
    club: "nike",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Đen", "Trắng", "Xanh"],
    description:
      "Bảo vệ ống đồng Nike Mercurial nhẹ và bền, bảo vệ tối ưu cho cầu thủ.",
    rating: 4.6,
    reviews: 143,
  },
  {
    id: "16",
    name: "Băng đội trưởng Adidas",
    price: 80000,
    image:
      "https://images.unsplash.com/photo-1687407556702-7e9842d75c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc1OTI0OTAxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "accessories",
    club: "adidas",
    sizes: ["One Size"],
    colors: ["Đỏ", "Vàng", "Xanh", "Đen"],
    description:
      "Băng đội trưởng Adidas chính hãng với chất liệu co giãn thoải mái.",
    rating: 4.4,
    reviews: 56,
  },
  {
    id: "17",
    name: "Túi đựng giày bóng đá Nike",
    price: 180000,
    image:
      "https://images.unsplash.com/photo-1687407556702-7e9842d75c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc1OTI0OTAxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "accessories",
    club: "nike",
    sizes: ["One Size"],
    colors: ["Đen", "Xanh dương"],
    description:
      "Túi đựng giày Nike với thiết kế thông thoáng, tiện lợi cho việc mang theo.",
    rating: 4.3,
    reviews: 78,
  },
  {
    id: "18",
    name: "Bóng đá training Adidas Tango",
    price: 450000,
    image:
      "https://images.unsplash.com/photo-1687407556702-7e9842d75c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc1OTI0OTAxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "accessories",
    club: "adidas",
    sizes: ["Size 5"],
    colors: ["Trắng/Đen", "Cam/Đen"],
    description:
      "Bóng đá training Adidas Tango với thiết kế cổ điển, phù hợp cho luyện tập.",
    rating: 4.5,
    reviews: 167,
  },
];

const sampleNews: NewsItem[] = [
  {
    id: "1",
    title: "Manchester United thắng đậm trong trận derby",
    excerpt:
      "Chiến thắng ấn tượng 3-0 trước Manchester City tại Old Trafford...",
    image:
      "https://images.unsplash.com/photo-1634587653129-2a96ebef737b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBwbGF5ZXJzfGVufDF8fHx8MTc1OTI0OTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "2024-12-20",
    category: "Kết quả trận đấu",
  },
  {
    id: "2",
    title: "Messi lập hat-trick trong chiến thắng của PSG",
    excerpt:
      "Siêu sao Argentina tiếp tục thể hiện phong độ đỉnh cao...",
    image:
      "https://images.unsplash.com/photo-1634587653129-2a96ebef737b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBwbGF5ZXJzfGVufDF8fHx8MTc1OTI0OTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "2024-12-19",
    category: "Tin tức CLB",
  },
];

// Components
function Header({
  currentPage,
  setCurrentPage,
  toggleMobileMenu,
}: {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  toggleMobileMenu: () => void;
}) {
  const { getTotalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white shadow-football sticky top-0 z-50 border-b border-green-100">
      {/* Top bar with promotion */}
      <div className="gradient-field text-white py-2">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium">
            🏆 MIỄN PHÍ VẬN CHUYỂN cho đơn hàng trên 1 triệu
            đồng! ⚽
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="bg-gradient-to-br from-green-600 to-green-800 text-white p-3 rounded-xl shadow-lg">
                <span className="text-xl">⚽</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="font-bold text-2xl bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                FootyStore
              </span>
              <p className="text-xs text-gray-600 mt-0.5">
                Chuyên gia bóng đá
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {[
              { key: "home", label: "Trang chủ" },
              { key: "products", label: "Sản phẩm" },
              { key: "news", label: "Tin tức" },
              { key: "promotions", label: "Khuyến mãi" },
              { key: "contact", label: "Liên hệ" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setCurrentPage(key)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                  currentPage === key
                    ? "bg-green-100 text-green-800 shadow-sm"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                type="text"
                placeholder="Tìm kiếm áo đấu, giày, phụ kiện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-200 focus:border-green-500 rounded-xl bg-gray-50 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage("account")}
              className="p-3 hover:bg-green-100 text-gray-700 hover:text-green-600 rounded-xl transition-all duration-200"
            >
              <User className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentPage("cart")}
              className="relative p-3 hover:bg-green-100 text-gray-700 hover:text-green-600 rounded-xl transition-all duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium shadow-lg">
                  {getTotalItems()}
                </Badge>
              )}
            </button>
            <button
              className="md:hidden p-3 hover:bg-green-100 text-gray-700 hover:text-green-600 rounded-xl transition-all duration-200"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function HomePage({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[600px] gradient-field football-field-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40"></div>
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1634587653129-2a96ebef737b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBwbGF5ZXJzfGVufDF8fHx8MTc1OTI0OTAwM3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Football Stadium"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />

        {/* Floating elements */}
        <div className="absolute top-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-75"></div>
        <div className="absolute bottom-32 left-16 w-8 h-8 bg-orange-500/30 rounded-full animate-ping delay-150"></div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="mb-6">
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm font-medium mb-4">
                🏆 #1 STORE BÓNG ĐÁ VIỆT NAM
              </Badge>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Nơi đam mê
              <span className="block bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                bóng đá hội tụ
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
              Khám phá bộ sưu tập áo đấu, giày bóng đá và phụ
              kiện chính hãng từ các CLB và thương hiệu hàng đầu
              thế giới.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setCurrentPage("products")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <span>Khám phá ngay</span>
                <Zap className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-green-800 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm bg-white/10"
              >
                <Award className="mr-2 h-5 w-5" />
                Sản phẩm HOT
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm text-gray-300">
                  Sản phẩm
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-gray-300">
                  Thương hiệu
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">99%</div>
                <div className="text-sm text-gray-300">
                  Hài lòng
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 px-4 py-2 mb-4">
              DANH MỤC NỔI BẬT
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Sản phẩm chất lượng
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Từ áo đấu chính hãng đến giày bóng đá cao cấp,
              chúng tôi có mọi thứ bạn cần
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              className="group cursor-pointer hover:shadow-football-hover transition-all duration-300 transform hover:-translate-y-2 border-0 overflow-hidden"
              onClick={() => setCurrentPage("products")}
            >
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1662096909687-7c64cde3524b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGplcnNleSUyMHNoaXJ0fGVufDF8fHx8MTc1OTI0OTAwNnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Áo đấu"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  HOT
                </Badge>
              </div>
              <CardContent className="p-8 text-center bg-white">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👕</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Áo đấu CLB/ĐTQG
                </h3>
                <p className="text-gray-600 mb-4">
                  Bộ sưu tập áo đấu chính hãng từ các câu lạc bộ
                  và đội tuyển hàng đầu thế giới
                </p>
                <div className="flex items-center justify-center text-green-600 font-medium">
                  <span>Khám phá ngay</span>
                  <TrendingUp className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="group cursor-pointer hover:shadow-football-hover transition-all duration-300 transform hover:-translate-y-2 border-0 overflow-hidden"
              onClick={() => setCurrentPage("products")}
            >
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1674023797405-7bd3826bb471?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGJvb3RzJTIwc2hvZXN8ZW58MXx8fHwxNzU5MjQ5MDA4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Giày bóng đá"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <Badge className="absolute top-4 left-4 bg-blue-500 text-white">
                  PRO
                </Badge>
              </div>
              <CardContent className="p-8 text-center bg-white">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👟</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Giày bóng đá
                </h3>
                <p className="text-gray-600 mb-4">
                  Giày đá bóng chuyên nghiệp từ Nike, Adidas,
                  Puma và các thương hiệu hàng đầu
                </p>
                <div className="flex items-center justify-center text-blue-600 font-medium">
                  <span>Xem bộ sưu tập</span>
                  <Zap className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="group cursor-pointer hover:shadow-football-hover transition-all duration-300 transform hover:-translate-y-2 border-0 overflow-hidden"
              onClick={() => setCurrentPage("products")}
            >
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1687407556702-7e9842d75c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc1OTI0OTAxMXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Phụ kiện"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                  NEW
                </Badge>
              </div>
              <CardContent className="p-8 text-center bg-white">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚽</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  Phụ kiện bóng đá
                </h3>
                <p className="text-gray-600 mb-4">
                  Bóng đá, găng tay thủ môn, tất và các phụ kiện
                  bóng đá chuyên nghiệp
                </p>
                <div className="flex items-center justify-center text-orange-600 font-medium">
                  <span>Tìm hiểu thêm</span>
                  <Shield className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 mb-4">
              TIN TỨC BÓNG ĐÁ
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Cập nhật mới nhất
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Theo dõi tin tức, kết quả và thông tin chuyển
              nhượng từ thế giới bóng đá
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sampleNews.map((news) => (
              <Card
                key={news.id}
                className="group cursor-pointer hover:shadow-football-hover transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden"
              >
                <div className="relative">
                  <ImageWithFallback
                    src={news.image}
                    alt={news.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <Badge className="absolute top-4 left-4 bg-white/90 text-gray-800 backdrop-blur-sm">
                    {news.category}
                  </Badge>
                </div>
                <CardContent className="p-6 bg-white">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-600 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {news.date}
                    </span>
                    <span className="text-green-600 font-medium group-hover:underline">
                      Đọc thêm →
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">
                Chính hãng 100%
              </h4>
              <p className="text-gray-600 text-sm">
                Sản phẩm được nhập khẩu trực tiếp
              </p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">
                Giao hàng nhanh
              </h4>
              <p className="text-gray-600 text-sm">
                Giao hàng trong 24h tại TP.HCM
              </p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">
                Bảo hành uy tín
              </h4>
              <p className="text-gray-600 text-sm">
                Chế độ bảo hành và đổi trả linh hoạt
              </p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">
                Giá tốt nhất
              </h4>
              <p className="text-gray-600 text-sm">
                Cam kết giá cạnh tranh nhất thị trường
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-20 bg-gradient-to-r from-red-500 via-red-600 to-orange-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 football-field-pattern opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            <Badge className="bg-white/20 text-white backdrop-blur-sm px-6 py-3 text-lg font-bold mb-6">
              🔥 FLASH SALE - ĐANG DIỄN RA
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Giảm giá lên đến{" "}
              <span className="text-yellow-300">50%</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              Áo đấu, giày bóng đá và phụ kiện chính hãng từ các
              thương hiệu hàng đầu
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setCurrentPage("products")}
                className="bg-white text-red-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Mua ngay - Tiết kiệm ngay!
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-10 py-4 text-lg font-bold rounded-xl backdrop-blur-sm bg-white/10"
              >
                Xem tất cả ưu đãi
              </Button>
            </div>

            {/* Countdown timer placeholder */}
            <div className="mt-8 inline-flex items-center space-x-4 bg-black/20 backdrop-blur-sm rounded-xl px-6 py-3">
              <span className="text-sm font-medium">
                Kết thúc trong:
              </span>
              <div className="flex space-x-2">
                <div className="bg-white/20 px-3 py-1 rounded text-sm font-bold">
                  12H
                </div>
                <div className="bg-white/20 px-3 py-1 rounded text-sm font-bold">
                  34M
                </div>
                <div className="bg-white/20 px-3 py-1 rounded text-sm font-bold">
                  56S
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductsPage({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) {
  const [filteredProducts, setFilteredProducts] =
    useState(sampleProducts);
  const [selectedCategory, setSelectedCategory] =
    useState("all");
  const [selectedClub, setSelectedClub] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const filterProducts = () => {
    let filtered = sampleProducts;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    if (selectedClub !== "all") {
      filtered = filtered.filter(
        (product) => product.club === selectedClub,
      );
    }

    if (priceRange !== "all") {
      switch (priceRange) {
        case "under-500k":
          filtered = filtered.filter(
            (product) => product.price < 500000,
          );
          break;
        case "500k-1m":
          filtered = filtered.filter(
            (product) =>
              product.price >= 500000 &&
              product.price <= 1000000,
          );
          break;
        case "over-1m":
          filtered = filtered.filter(
            (product) => product.price > 1000000,
          );
          break;
      }
    }

    setFilteredProducts(filtered);
  };

  React.useEffect(() => {
    filterProducts();
  }, [selectedCategory, selectedClub, priceRange]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Sản phẩm bóng đá
          </h1>
          <p className="text-gray-600 text-lg">
            Khám phá bộ sưu tập đầy đủ các sản phẩm bóng đá
            chính hãng
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-football">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại sản phẩm
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="border-2 border-gray-200 focus:border-green-500 rounded-xl">
                    <SelectValue placeholder="Chọn loại sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      Tất cả sản phẩm
                    </SelectItem>
                    <SelectItem value="jersey">
                      👕 Áo đấu
                    </SelectItem>
                    <SelectItem value="shoes">
                      👟 Giày bóng đá
                    </SelectItem>
                    <SelectItem value="accessories">
                      ⚽ Phụ kiện
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CLB/Thương hiệu
                </label>
                <Select
                  value={selectedClub}
                  onValueChange={setSelectedClub}
                >
                  <SelectTrigger className="border-2 border-gray-200 focus:border-green-500 rounded-xl">
                    <SelectValue placeholder="Chọn thương hiệu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      Tất cả thương hiệu
                    </SelectItem>
                    <SelectItem value="manchester-united">
                      Manchester United
                    </SelectItem>
                    <SelectItem value="real-madrid">
                      Real Madrid
                    </SelectItem>
                    <SelectItem value="barcelona">
                      Barcelona
                    </SelectItem>
                    <SelectItem value="chelsea">
                      Chelsea
                    </SelectItem>
                    <SelectItem value="brazil">
                      Brazil
                    </SelectItem>
                    <SelectItem value="argentina">
                      Argentina
                    </SelectItem>
                    <SelectItem value="nike">Nike</SelectItem>
                    <SelectItem value="adidas">
                      Adidas
                    </SelectItem>
                    <SelectItem value="puma">Puma</SelectItem>
                    <SelectItem value="fifa">FIFA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khoảng giá
                </label>
                <Select
                  value={priceRange}
                  onValueChange={setPriceRange}
                >
                  <SelectTrigger className="border-2 border-gray-200 focus:border-green-500 rounded-xl">
                    <SelectValue placeholder="Chọn khoảng giá" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      Tất cả mức giá
                    </SelectItem>
                    <SelectItem value="under-500k">
                      💰 Dưới 500.000đ
                    </SelectItem>
                    <SelectItem value="500k-1m">
                      💰 500.000đ - 1.000.000đ
                    </SelectItem>
                    <SelectItem value="over-1m">
                      💰 Trên 1.000.000đ
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedClub("all");
                    setPriceRange("all");
                  }}
                  variant="outline"
                  className="w-full border-2 border-gray-200 hover:border-green-500 rounded-xl"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Hiển thị{" "}
                <span className="font-medium text-green-600">
                  {filteredProducts.length}
                </span>{" "}
                sản phẩm
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              setCurrentPage={setCurrentPage}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-600 mb-6">
              Thử thay đổi bộ lọc để xem thêm sản phẩm khác
            </p>
            <Button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedClub("all");
                setPriceRange("all");
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Xem tất cả sản phẩm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  setCurrentPage,
}: {
  product: Product;
  setCurrentPage: (page: string) => void;
}) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(
    product.sizes[0],
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0],
  );
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(
        (1 - product.price / product.originalPrice) * 100,
      )
    : 0;

  return (
    <Card className="group hover:shadow-football-hover transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white overflow-hidden h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image Section - Fixed Height */}
        <div className="relative overflow-hidden h-56 flex-shrink-0">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.originalPrice && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 text-xs font-bold shadow-lg">
                -{discountPercentage}%
              </Badge>
            )}
            {product.rating >= 4.8 && (
              <Badge className="bg-orange-500 text-white px-2.5 py-1 text-xs font-medium">
                ⭐ HOT
              </Badge>
            )}
          </div>

          {/* Wishlist button */}
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full border-2 backdrop-blur-sm transition-all duration-200 ${
              isLiked
                ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                : "bg-white/90 border-white text-gray-700 hover:bg-white"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`}
            />
          </Button>

          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <Button
              variant="outline"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 bg-white hover:bg-gray-100 border-2 text-sm px-4"
            >
              Xem nhanh
            </Button>
          </div>
        </div>

        {/* Content Section - Flexible */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Product Name - Fixed Height */}
          <div className="h-12 mb-3 flex items-start">
            <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 text-sm leading-tight">
              {product.name}
            </h3>
          </div>

          {/* Rating - Fixed Height */}
          <div className="flex items-center mb-3 h-5">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5"
                  fill={
                    i < Math.floor(product.rating)
                      ? "currentColor"
                      : "none"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-2 font-medium">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Price Section - Fixed Height */}
          <div className="mb-4 h-10 flex flex-col justify-start">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-lg font-bold text-green-600">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  {product.originalPrice.toLocaleString(
                    "vi-VN",
                  )}
                  đ
                </span>
              )}
            </div>
            {product.originalPrice && (
              <span className="text-xs text-red-600 font-medium">
                Tiết kiệm{" "}
                {(
                  product.originalPrice - product.price
                ).toLocaleString("vi-VN")}
                đ
              </span>
            )}
          </div>

          {/* Size and Color Selection - Compact */}
          <div className="space-y-2 mb-4 flex-grow">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Size:
                </label>
                <Select
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                >
                  <SelectTrigger className="h-8 text-xs border-2 border-gray-200 focus:border-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem
                        key={size}
                        value={size}
                        className="text-xs"
                      >
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Màu:
                </label>
                <Select
                  value={selectedColor}
                  onValueChange={setSelectedColor}
                >
                  <SelectTrigger className="h-8 text-xs border-2 border-gray-200 focus:border-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map((color) => (
                      <SelectItem
                        key={color}
                        value={color}
                        className="text-xs"
                      >
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Add to Cart Button - Fixed at Bottom */}
          <div className="mt-auto">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] text-sm"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>
        <div className="text-center py-16">
          <ShoppingCart className="h-24 w-24 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium mb-2">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-600">
            Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm trong giỏ hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex items-center space-x-4 border-b pb-4"
                  >
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Size: {item.selectedSize} | Màu:{" "}
                        {item.selectedColor}
                      </p>
                      <p className="font-medium text-green-600">
                        {item.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1,
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Tổng cộng đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>
                  {getTotalPrice().toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-green-600">
                    {getTotalPrice().toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
              <Button className="w-full">Thanh toán</Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
              >
                Xóa giỏ hàng
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="flex space-x-4 border-b">
                <button
                  className={`pb-2 ${activeTab === "login" ? "border-b-2 border-green-600 text-green-600" : ""}`}
                  onClick={() => setActiveTab("login")}
                >
                  Đăng nhập
                </button>
                <button
                  className={`pb-2 ${activeTab === "register" ? "border-b-2 border-green-600 text-green-600" : ""}`}
                  onClick={() => setActiveTab("register")}
                >
                  Đăng ký
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTab === "login" ? (
                <>
                  <div>
                    <label className="block mb-2">Email</label>
                    <Input
                      type="email"
                      placeholder="Nhập email của bạn"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">
                      Mật khẩu
                    </label>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => setIsLoggedIn(true)}
                  >
                    Đăng nhập
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block mb-2">Họ tên</label>
                    <Input placeholder="Nhập họ tên" />
                  </div>
                  <div>
                    <label className="block mb-2">Email</label>
                    <Input
                      type="email"
                      placeholder="Nhập email của bạn"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">
                      Số điện thoại
                    </label>
                    <Input placeholder="Nhập số điện thoại" />
                  </div>
                  <div>
                    <label className="block mb-2">
                      Mật khẩu
                    </label>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => setIsLoggedIn(true)}
                  >
                    Đăng ký
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Tài khoản của tôi
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Họ tên:</strong> Nguyễn Văn An
            </p>
            <p>
              <strong>Email:</strong> nguyenvanan@email.com
            </p>
            <p>
              <strong>Số điện thoại:</strong> 0123456789
            </p>
            <Button className="mt-4">
              Chỉnh sửa thông tin
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lịch sử mua hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Bạn chưa có đơn hàng nào.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Địa chỉ giao hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <p>123 Đường ABC, Quận 1, TP.HCM</p>
            <Button className="mt-4">Cập nhật địa chỉ</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Cart Provider Component
function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (
    product: Product,
    size: string,
    color: string,
  ) => {
    const existingItem = cartItems.find(
      (item) =>
        item.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color,
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1,
          selectedSize: size,
          selectedColor: color,
        },
      ]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems(
      cartItems.filter((item) => item.id !== productId),
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () =>
    setMobileMenuOpen(!mobileMenuOpen);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage setCurrentPage={setCurrentPage} />;
      case "products":
        return <ProductsPage setCurrentPage={setCurrentPage} />;
      case "cart":
        return <CartPage />;
      case "account":
        return <AccountPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          toggleMobileMenu={toggleMobileMenu}
        />

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <button
                onClick={() => {
                  setCurrentPage("home");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 hover:text-green-600"
              >
                Trang chủ
              </button>
              <button
                onClick={() => {
                  setCurrentPage("products");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 hover:text-green-600"
              >
                Sản phẩm
              </button>
              <button className="block w-full text-left py-2 hover:text-green-600">
                Tin tức
              </button>
              <button className="block w-full text-left py-2 hover:text-green-600">
                Khuyến mãi
              </button>
              <button className="block w-full text-left py-2 hover:text-green-600">
                Liên hệ
              </button>
            </div>
          </div>
        )}

        {renderPage()}

        {/* Footer */}
        <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16 football-field-pattern">
          <div className="container mx-auto px-4">
            {/* Newsletter */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 mb-12 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Đăng ký nhận tin mới nhất 📧
              </h3>
              <p className="text-green-100 mb-6">
                Nhận thông báo về sản phẩm mới, khuyến mãi và
                tin tức bóng đá
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  placeholder="Nhập email của bạn"
                  className="bg-white text-gray-900 border-0 rounded-xl"
                />
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 rounded-xl font-medium">
                  Đăng ký ngay
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-br from-green-600 to-green-800 text-white p-3 rounded-xl">
                    <span className="text-xl">⚽</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                      FootyStore
                    </h3>
                    <p className="text-xs text-gray-400">
                      Chuyên gia bóng đá
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Nơi đam mê bóng đá hội tụ. Chúng tôi cung cấp
                  các sản phẩm bóng đá chính hãng với chất lượng
                  tốt nhất và dịch vụ khách hàng xuất sắc.
                </p>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                    <span className="text-white font-bold">
                      f
                    </span>
                  </div>
                  <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors cursor-pointer">
                    <span className="text-white font-bold">
                      📷
                    </span>
                  </div>
                  <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                    <span className="text-white font-bold">
                      🐦
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-lg">
                  Danh mục sản phẩm
                </h4>
                <ul className="space-y-3">
                  {[
                    "Áo đấu CLB",
                    "Áo đấu ĐTQG",
                    "Giày bóng đá",
                    "Phụ kiện",
                    "Găng tay thủ môn",
                    "Bóng đá",
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-400 transition-colors flex items-center"
                      >
                        <span className="mr-2">⚽</span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-lg">
                  Hỗ trợ khách hàng
                </h4>
                <ul className="space-y-3">
                  {[
                    "Liên hệ & Hỗ trợ",
                    "Chính sách đổi trả",
                    "Hướng dẫn mua hàng",
                    "Phương thức thanh toán",
                    "Chính sách vận chuyển",
                    "Câu hỏi thường gặp",
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-green-400 transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-lg">
                  Thông tin liên hệ
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">📧</span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">
                        Email
                      </p>
                      <p className="text-white font-medium">
                        support@footystore.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">📞</span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">
                        Hotline
                      </p>
                      <p className="text-white font-medium">
                        1900 123 456
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">📍</span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">
                        Địa chỉ
                      </p>
                      <p className="text-white font-medium">
                        123 Đường ABC, Quận 1, TP.HCM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 mb-4 md:mb-0">
                  &copy; 2024 FootyStore. Tất cả các quyền được
                  bảo lưu.
                </p>
                <div className="flex items-center space-x-6 text-gray-400">
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    Điều khoản sử dụng
                  </a>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    Chính sách bảo mật
                  </a>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    Cookie
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}
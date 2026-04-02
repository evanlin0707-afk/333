/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  Utensils, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShoppingCart, 
  ChevronRight, 
  Instagram, 
  Facebook,
  MessageCircle,
  Dumbbell,
  HeartPulse,
  Baby,
  Users,
  ArrowUpCircle,
  Menu as MenuIcon,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AIAssistant from "./components/AIAssistant";

// --- Types ---

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  calories: number;
  protein: number;
  image: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

// --- Constants ---

const CATEGORIES = [
  { id: "all", name: "全部餐點", icon: <Utensils className="w-4 h-4" /> },
  { id: "muscle", name: "增肌減脂", icon: <Dumbbell className="w-4 h-4" /> },
  { id: "gut", name: "調整腸胃", icon: <HeartPulse className="w-4 h-4" /> },
  { id: "prenatal", name: "孕期營養", icon: <Baby className="w-4 h-4" /> },
  { id: "elderly", name: "銀髮保養", icon: <Users className="w-4 h-4" /> },
  { id: "child", name: "兒童成長", icon: <ArrowUpCircle className="w-4 h-4" /> },
];

const MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "招牌炭烤肉片飯",
    description: "選用上等豬肉片，獨家秘製醬汁炭火直烤，香氣四溢，搭配三樣當季時蔬。",
    price: 110,
    category: "muscle",
    calories: 580,
    protein: 32,
    image: "https://loremflickr.com/800/600/food,pork,rice,bento?lock=1"
  },
  {
    id: "2",
    name: "醬燒大雞腿飯",
    description: "整隻大雞腿慢火醬燒，肉質鮮嫩多汁，富含優質蛋白質。",
    price: 130,
    category: "muscle",
    calories: 620,
    protein: 38,
    image: "https://loremflickr.com/800/600/food,chicken,leg,meal?lock=2"
  },
  {
    id: "3",
    name: "黃金酥炸排骨飯",
    description: "經典台式風味，排骨外酥內嫩，厚實飽滿，滿足感十足。",
    price: 120,
    category: "child",
    calories: 650,
    protein: 28,
    image: "https://loremflickr.com/800/600/food,pork,chop,rice?lock=3"
  },
  {
    id: "4",
    name: "蒜泥薄切白肉飯",
    description: "清爽不油膩的薄切白肉，淋上特製蒜泥醬，開胃又健康。",
    price: 105,
    category: "gut",
    calories: 420,
    protein: 25,
    image: "https://loremflickr.com/800/600/food,pork,sliced,healthy?lock=4"
  },
  {
    id: "5",
    name: "鹽烤挪威鯖魚飯",
    description: "新鮮鯖魚簡單鹽烤，鎖住魚肉鮮甜與豐富 Omega-3 油脂。",
    price: 125,
    category: "elderly",
    calories: 480,
    protein: 26,
    image: "https://loremflickr.com/800/600/food,fish,mackerel,grilled?lock=5"
  },
  {
    id: "6",
    name: "韓式泡菜烤肉飯",
    description: "微辣爽口的韓式泡菜，搭配招牌烤肉片，層次豐富超下飯。",
    price: 120,
    category: "muscle",
    calories: 560,
    protein: 30,
    image: "https://loremflickr.com/800/600/food,kimchi,pork,bowl?lock=6"
  }
];

// --- Components ---

export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredItems = activeCategory === "all" 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#2D2D2D] font-sans selection:bg-[#FF6321] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FF6321] rounded-full flex items-center justify-center text-white">
              <Utensils className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#FF6321]">阿爸的家園</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-wider">
            <a href="#home" className="hover:text-[#FF6321] transition-colors">首頁</a>
            <a href="#menu" className="hover:text-[#FF6321] transition-colors">菜單</a>
            <a href="#about" className="hover:text-[#FF6321] transition-colors">關於我們</a>
            <a href="#contact" className="hover:text-[#FF6321] transition-colors">聯絡資訊</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#FF6321] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-bold">
              <a href="#home" onClick={() => setIsMenuOpen(false)}>首頁</a>
              <a href="#menu" onClick={() => setIsMenuOpen(false)}>菜單</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)}>關於我們</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)}>聯絡資訊</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#E0F2F1] -z-10 rounded-l-[100px] hidden lg:block" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-[#FF6321] rounded-full blur-3xl -z-10"
        />

        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-[#FF6321]/10 text-[#FF6321] rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Healthy Nutrition Center
            </span>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 text-[#1A1A1A]">
              讓身體成為<br />
              <span className="text-[#FF6321]">你想要的</span>樣子
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
              阿爸的家園提供專業營養調配便當，無論是增肌減脂、孕期營養或兒童成長，我們都為您準備了最適合的美味選擇。
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#menu" 
                className="px-8 py-4 bg-[#FF6321] text-white rounded-full font-bold hover:shadow-xl hover:shadow-[#FF6321]/20 transition-all flex items-center gap-2 group"
              >
                立即訂餐 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#about" 
                className="px-8 py-4 border-2 border-[#1A1A1A] text-[#1A1A1A] rounded-full font-bold hover:bg-[#1A1A1A] hover:text-white transition-all"
              >
                了解更多
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl rotate-3">
              <img 
                src="https://loremflickr.com/1000/1000/food,bento,healthy?lock=10" 
                alt="Healthy Meal" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating Badges */}
            <div className="absolute -top-6 -right-6 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 -rotate-6">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                <CheckCircle2 />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">體驗價</p>
                <p className="text-2xl font-black">$49 <span className="text-sm font-normal text-gray-500">起</span></p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories / Services */}
      <section className="py-20 bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">專業營養服務</h2>
            <div className="w-20 h-1 bg-[#FF6321] mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {CATEGORIES.slice(1).map((cat, idx) => (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group cursor-pointer"
                onClick={() => {
                  setActiveCategory(cat.id);
                  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-[#FF6321] group-hover:scale-110 transition-all">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wider">{cat.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div>
              <h2 className="text-5xl font-black mb-4">今日精選菜單</h2>
              <p className="text-gray-500">每一份餐點都經過營養師嚴格把關</p>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                    activeCategory === cat.id 
                      ? "bg-[#FF6321] text-white shadow-lg shadow-[#FF6321]/30" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[32px] overflow-hidden border border-[#E5E5E5] hover:shadow-2xl transition-all group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {item.calories} kcal
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold">{item.name}</h3>
                      <span className="text-[#FF6321] font-black text-xl">${item.price}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold">蛋白質</span>
                        <span className="font-bold">{item.protein}g</span>
                      </div>
                      <div className="w-px h-8 bg-gray-100" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold">分類</span>
                        <span className="font-bold text-[#FF6321]">
                          {CATEGORIES.find(c => c.id === item.category)?.name}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-full py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold hover:bg-[#FF6321] transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" /> 加入購物車
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* About & Info */}
      <section id="about" className="py-24 bg-[#F5F5F0]">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-5xl font-black mb-8">關於阿爸的家園</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 shrink-0 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#FF6321]">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">營業時間</h4>
                  <p className="text-gray-500">週一至週五 07:30 - 11:30</p>
                  <p className="text-gray-400 text-sm italic">其他時間採預約制</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 shrink-0 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#FF6321]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">門市地址</h4>
                  <p className="text-gray-500">台北市大同區承德路一段23號1樓</p>
                  <p className="text-gray-400 text-sm">鄰近台北火車站、中山捷運站</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 shrink-0 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#FF6321]">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">聯絡電話</h4>
                  <p className="text-gray-500">0906-000-923 / 02-25236643</p>
                  <p className="text-gray-400 text-sm">負責人：吳秉洋</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-[32px] overflow-hidden bg-gray-200">
                <img src="https://picsum.photos/seed/modern-kitchen-cooking/600/800" alt="Kitchen" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-square rounded-[32px] overflow-hidden bg-gray-200">
                <img src="https://picsum.photos/seed/fresh-organic-vegetables/600/600" alt="Vegetables" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <div className="aspect-square rounded-[32px] overflow-hidden bg-gray-200">
                <img src="https://picsum.photos/seed/professional-chef-plating/600/600" alt="Chef" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-[3/4] rounded-[32px] overflow-hidden bg-gray-200">
                <img src="https://picsum.photos/seed/delicious-healthy-meal/600/800" alt="Meal" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#1A1A1A] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-[#FF6321] rounded-full flex items-center justify-center text-white">
                  <Utensils className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold tracking-tight">阿爸的家園</span>
              </div>
              <p className="text-gray-400 max-w-md mb-8">
                我們致力於提供最科學、最健康的營養方案。無論您的目標是健康管理還是特定時期的營養補充，阿爸的家園都是您最可靠的夥伴。
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF6321] transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF6321] transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF6321] transition-colors"><MessageCircle className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-[#FF6321]">快速連結</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">首頁</a></li>
                <li><a href="#menu" className="hover:text-white transition-colors">今日菜單</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">關於我們</a></li>
                <li><a href="#" className="hover:text-white transition-colors">常見問題</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-[#FF6321]">聯絡我們</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center gap-3"><Phone className="w-4 h-4" /> 0906-000-923</li>
                <li className="flex items-center gap-3"><MapPin className="w-4 h-4" /> 台北市大同區承德路一段23號</li>
                <li className="flex items-center gap-3"><Clock className="w-4 h-4" /> Mon-Fri: 7:30 - 11:30</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            © 2026 阿爸的家園 Healthy Nutrition Center. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6" /> 您的訂單
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Utensils className="w-16 h-16 mb-4 opacity-20" />
                    <p>購物車目前是空的</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-bold">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">${item.price}</p>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex justify-between mb-6">
                    <span className="text-gray-500">總計金額</span>
                    <span className="text-3xl font-black text-[#FF6321]">${totalPrice}</span>
                  </div>
                  <button 
                    onClick={() => {
                      alert("感謝您的訂購！我們將盡快與您聯繫。");
                      setCart([]);
                      setIsCartOpen(false);
                    }}
                    className="w-full py-5 bg-[#FF6321] text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-[#FF6321]/30 transition-all"
                  >
                    確認下單
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AIAssistant menuItems={MENU_ITEMS} onAddToCart={addToCart} />
    </div>
  );
}

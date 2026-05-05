"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/app/components/Navbar';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, CreditCard, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { checkout, API_BASE_URL } from '@/lib/api';
import Script from 'next/script';
import { md5 } from '@/lib/md5';
import { ConfirmModal } from '@/app/components/ConfirmModal';

declare global {
  interface Window {
    payhere: any;
  }
}

const CheckoutPage = () => {
  const { cart, getCartTotal, getCartCount, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: 'Sri Lanka',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK_TRANSFER'>('COD');
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', title: 'Acquisition Alert' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      setAlertModal({ 
        isOpen: true, 
        title: 'Authentication Required', 
        message: "Please sign in to complete your luxury purchase." 
      });
      return;
    }

    setLoading(true);
    try {
      const items = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const shippingDetails = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        shippingAddress: formData.address,
        city: formData.city,
        phone: formData.phone
      };

      const result = await checkout(user.id, paymentMethod === 'COD' ? 'CASH_ON_DELIVERY' : 'BANK_TRANSFER', items, shippingDetails);
      
      if (paymentMethod === 'BANK_TRANSFER') {
        // Redirect to success page but with WhatsApp info
        localStorage.setItem('lastOrder', JSON.stringify({
          orderId: result.id,
          total: getCartTotal(),
          method: 'BANK_TRANSFER'
        }));
        clearCart();
        router.push('/checkout/success?method=bank');
      } else {
        clearCart();
        router.push('/checkout/success');
      }
    } catch (error: any) {
      console.error("Order placement failed:", error);
      setAlertModal({ 
        isOpen: true, 
        title: 'Acquisition Alert', 
        message: error.message || "Failed to place order. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-black mb-4 uppercase tracking-tighter">Your Collection is Empty</h1>
        <p className="text-zinc-500 mb-8 max-w-md uppercase text-[10px] tracking-[0.2em] font-bold">Please add items to your collection before proceeding to checkout.</p>
        <button onClick={() => router.push('/')} className="bg-black text-white px-12 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all">Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12 md:py-20 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
          
          <div className="flex-1">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors mb-12 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Back to Collection</span>
            </button>

            <div className="mb-12">
               <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Secure Checkout</h1>
               <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">Authentic Luxury Service</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
               <section>
                  <div className="flex items-center gap-3 mb-8 border-b border-zinc-100 pb-4">
                     <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">1</span>
                     <h2 className="text-xs font-black uppercase tracking-[0.3em]">Contact Information</h2>
                  </div>
                  <div className="space-y-6">
                      <div className="relative space-y-1">
                         <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</p>
                         <input 
                            required
                            type="email" 
                            name="email"
                            placeholder="yourname@email.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full border-b-2 border-zinc-100 py-4 px-1 focus:border-black transition-colors outline-none text-sm font-bold uppercase tracking-widest placeholder:text-zinc-200"
                         />
                      </div>
                     <div className="flex items-center gap-4 py-2">
                        <input type="checkbox" id="marketing" className="accent-black" />
                        <label htmlFor="marketing" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 cursor-pointer">Email me with luxury collections and news</label>
                     </div>
                  </div>
               </section>

               <section>
                  <div className="flex items-center gap-3 mb-8 border-b border-zinc-100 pb-4">
                     <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">2</span>
                     <h2 className="text-xs font-black uppercase tracking-[0.3em]">Shipping Destination</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                     <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 ml-1">First Name</p>
                        <input 
                           required
                           type="text" 
                           name="firstName"
                           placeholder="e.g. Sunil"
                           value={formData.firstName}
                           onChange={handleInputChange}
                           className="w-full border-b-2 border-zinc-100 py-4 px-1 focus:border-black transition-colors outline-none text-sm font-bold uppercase tracking-widest placeholder:text-zinc-200"
                        />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 ml-1">Last Name</p>
                        <input 
                           required
                           type="text" 
                           name="lastName"
                           placeholder="e.g. Perera"
                           value={formData.lastName}
                           onChange={handleInputChange}
                           className="w-full border-b-2 border-zinc-100 py-4 px-1 focus:border-black transition-colors outline-none text-sm font-bold uppercase tracking-widest placeholder:text-zinc-200"
                        />
                     </div>
                  </div>
                  <div className="space-y-8">
                     <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 ml-1">Shipping Address</p>
                        <input 
                           required
                           type="text" 
                           name="address"
                           placeholder="House No, Street, Area"
                           value={formData.address}
                           onChange={handleInputChange}
                           className="w-full border-b-2 border-zinc-100 py-4 px-1 focus:border-black transition-colors outline-none text-sm font-bold uppercase tracking-widest placeholder:text-zinc-200"
                        />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <div className="space-y-1">
                           <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 ml-1">City</p>
                           <input 
                              required
                              type="text" 
                              name="city"
                              placeholder="e.g. Colombo"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full border-b-2 border-zinc-100 py-4 px-1 focus:border-black transition-colors outline-none text-sm font-bold uppercase tracking-widest placeholder:text-zinc-200"
                           />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 ml-1">Country</p>
                           <div className="w-full border-b-2 border-zinc-100 py-4 px-1 text-sm font-black uppercase tracking-widest text-zinc-300">
                              Sri Lanka
                           </div>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 ml-1">Phone Number (Mobile)</p>
                           <input 
                              required
                              type="tel" 
                              name="phone"
                              placeholder="077 XXXXXXX"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full border-b-2 border-zinc-100 py-4 px-1 focus:border-black transition-colors outline-none text-sm font-bold uppercase tracking-widest placeholder:text-zinc-200"
                           />
                        </div>
                     </div>
                  </div>
               </section>

               <section className="pt-12">
                  <div className="flex items-center gap-4 mb-10 pb-4 border-b border-zinc-100">
                     <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[12px] font-black">3</span>
                     <h2 className="text-[14px] font-black uppercase tracking-[0.4em] text-black">Payment Method</h2>
                  </div>
                  
                  <div className="space-y-4 mb-12">
                      <div 
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-8 border-2 rounded-sm cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                          paymentMethod === 'COD' ? 'border-black bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200 bg-white'
                        }`}
                      >
                         <div className="flex items-center gap-5">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-black' : 'border-zinc-200'}`}>
                               {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                            </div>
                            <div className="text-left">
                               <p className="text-[13px] font-black uppercase tracking-[0.2em] text-black">Cash on Delivery (COD)</p>
                               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Pay in cash upon receiving your watch at your doorstep.</p>
                            </div>
                         </div>
                         <Truck size={24} strokeWidth={1.5} className={paymentMethod === 'COD' ? 'text-black' : 'text-zinc-200'} />
                      </div>

                      <div 
                        onClick={() => setPaymentMethod('BANK_TRANSFER')}
                        className={`p-8 border-2 rounded-sm cursor-pointer transition-all ${
                          paymentMethod === 'BANK_TRANSFER' ? 'border-black bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200 bg-white'
                        }`}
                      >
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                            <div className="flex items-center gap-5">
                               <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'BANK_TRANSFER' ? 'border-black' : 'border-zinc-200'}`}>
                                  {paymentMethod === 'BANK_TRANSFER' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                               </div>
                               <div className="text-left">
                                  <p className="text-[13px] font-black uppercase tracking-[0.2em] text-black">Bank Transfer / Online Payment</p>
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Transfer directly to our bank account and send receipt via WhatsApp.</p>
                               </div>
                            </div>
                            <CreditCard size={24} strokeWidth={1.5} className={paymentMethod === 'BANK_TRANSFER' ? 'text-black' : 'text-zinc-200'} />
                         </div>
                         
                         {paymentMethod === 'BANK_TRANSFER' && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="pl-10 space-y-4"
                            >
                               <div className="bg-white p-6 border border-zinc-200 rounded-sm space-y-6">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 pb-2">Select Your Preferred Bank:</p>
                                  
                                  {/* Commercial Bank */}
                                  <div className="border-l-4 border-[#0067b1] pl-4 py-2 bg-blue-50/30">
                                     <div className="grid grid-cols-2 gap-y-3">
                                        <div className="col-span-2 flex items-center justify-between">
                                           <p className="text-[11px] font-black uppercase text-[#0067b1]">Commercial Bank</p>
                                           <span className="text-[8px] font-black bg-[#0067b1] text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Primary</span>
                                        </div>
                                        <div>
                                           <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter">Acc Name</p>
                                           <p className="text-[10px] font-black uppercase">ANIX BOUTIQUE</p>
                                        </div>
                                        <div>
                                           <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter">Acc Number</p>
                                           <p className="text-[10px] font-black uppercase tracking-widest">8012345678</p>
                                        </div>
                                     </div>
                                  </div>

                                  {/* Sampath Bank */}
                                  <div className="border-l-4 border-[#f37021] pl-4 py-2 bg-orange-50/30">
                                     <div className="grid grid-cols-2 gap-y-3">
                                        <div className="col-span-2">
                                           <p className="text-[11px] font-black uppercase text-[#f37021]">Sampath Bank</p>
                                        </div>
                                        <div>
                                           <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter">Acc Name</p>
                                           <p className="text-[10px] font-black uppercase">ANIX BOUTIQUE</p>
                                        </div>
                                        <div>
                                           <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter">Acc Number</p>
                                           <p className="text-[10px] font-black uppercase tracking-widest">1234567890</p>
                                        </div>
                                     </div>
                                  </div>

                                  {/* BOC */}
                                  <div className="border-l-4 border-[#ffcc00] pl-4 py-2 bg-yellow-50/30">
                                     <div className="grid grid-cols-2 gap-y-3">
                                        <div className="col-span-2">
                                           <p className="text-[11px] font-black uppercase text-zinc-800">Bank of Ceylon (BOC)</p>
                                        </div>
                                        <div>
                                           <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter">Acc Name</p>
                                           <p className="text-[10px] font-black uppercase">ANIX BOUTIQUE</p>
                                        </div>
                                        <div>
                                           <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter">Acc Number</p>
                                           <p className="text-[10px] font-black uppercase tracking-widest">0087654321</p>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                               <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest italic">
                                  * Please use your Name or Phone number as the reference.
                               </p>
                            </motion.div>
                         )}
                      </div>
                   </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading || !paymentMethod}
                    className="w-full bg-black text-white py-8 text-[12px] font-black uppercase tracking-[0.5em] hover:bg-zinc-900 transition-all shadow-2xl flex items-center justify-center gap-6 group disabled:opacity-50"
                  >
                     {loading ? (
                        <>
                           <Loader2 size={18} className="animate-spin" />
                           Processing Acquisition...
                        </>
                     ) : (
                        <>
                           Complete Purchase
                           <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </>
                     )}
                  </button>
               </section>
            </form>
          </div>

          <div className="lg:w-[400px]">
             <div className="bg-zinc-50 border border-zinc-100 p-8 sticky top-24 rounded-sm">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-10 pb-4 border-b border-zinc-200 flex items-center justify-between">
                   Order Summary
                   <span className="bg-black text-white w-5 h-5 flex items-center justify-center rounded-full text-[9px]">{getCartCount()}</span>
                </h2>

                <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                   {cart.map((item) => (
                      <div key={item.id} className="flex gap-4">
                         <div className="w-16 h-20 bg-white border border-zinc-200 rounded-sm overflow-hidden flex-shrink-0">
                            <img src={item.imageUrl?.split('|')[0]} alt={item.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 flex flex-col justify-center">
                            <h4 className="text-[10px] font-black text-black uppercase tracking-tight line-clamp-1">{item.name}</h4>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                            <p className="text-[10px] font-black text-black mt-2 uppercase tracking-widest">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-zinc-200">
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>Subtotal</span>
                      <span>Rs. {getCartTotal().toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>Shipping</span>
                      <span className="text-black">Complimentary</span>
                   </div>
                   <div className="flex justify-between items-center text-lg font-black tracking-tighter pt-4 border-t border-zinc-200 text-black">
                      <span>Total</span>
                      <span>Rs. {getCartTotal().toLocaleString()}</span>
                   </div>
                </div>

                <div className="mt-10 p-4 border border-zinc-200 border-dashed rounded-sm flex items-center gap-4 group">
                    <ShieldCheck size={20} className="text-zinc-300 group-hover:text-black transition-colors" />
                    <div>
                       <p className="text-[9px] font-black uppercase tracking-widest text-black">SSL Secured</p>
                       <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">256-bit data encryption</p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      <ConfirmModal 
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        onConfirm={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        confirmText="Understood"
        type="danger"
      />

      <Script 
        src="https://www.payhere.lk/lib/payhere.js" 
        strategy="afterInteractive"
      />
      
      <footer className="bg-white border-t border-zinc-100 py-12">
          <div className="container mx-auto px-6 text-center">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em]">ANIX OFFICIAL BOUTIQUE &copy; 2026</p>
          </div>
      </footer>
    </div>
  );
};

export default CheckoutPage;

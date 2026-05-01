"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/app/components/Navbar';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, CreditCard, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { checkout } from '@/lib/api';
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
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
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

    if (paymentMethod === 'ONLINE') {
      const merchantId = "1235239";
      const merchantSecret = "4knwMA2AQmR8cP9rVh81Cd8QenK7fG0xs8gj3Ea8vNdl";
      const orderId = `Order_${Date.now()}`;
      const amountFormatted = getCartTotal().toFixed(2);
      const currency = "LKR";

      const hash = md5(
        merchantId + 
        orderId + 
        amountFormatted + 
        currency + 
        md5(merchantSecret).toUpperCase()
      ).toUpperCase();

      const payment = {
        sandbox: true,
        merchant_id: merchantId,
        return_url: "http://localhost:3000/checkout/success",
        cancel_url: "http://localhost:3000/checkout",
        notify_url: "http://localhost:8080/api/payment/notify",
        order_id: orderId,
        items: "Watch Haven Collection Acquisition",
        amount: amountFormatted,
        currency: currency,
        hash: hash,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
      };

      window.payhere.onCompleted = async function onCompleted() {
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

          await checkout(user.id, 'CARD', items, shippingDetails);
          clearCart();
          router.push('/checkout/success');
        } catch (error: any) {
          console.error("Order recording failed:", error);
          setAlertModal({ 
            isOpen: true, 
            title: 'Acquisition Error', 
            message: error.message || "An error occurred while finalizing your acquisition." 
          });
        } finally {
          setLoading(false);
        }
      };

      if (window.payhere) {
        window.payhere.startPayment(payment);
      } else {
        setAlertModal({ 
          isOpen: true, 
          title: 'Gateway Syncing', 
          message: "Payment gateway is still loading. Please wait a moment." 
        });
      }
    } else {
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

        await checkout(user.id, 'CASH_ON_DELIVERY', items, shippingDetails);
        clearCart();
        router.push('/checkout/success');
      } catch (error: any) {
        console.error("COD order placement failed:", error);
        setAlertModal({ 
          isOpen: true, 
          title: 'Acquisition Alert', 
          message: error.message || "Failed to place order. Please try again." 
        });
      } finally {
        setLoading(false);
      }
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
                     <div className="relative">
                        <input 
                           required
                           type="email" 
                           name="email"
                           placeholder="Email Address"
                           value={formData.email}
                           onChange={handleInputChange}
                           className="w-full border-b-2 border-zinc-100 py-4 focus:border-black transition-colors outline-none text-sm font-bold uppercase tracking-widest placeholder:text-zinc-300 placeholder:font-black"
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
                     <h2 className="text-xs font-black uppercase tracking-[0.3em]">Shipping Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                     <input 
                        required
                        type="text" 
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full border-b-2 border-zinc-100 py-4 focus:border-black transition-colors outline-none text-sm font-bold uppercase tracking-widest placeholder:text-zinc-300 placeholder:font-black"
                     />
                     <input 
                        required
                        type="text" 
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full border-b-2 border-zinc-100 py-4 focus:border-black transition-colors outline-none text-sm font-bold uppercase tracking-widest placeholder:text-zinc-300 placeholder:font-black"
                     />
                  </div>
                  <div className="space-y-8">
                     <input 
                        required
                        type="text" 
                        name="address"
                        placeholder="Shipping Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full border-b-2 border-zinc-100 py-4 focus:border-black transition-colors outline-none text-sm font-bold uppercase tracking-widest placeholder:text-zinc-300 placeholder:font-black"
                     />
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <input 
                           required
                           type="text" 
                           name="city"
                           placeholder="City"
                           value={formData.city}
                           onChange={handleInputChange}
                           className="w-full border-b-2 border-zinc-100 py-4 focus:border-black transition-colors outline-none text-sm font-bold uppercase tracking-widest placeholder:text-zinc-300 placeholder:font-black"
                        />
                        <div className="w-full border-b-2 border-zinc-100 py-4 text-sm font-black uppercase tracking-widest text-zinc-400">
                           Sri Lanka
                        </div>
                        <input 
                           required
                           type="tel" 
                           name="phone"
                           placeholder="Phone Number"
                           value={formData.phone}
                           onChange={handleInputChange}
                           className="w-full border-b-2 border-zinc-100 py-4 focus:border-black transition-colors outline-none text-sm font-bold uppercase tracking-widest placeholder:text-zinc-300 placeholder:font-black"
                        />
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
                        onClick={() => setPaymentMethod('ONLINE')}
                        className={`p-8 border-2 rounded-sm cursor-pointer transition-all ${
                          paymentMethod === 'ONLINE' ? 'border-black bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200 bg-white'
                        }`}
                      >
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                            <div className="flex items-center gap-5">
                               <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'ONLINE' ? 'border-black' : 'border-zinc-200'}`}>
                                  {paymentMethod === 'ONLINE' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                               </div>
                               <div className="text-left">
                                  <p className="text-[13px] font-black uppercase tracking-[0.2em] text-black">Secure Online Payment</p>
                                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Acquire via Visa, Mastercard, or PayHere gateway.</p>
                               </div>
                            </div>
                            <div className="bg-white px-4 py-2 rounded-sm border border-zinc-100">
                               <img 
                                  src="https://www.payhere.lk/downloads/images/payhere_long_banner.png" 
                                  alt="Secure Gateway" 
                                  className="h-6 object-contain grayscale hover:grayscale-0 transition-all duration-700" 
                               />
                            </div>
                         </div>
                         <p className="text-[10px] font-bold text-zinc-400 leading-[2] uppercase tracking-[0.15em] max-w-2xl text-left pl-10">
                            After clicking "Complete Purchase", you will be redirected to PayHere to complete your purchase securely.
                         </p>
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

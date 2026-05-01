import React from 'react';

const TrustSection = () => {
  const partners = [
    { name: 'Koko', logo: 'https://cdn.koko.lk/assets/images/logo.png' },
    { name: 'Mintpay', logo: 'https://mintpay.lk/wp-content/themes/mintpay/assets/images/logo.svg' },
    { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg' },
    { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' }
  ];

  return (
    <div className="border-y border-white/5 bg-surface/20 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-primary">Official Partner</span>
            <div className="flex items-center gap-4">
               {/* Installment Partners text if logos don't load */}
               <span className="font-bold text-lg">Koko.</span>
               <span className="font-bold text-lg">mintpay.</span>
            </div>
          </div>
          
          <div className="hidden lg:block h-10 w-px bg-white/10" />

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Secure Payments</span>
            <div className="flex items-center gap-6">
              <span className="font-medium text-xs">Visa</span>
              <span className="font-medium text-xs">Mastercard</span>
              <span className="font-medium text-xs">Amex</span>
            </div>
          </div>

          <div className="hidden lg:block h-10 w-px bg-white/10" />

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Islandwide Delivery</span>
            <span className="font-medium text-xs">1-3 Working Days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSection;

"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Autocomplete from 'react-google-autocomplete';

type CheckoutFormData = {
  email: string;
  subscribe: boolean;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  phone: string;
};

const SecureCheckout = () => {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<CheckoutFormData>({
    defaultValues: {
      country: 'Sri Lanka',
    }
  });

  const onSubmit = (data: CheckoutFormData) => {
    console.log("Form Submitted:", data);
    // Proceed to next step or API call
  };

  const handlePlaceSelected = (place: any) => {
    // Attempt to extract the address to fill the input visually
    if (place.formatted_address) {
      setValue('address', place.formatted_address, { shouldValidate: true });
    } else if (place.name) {
      setValue('address', place.name, { shouldValidate: true });
    }

    if (place.address_components) {
      let city = '';
      let country = '';

      place.address_components.forEach((component: any) => {
        const types = component.types;
        // The Google Places API uses "locality", "administrative_area_level_2", or "postal_town" for cities
        if (types.includes('locality') || types.includes('administrative_area_level_2')) {
          if (!city) city = component.long_name;
        }
        if (types.includes('country')) {
          country = component.long_name;
        }
      });

      if (city) {
        setValue('city', city, { shouldValidate: true });
      }
      if (country) {
        setValue('country', country, { shouldValidate: true });
      }
    }
  };

  const inputClass = "w-full bg-transparent border-b border-gray-300 text-black text-sm uppercase font-medium placeholder-gray-400 focus:outline-none focus:border-black transition-colors py-3";

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white text-black font-sans">
      <h1 className="text-3xl font-black uppercase tracking-widest text-center mb-12">Secure Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        
        {/* Section 1: Contact Information */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6 border-b border-gray-100 pb-2">1. Contact Information</h2>
          <div className="space-y-6">
            <div>
              <input 
                type="email" 
                placeholder="Email Address" 
                className={inputClass}
                {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
              />
              {errors.email && <span className="text-red-500 text-xs mt-1 block uppercase">{errors.email.message}</span>}
            </div>
            
            <label className="flex items-center space-x-3 cursor-pointer group w-fit">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-black border-gray-300 focus:ring-black accent-black cursor-pointer"
                {...register("subscribe")}
              />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide group-hover:text-black transition-colors">
                Email me with luxury collections and news
              </span>
            </label>
          </div>
        </section>

        {/* Section 2: Shipping Destination */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6 border-b border-gray-100 pb-2">2. Shipping Destination</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input 
                type="text" 
                placeholder="First Name" 
                className={inputClass}
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && <span className="text-red-500 text-xs mt-1 block uppercase">{errors.firstName.message}</span>}
            </div>

            <div>
              <input 
                type="text" 
                placeholder="Last Name" 
                className={inputClass}
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && <span className="text-red-500 text-xs mt-1 block uppercase">{errors.lastName.message}</span>}
            </div>

            <div className="md:col-span-2">
              <Controller
                name="address"
                control={control}
                rules={{ required: "Shipping address is required" }}
                render={({ field }) => (
                  <Autocomplete
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    onPlaceSelected={handlePlaceSelected}
                    options={{
                      types: ['address'],
                      componentRestrictions: { country: "lk" }
                    }}
                    placeholder="Shipping Address"
                    className={inputClass}
                    defaultValue={field.value}
                    onChange={(e: any) => field.onChange(e?.target?.value || '')}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {errors.address && <span className="text-red-500 text-xs mt-1 block uppercase">{errors.address.message}</span>}
            </div>

            <div>
              <input 
                type="text" 
                placeholder="City" 
                className={inputClass}
                {...register("city", { required: "City is required" })}
              />
              {errors.city && <span className="text-red-500 text-xs mt-1 block uppercase">{errors.city.message}</span>}
            </div>

            <div>
              <input 
                type="text" 
                placeholder="Country" 
                className={`${inputClass} bg-gray-50`}
                readOnly
                {...register("country", { required: "Country is required" })}
              />
              {errors.country && <span className="text-red-500 text-xs mt-1 block uppercase">{errors.country.message}</span>}
            </div>

            <div className="md:col-span-2">
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className={inputClass}
                {...register("phone", { required: "Phone number is required" })}
              />
              {errors.phone && <span className="text-red-500 text-xs mt-1 block uppercase">{errors.phone.message}</span>}
            </div>
          </div>
        </section>

        <div className="pt-8">
          <button 
            type="submit" 
            className="w-full bg-black text-white font-bold uppercase tracking-widest text-sm py-5 hover:bg-gray-900 transition-colors"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecureCheckout;

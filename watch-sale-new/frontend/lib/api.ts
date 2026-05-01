const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';


export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch products');

    const text = await response.text();
    if (!text) return [];

    return JSON.parse(text);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchProductById = async (id: string | number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

export const placeOrder = async (orderData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Failed to place order');
    return await response.json();
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

export const checkout = async (userId: number, paymentMethod: string, items?: any[], shippingDetails?: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${userId}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ paymentMethod, items, shippingDetails })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Checkout failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
};

export const fetchReviews = async (productId: string | number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const postReview = async (userId: number, reviewData: { productId: number, rating: number, comment: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${userId}/product/${reviewData.productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        rating: reviewData.rating,
        comment: reviewData.comment
      }),
    });
    if (!response.ok) throw new Error('Failed to post review');
    return await response.json();
  } catch (error) {
    console.error('Error posting review:', error);
    throw error;
  }
};

export const fetchWishlist = async (userId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch wishlist');
    return await response.json();
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
};

export const addToWishlistApi = async (userId: number, productId: number) => {
  const response = await fetch(`${API_BASE_URL}/wishlist/${userId}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ productId })
  });
  if (!response.ok) throw new Error('Failed to add to wishlist');
  return await response.json();
};

export const removeFromWishlistApi = async (userId: number, productId: number) => {
  const response = await fetch(`${API_BASE_URL}/wishlist/${userId}/product/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to remove from wishlist');
  return true;
};


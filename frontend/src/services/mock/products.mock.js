/**
 * Mock Product Data Adapter
 *
 * Temporary adapter for Featured Products section.
 * Interface matches the expected EP-01 API response shape.
 * Replace the getFeaturedProducts implementation when EP-01 API is ready.
 */

const MOCK_PRODUCTS = [
  {
    id: 'p001',
    name: 'Classic Black Turtleneck',
    price: 4500,
    originalPrice: 5800,
    currency: 'LKR',
    image: null, // Will use placeholder in component
    category: "Men's Fashion",
    inStock: true,
    badge: 'Best Seller',
  },
  {
    id: 'p002',
    name: 'Navy Slim Chinos',
    price: 3800,
    originalPrice: null,
    currency: 'LKR',
    image: null,
    category: "Men's Fashion",
    inStock: true,
    badge: 'New',
  },
  {
    id: 'p003',
    name: 'Signature Oud Eau de Parfum',
    price: 8500,
    originalPrice: 9500,
    currency: 'LKR',
    image: null,
    category: 'Perfumes',
    inStock: true,
    badge: 'Limited',
  },
  {
    id: 'p004',
    name: 'Urban Cargo Joggers',
    price: 2900,
    originalPrice: null,
    currency: 'LKR',
    image: null,
    category: "Boys' Fashion",
    inStock: false,
    badge: null,
  },
];

/**
 * Get featured products.
 * Replace this function with the real EP-01 API call when available.
 * @returns {Promise<Array>}
 */
export async function getFeaturedProducts() {
  // Simulate network delay in development
  await new Promise((resolve) => setTimeout(resolve, 600));
  return MOCK_PRODUCTS;
}

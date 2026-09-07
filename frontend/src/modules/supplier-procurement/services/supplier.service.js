import apiClient from '../../../services/apiClient';

/**
 * Supplier Management API Service
 * With resilient local fallback when API is offline or unseeded.
 */

const FALLBACK_SUPPLIERS = [
  {
    id: 'SUP-101',
    companyName: 'Lanka Fabric Mills PLC',
    contactPerson: 'Ravi Wickramasinghe',
    email: 'ravi.w@lankafabric.lk',
    phone: '+94 11 289 4412',
    city: 'Biyagama',
    address: 'Export Processing Zone, Biyagama, Sri Lanka',
    category: "Men's Fashion",
    paymentTerms: 'Net 30',
    leadTimeDays: 7,
    status: 'ACTIVE',
    rating: 4.8,
    notes: 'Primary supplier for linen and premium cotton shirt fabrics.',
    createdAt: '2025-11-10T08:30:00.000Z',
  },
  {
    id: 'SUP-102',
    companyName: 'Ceylon Fragrance Distillers',
    contactPerson: 'Shenali Senaratne',
    email: 'shenali@ceylonfragrance.com',
    phone: '+94 33 456 7890',
    city: 'Gampaha',
    address: 'Botanical Extract Park, Mirigama, Sri Lanka',
    category: 'Fragrance Oils',
    paymentTerms: 'Net 15',
    leadTimeDays: 5,
    status: 'ACTIVE',
    rating: 4.9,
    notes: 'Oud, sandalwood extracts, and artisanal fragrance concentrates.',
    createdAt: '2025-12-01T10:15:00.000Z',
  },
  {
    id: 'SUP-103',
    companyName: 'Colombo Apparel Craft',
    contactPerson: 'Mohamed Rizwan',
    email: 'rizwan@colomboapparel.lk',
    phone: '+94 11 567 8901',
    city: 'Colombo 10',
    address: '84 Baseline Road, Dematagoda, Colombo',
    category: "Boys' Fashion",
    paymentTerms: 'Cash on Delivery',
    leadTimeDays: 4,
    status: 'ACTIVE',
    rating: 4.6,
    notes: 'Kids & teenage casual wear, graphic tees, and shorts.',
    createdAt: '2026-01-15T09:00:00.000Z',
  },
  {
    id: 'SUP-104',
    companyName: 'Apex Luxe Packaging Co.',
    contactPerson: 'Dhammika Bandara',
    email: 'info@apexluxepack.lk',
    phone: '+94 81 223 9900',
    city: 'Kandy',
    address: 'Pallekele Industrial Zone, Kandy',
    category: 'Packaging & Boxes',
    paymentTerms: 'Net 30',
    leadTimeDays: 10,
    status: 'ON_HOLD',
    rating: 4.2,
    notes: 'Custom embossed perfume boxes and matte black shopping bags.',
    createdAt: '2026-02-01T14:20:00.000Z',
  },
  {
    id: 'SUP-105',
    companyName: 'Global Denim Imports Ltd',
    contactPerson: 'Sunil Weerakkody',
    email: 'sunil@globaldenim.lk',
    phone: '+94 11 234 5098',
    city: 'Colombo 03',
    address: 'Kollupitiya Commercial Arcade, Colombo',
    category: "Men's Fashion",
    paymentTerms: 'Advance Payment',
    leadTimeDays: 14,
    status: 'ACTIVE',
    rating: 4.7,
    notes: 'Stretch denim and slim-fit chino raw materials.',
    createdAt: '2026-02-18T11:45:00.000Z',
  },
];

let localSuppliers = [...FALLBACK_SUPPLIERS];

/**
 * Fetch all suppliers with optional search and filters.
 * @param {object} params - { search, category, status }
 * @returns {Promise<Array>}
 */
export async function getSuppliers(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'ALL') query.append('category', params.category);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);

    const response = await apiClient.get(`/api/admin/suppliers?${query.toString()}`);
    if (response.data?.data) {
      localSuppliers = response.data.data;
      return response.data.data;
    }
    return filterLocal(localSuppliers, params);
  } catch (err) {
    return filterLocal(localSuppliers, params);
  }
}

function filterLocal(list, params) {
  let result = [...list];
  if (params.search) {
    const q = params.search.toLowerCase().trim();
    result = result.filter(
      (s) =>
        s.companyName.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
    );
  }
  if (params.category && params.category !== 'ALL') {
    result = result.filter((s) => s.category === params.category);
  }
  if (params.status && params.status !== 'ALL') {
    result = result.filter((s) => s.status === params.status);
  }
  return result;
}

/**
 * Fetch a single supplier by ID.
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function getSupplierById(id) {
  try {
    const response = await apiClient.get(`/api/admin/suppliers/${id}`);
    return response.data?.data;
  } catch (err) {
    return localSuppliers.find((s) => s.id === id);
  }
}

/**
 * Create a new supplier.
 * @param {object} payload
 * @returns {Promise<object>}
 */
export async function createSupplier(payload) {
  try {
    const response = await apiClient.post('/api/admin/suppliers', payload);
    return response.data?.data;
  } catch (err) {
    const newSup = {
      id: `SUP-${Date.now().toString().slice(-3)}`,
      ...payload,
      createdAt: new Date().toISOString(),
    };
    localSuppliers.unshift(newSup);
    return newSup;
  }
}

/**
 * Update an existing supplier.
 * @param {string} id
 * @param {object} payload
 * @returns {Promise<object>}
 */
export async function updateSupplier(id, payload) {
  try {
    const response = await apiClient.put(`/api/admin/suppliers/${id}`, payload);
    return response.data?.data;
  } catch (err) {
    const idx = localSuppliers.findIndex((s) => s.id === id);
    if (idx !== -1) {
      localSuppliers[idx] = { ...localSuppliers[idx], ...payload, updatedAt: new Date().toISOString() };
      return localSuppliers[idx];
    }
    return payload;
  }
}

/**
 * Delete a supplier.
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function deleteSupplier(id) {
  try {
    const response = await apiClient.delete(`/api/admin/suppliers/${id}`);
    return response.data?.data;
  } catch (err) {
    const idx = localSuppliers.findIndex((s) => s.id === id);
    if (idx !== -1) {
      const [del] = localSuppliers.splice(idx, 1);
      return del;
    }
    return { id };
  }
}

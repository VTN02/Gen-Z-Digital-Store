'use strict';

/**
 * Supplier Management Service
 * Provides in-memory seeded vendor directory with full CRUD operations.
 */

let suppliers = [
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

let nextIdNumber = 106;

/**
 * Get all suppliers with optional search and filters.
 */
async function getAllSuppliers(filters = {}) {
  let result = [...suppliers];

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      (s) =>
        s.companyName.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
    );
  }

  if (filters.category && filters.category !== 'ALL') {
    result = result.filter((s) => s.category === filters.category);
  }

  if (filters.status && filters.status !== 'ALL') {
    result = result.filter((s) => s.status === filters.status);
  }

  return result;
}

/**
 * Get single supplier by ID.
 */
async function getSupplierById(id) {
  const supplier = suppliers.find((s) => s.id === id);
  if (!supplier) {
    const err = new Error(`Supplier with ID ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }
  return supplier;
}

/**
 * Create a new supplier profile.
 */
async function createSupplier(data) {
  const id = `SUP-${nextIdNumber++}`;

  const newSupplier = {
    id,
    companyName: data.companyName.trim(),
    contactPerson: data.contactPerson?.trim() || 'N/A',
    email: data.email?.trim() || '',
    phone: data.phone?.trim() || '',
    city: data.city?.trim() || 'Colombo',
    address: data.address?.trim() || '',
    category: data.category || "Men's Fashion",
    paymentTerms: data.paymentTerms || 'Net 30',
    leadTimeDays: Number(data.leadTimeDays) || 7,
    status: data.status || 'ACTIVE',
    rating: Number(data.rating) || 5.0,
    notes: data.notes?.trim() || '',
    createdAt: new Date().toISOString(),
  };

  suppliers.unshift(newSupplier);
  return newSupplier;
}

/**
 * Update an existing supplier.
 */
async function updateSupplier(id, data) {
  const index = suppliers.findIndex((s) => s.id === id);
  if (index === -1) {
    const err = new Error(`Supplier with ID ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }

  suppliers[index] = {
    ...suppliers[index],
    companyName: data.companyName ? data.companyName.trim() : suppliers[index].companyName,
    contactPerson: data.contactPerson !== undefined ? data.contactPerson.trim() : suppliers[index].contactPerson,
    email: data.email !== undefined ? data.email.trim() : suppliers[index].email,
    phone: data.phone !== undefined ? data.phone.trim() : suppliers[index].phone,
    city: data.city !== undefined ? data.city.trim() : suppliers[index].city,
    address: data.address !== undefined ? data.address.trim() : suppliers[index].address,
    category: data.category || suppliers[index].category,
    paymentTerms: data.paymentTerms || suppliers[index].paymentTerms,
    leadTimeDays: data.leadTimeDays !== undefined ? Number(data.leadTimeDays) : suppliers[index].leadTimeDays,
    status: data.status || suppliers[index].status,
    rating: data.rating !== undefined ? Number(data.rating) : suppliers[index].rating,
    notes: data.notes !== undefined ? data.notes.trim() : suppliers[index].notes,
    updatedAt: new Date().toISOString(),
  };

  return suppliers[index];
}

/**
 * Delete a supplier.
 */
async function deleteSupplier(id) {
  const index = suppliers.findIndex((s) => s.id === id);
  if (index === -1) {
    const err = new Error(`Supplier with ID ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }

  const [deleted] = suppliers.splice(index, 1);
  return deleted;
}

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};

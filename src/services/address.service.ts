import { Address, AddressFormData } from '../types/address.types';

// In-memory mock address store
const addressStore: Address[] = [
  {
    id: 'addr-001',
    label: 'Home',
    name: 'Rohit Sharma',
    phone: '+91 98765 43210',
    line1: '123, Park Street, Anna Nagar',
    line2: '',
    landmark: 'Near Anna Nagar Tower',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
];

let nextId = 2;

export const AddressService = {
  /**
   * Get all addresses for current user
   * Future: GET /addresses
   */
  async getAddresses(): Promise<Address[]> {
    await new Promise((r) => setTimeout(r, 500));
    return [...addressStore];
  },

  /**
   * Add new address
   * Future: POST /addresses
   */
  async addAddress(data: AddressFormData): Promise<Address> {
    await new Promise((r) => setTimeout(r, 600));

    const newAddress: Address = {
      id: `addr-${nextId++}`,
      label: data.label || 'Home',
      name: data.name,
      phone: data.phone,
      line1: data.line1,
      line2: data.line2 || '',
      landmark: data.landmark || '',
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      isDefault: addressStore.length === 0,
      createdAt: new Date().toISOString(),
    };

    addressStore.push(newAddress);
    return newAddress;
  },

  /**
   * Update existing address
   * Future: PUT /addresses/{id}
   */
  async updateAddress(id: string, data: AddressFormData): Promise<Address> {
    await new Promise((r) => setTimeout(r, 600));

    const index = addressStore.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Address not found');

    addressStore[index] = {
      ...addressStore[index],
      ...data,
      label: data.label || addressStore[index].label,
    };
    return addressStore[index];
  },

  /**
   * Delete address
   * Future: DELETE /addresses/{id}
   */
  async deleteAddress(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 400));
    const index = addressStore.findIndex((a) => a.id === id);
    if (index !== -1) {
      const wasDefault = addressStore[index].isDefault;
      addressStore.splice(index, 1);
      // If deleted default, make the first remaining address default
      if (wasDefault && addressStore.length > 0) {
        addressStore[0].isDefault = true;
      }
    }
  },

  /**
   * Set default address
   * Future: POST /addresses/{id}/set-default
   */
  async setDefault(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    addressStore.forEach((a) => {
      a.isDefault = a.id === id;
    });
  },
};

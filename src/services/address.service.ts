import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';
import { Address, AddressFormData } from '../types/address.types';

const DEFAULT_ADDRESSES: Address[] = [
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

export const AddressService = {
  /**
   * Helper to load addresses from storage, with fallback to default seed
   */
  async loadFromStorage(): Promise<Address[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.addresses);
      if (data) {
        return JSON.parse(data);
      }
      // Seed default addresses on first load
      await AsyncStorage.setItem(STORAGE_KEYS.addresses, JSON.stringify(DEFAULT_ADDRESSES));
      return [...DEFAULT_ADDRESSES];
    } catch (error) {
      console.error('[AddressService] Failed to load addresses from storage:', error);
      return [...DEFAULT_ADDRESSES];
    }
  },

  /**
   * Helper to save addresses list to storage
   */
  async saveToStorage(addresses: Address[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.addresses, JSON.stringify(addresses));
    } catch (error) {
      console.error('[AddressService] Failed to save addresses to storage:', error);
      throw error;
    }
  },

  /**
   * Get all addresses for current user
   */
  async getAddresses(): Promise<Address[]> {
    await new Promise((r) => setTimeout(r, 400));
    return this.loadFromStorage();
  },

  /**
   * Add new address
   */
  async addAddress(data: AddressFormData): Promise<Address> {
    await new Promise((r) => setTimeout(r, 500));
    const addresses = await this.loadFromStorage();

    const newAddress: Address = {
      id: `addr_${Date.now()}`,
      label: data.label || 'Home',
      name: data.name,
      phone: data.phone,
      line1: data.line1,
      line2: data.line2 || '',
      landmark: data.landmark || '',
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      isDefault: addresses.length === 0,
      createdAt: new Date().toISOString(),
    };

    addresses.push(newAddress);
    await this.saveToStorage(addresses);
    return newAddress;
  },

  /**
   * Update existing address
   */
  async updateAddress(id: string, data: AddressFormData): Promise<Address> {
    await new Promise((r) => setTimeout(r, 500));
    const addresses = await this.loadFromStorage();

    const index = addresses.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Address not found');

    addresses[index] = {
      ...addresses[index],
      ...data,
      label: data.label || addresses[index].label,
    };

    await this.saveToStorage(addresses);
    return addresses[index];
  },

  /**
   * Delete address
   */
  async deleteAddress(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 400));
    const addresses = await this.loadFromStorage();

    const index = addresses.findIndex((a) => a.id === id);
    if (index !== -1) {
      const wasDefault = addresses[index].isDefault;
      addresses.splice(index, 1);
      
      // If deleted default, make the first remaining address default
      if (wasDefault && addresses.length > 0) {
        addresses[0].isDefault = true;
      }
      
      await this.saveToStorage(addresses);
    }
  },

  /**
   * Set default address
   */
  async setDefault(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    const addresses = await this.loadFromStorage();
    
    addresses.forEach((a) => {
      a.isDefault = a.id === id;
    });

    await this.saveToStorage(addresses);
  },
};

import React, {
  createContext, useContext, useState, useEffect,
  useCallback, ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SavedAddress = {
  id: string;
  tag: 'Home' | 'Work' | 'Other';
  name: string;
  line: string;    // full address text (may include city/pincode inline)
  city: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
};

type AddressContextType = {
  addresses: SavedAddress[];
  /** The address currently selected for delivery on the home screen. */
  selectedAddress: SavedAddress | null;
  addAddress: (addr: Omit<SavedAddress, 'id'>) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setDefault: (id: string) => Promise<void>;
  /** Select which address is used for the current delivery. */
  selectAddress: (id: string) => Promise<void>;
};

const AddressContext = createContext<AddressContextType | null>(null);

const listKey = (uid: string) => `@swiftmart_addresses_${uid}`;
const selKey  = (uid: string) => `@swiftmart_selected_addr_${uid}`;

type Props = { children: ReactNode; userId: string | null };

export function AddressProvider({ children, userId }: Props) {
  const [addresses, setAddresses]         = useState<SavedAddress[]>([]);
  const [selectedId, setSelectedId]       = useState<string | null>(null);

  /* ── Load from storage whenever the logged-in user changes ──── */
  useEffect(() => {
    if (!userId) {
      setAddresses([]);
      setSelectedId(null);
      return;
    }
    Promise.all([
      AsyncStorage.getItem(listKey(userId)),
      AsyncStorage.getItem(selKey(userId)),
    ]).then(([rawList, rawSel]) => {
      const list: SavedAddress[] = rawList ? JSON.parse(rawList) : [];
      setAddresses(list);
      // Default to the saved selectedId, or the default address, or the first
      const sel = rawSel ?? list.find((a) => a.isDefault)?.id ?? list[0]?.id ?? null;
      setSelectedId(sel);
    });
  }, [userId]);

  const persist = useCallback(
    async (list: SavedAddress[], selId: string | null) => {
      if (!userId) return;
      await Promise.all([
        AsyncStorage.setItem(listKey(userId), JSON.stringify(list)),
        selId
          ? AsyncStorage.setItem(selKey(userId), selId)
          : AsyncStorage.removeItem(selKey(userId)),
      ]);
    },
    [userId],
  );

  const addAddress = useCallback(
    async (addr: Omit<SavedAddress, 'id'>) => {
      const id = Date.now().toString();
      const newAddr: SavedAddress = { ...addr, id };
      // If this is the first address or marked default, unmark others
      const updated = addr.isDefault
        ? [...addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
        : [...addresses, newAddr];
      setAddresses(updated);
      const newSel = addr.isDefault || updated.length === 1 ? id : selectedId;
      setSelectedId(newSel);
      await persist(updated, newSel);
    },
    [addresses, selectedId, persist],
  );

  const removeAddress = useCallback(
    async (id: string) => {
      const updated = addresses.filter((a) => a.id !== id);
      setAddresses(updated);
      const newSel = id === selectedId
        ? (updated.find((a) => a.isDefault)?.id ?? updated[0]?.id ?? null)
        : selectedId;
      setSelectedId(newSel);
      await persist(updated, newSel);
    },
    [addresses, selectedId, persist],
  );

  const setDefault = useCallback(
    async (id: string) => {
      const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
      setAddresses(updated);
      await persist(updated, selectedId);
    },
    [addresses, selectedId, persist],
  );

  const selectAddress = useCallback(
    async (id: string) => {
      setSelectedId(id);
      if (userId) await AsyncStorage.setItem(selKey(userId), id);
    },
    [userId],
  );

  const selectedAddress = addresses.find((a) => a.id === selectedId) ?? null;

  return (
    <AddressContext.Provider
      value={{ addresses, selectedAddress, addAddress, removeAddress, setDefault, selectAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error('useAddresses must be used inside AddressProvider');
  return ctx;
}

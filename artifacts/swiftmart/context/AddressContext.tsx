import React, {
  createContext, useContext, useState, useEffect,
  useCallback, useRef, ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SavedAddress = {
  id: string;
  tag: 'Home' | 'Work' | 'Other';
  name: string;
  line: string;
  city: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
};

type AddressContextType = {
  addresses: SavedAddress[];
  selectedAddress: SavedAddress | null;
  reload: () => Promise<void>;
  addAddress: (addr: Omit<SavedAddress, 'id'>) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setDefault: (id: string) => Promise<void>;
  selectAddress: (id: string) => Promise<void>;
};

const AddressContext = createContext<AddressContextType | null>(null);

const listKey = (uid: string) => `@swiftmart_addresses_${uid}`;
const selKey  = (uid: string) => `@swiftmart_selected_addr_${uid}`;

type Props = { children: ReactNode; userId: string | null };

export function AddressProvider({ children, userId }: Props) {
  const [addresses,  setAddresses]  = useState<SavedAddress[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Refs so callbacks always read the *current* value, never a stale closure.
  const userIdRef    = useRef<string | null>(userId);
  const addressesRef = useRef<SavedAddress[]>([]);
  const selectedRef  = useRef<string | null>(null);

  useEffect(() => { userIdRef.current    = userId; },    [userId]);
  useEffect(() => { addressesRef.current = addresses; }, [addresses]);
  useEffect(() => { selectedRef.current  = selectedId; },[selectedId]);

  /* ── Load / reload from AsyncStorage ──────────────────────────── */
  const reload = useCallback(async () => {
    const uid = userIdRef.current;
    if (!uid) { setAddresses([]); setSelectedId(null); return; }
    const [rawList, rawSel] = await Promise.all([
      AsyncStorage.getItem(listKey(uid)),
      AsyncStorage.getItem(selKey(uid)),
    ]);
    const list: SavedAddress[] = rawList ? JSON.parse(rawList) : [];
    setAddresses(list);
    const sel = rawSel ?? list.find((a) => a.isDefault)?.id ?? list[0]?.id ?? null;
    setSelectedId(sel);
  }, []); // stable — always reads via ref

  useEffect(() => { reload(); }, [userId]); // re-load when user changes

  /* ── Persist helpers (always uses ref, never stale) ───────────── */
  const persist = useCallback(async (list: SavedAddress[], selId: string | null) => {
    const uid = userIdRef.current;
    if (!uid) return;
    await Promise.all([
      AsyncStorage.setItem(listKey(uid), JSON.stringify(list)),
      selId
        ? AsyncStorage.setItem(selKey(uid), selId)
        : AsyncStorage.removeItem(selKey(uid)),
    ]);
  }, []); // stable

  /* ── Public API ────────────────────────────────────────────────── */
  const addAddress = useCallback(async (addr: Omit<SavedAddress, 'id'>) => {
    const id      = Date.now().toString();
    const newAddr = { ...addr, id };
    const current = addressesRef.current;
    const updated = addr.isDefault
      ? [...current.map((a) => ({ ...a, isDefault: false })), newAddr]
      : [...current, newAddr];
    const newSel  = addr.isDefault || updated.length === 1 ? id : selectedRef.current;
    setAddresses(updated);
    setSelectedId(newSel);
    await persist(updated, newSel);
  }, [persist]); // stable — reads addresses/selectedId via refs

  const removeAddress = useCallback(async (id: string) => {
    const updated = addressesRef.current.filter((a) => a.id !== id);
    const curSel  = selectedRef.current;
    const newSel  = id === curSel
      ? (updated.find((a) => a.isDefault)?.id ?? updated[0]?.id ?? null)
      : curSel;
    setAddresses(updated);
    setSelectedId(newSel);
    await persist(updated, newSel);
  }, [persist]);

  const setDefault = useCallback(async (id: string) => {
    const updated = addressesRef.current.map((a) => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    await persist(updated, selectedRef.current);
  }, [persist]);

  const selectAddress = useCallback(async (id: string) => {
    setSelectedId(id);
    const uid = userIdRef.current;
    if (uid) await AsyncStorage.setItem(selKey(uid), id);
  }, []);

  const selectedAddress = addresses.find((a) => a.id === selectedId) ?? null;

  return (
    <AddressContext.Provider
      value={{ addresses, selectedAddress, reload, addAddress, removeAddress, setDefault, selectAddress }}
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

import type { PaymentMode, Role } from "@/constants";

export type Shop = {
  id: string;
  shop_name: string;
  phone_number: string;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Garment = {
  id: string;
  garment_name: string;
  default_rate: number;
};

export type ShopGarmentRate = {
  id: string;
  shop_id: string;
  garment_id: string;
  rate: number;
};

export type WorkEntry = {
  id: string;
  shop_id: string;
  work_date: string;
  remarks: string | null;
  created_by: string | null;
  created_at: string;
};

export type WorkEntryItem = {
  id: string;
  work_entry_id: string;
  garment_id: string | null;
  garment_name: string;
  quantity: number;
  rate: number;
  amount: number;
};

export type Invoice = {
  id: string;
  shop_id: string;
  invoice_number: string;
  invoice_date: string;
  date_from: string;
  date_to: string;
  subtotal: number;
  previous_balance: number;
  credit_applied: number;
  total_due: number;
  created_at: string;
};

export type InvoiceItem = {
  id: string;
  invoice_id: string;
  work_entry_item_id: string | null;
  work_date: string;
  garment_name: string;
  quantity: number;
  rate: number;
  amount: number;
};

export type Payment = {
  id: string;
  shop_id: string;
  amount: number;
  payment_mode: PaymentMode;
  remarks: string | null;
  payment_date: string;
  created_at: string;
};

export type LedgerEntry = {
  id: string;
  shop_id: string;
  entry_date: string;
  description: string;
  debit: number;
  credit: number;
  source_type: string;
  source_id: string | null;
  created_at: string;
};

export type AdhocReceipt = {
  id: string;
  customer_name: string;
  phone: string | null;
  work_description: string;
  amount: number;
  receipt_date: string;
  created_at: string;
};

export type Profile = {
  user_id: string;
  role: Role;
  full_name: string | null;
};

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Medicine {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
  minStockLevel: number;
  description: string;
  status: 'Available' | 'Low Stock' | 'Out of Stock' | 'Expired';
}

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  medicines: {
    medicineId: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
  }[];
  status: 'Pending' | 'Dispensed' | 'Partially Dispensed';
  prescriptionDate: string;
  dispensedDate?: string;
  totalAmount: number;
}

interface PharmacyState {
  medicines: Medicine[];
  prescriptions: Prescription[];
  loading: boolean;
  error: string | null;
}

const initialState: PharmacyState = {
  medicines: [],
  prescriptions: [],
  loading: false,
  error: null,
};

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState,
  reducers: {
    setMedicines: (state, action: PayloadAction<Medicine[]>) => {
      state.medicines = action.payload;
    },
    addMedicine: (state, action: PayloadAction<Medicine>) => {
      state.medicines.push(action.payload);
    },
    updateMedicine: (state, action: PayloadAction<Medicine>) => {
      const index = state.medicines.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.medicines[index] = action.payload;
      }
    },
    setPrescriptions: (state, action: PayloadAction<Prescription[]>) => {
      state.prescriptions = action.payload;
    },
    addPrescription: (state, action: PayloadAction<Prescription>) => {
      state.prescriptions.push(action.payload);
    },
    updatePrescription: (state, action: PayloadAction<Prescription>) => {
      const index = state.prescriptions.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.prescriptions[index] = action.payload;
      }
    },
    deleteMedicine: (state, action: PayloadAction<string>) => {
      state.medicines = state.medicines.filter(m => m.id !== action.payload);
    },
    deletePrescription: (state, action: PayloadAction<string>) => {
      state.prescriptions = state.prescriptions.filter(p => p.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setMedicines, 
  addMedicine, 
  updateMedicine, 
  deleteMedicine,
  setPrescriptions, 
  addPrescription, 
  updatePrescription, 
  deletePrescription,
  setLoading, 
  setError 
} = pharmacySlice.actions;
export default pharmacySlice.reducer;
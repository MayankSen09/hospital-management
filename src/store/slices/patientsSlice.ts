import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Patient {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  bloodGroup: string;
  admissionDate?: string;
  status: 'Active' | 'Discharged' | 'Admitted';
}

interface PatientsState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
}

const initialState: PatientsState = {
  patients: [],
  loading: false,
  error: null,
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload;
    },
    addPatient: (state, action: PayloadAction<Patient>) => {
      state.patients.push(action.payload);
    },
    updatePatient: (state, action: PayloadAction<Patient>) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    },
    deletePatient: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter(p => p.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setPatients, addPatient, updatePatient, deletePatient, setLoading, setError } = patientsSlice.actions;
export default patientsSlice.reducer;
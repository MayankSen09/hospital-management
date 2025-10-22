import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  phone: string;
  email: string;
  department: string;
  consultationFee: number;
  availability: string[];
  status: 'Active' | 'On Leave' | 'Unavailable';
}

interface DoctorsState {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
}

const initialState: DoctorsState = {
  doctors: [],
  loading: false,
  error: null,
};

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setDoctors: (state, action: PayloadAction<Doctor[]>) => {
      state.doctors = action.payload;
    },
    addDoctor: (state, action: PayloadAction<Doctor>) => {
      state.doctors.push(action.payload);
    },
    updateDoctor: (state, action: PayloadAction<Doctor>) => {
      const index = state.doctors.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.doctors[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setDoctors, addDoctor, updateDoctor, setLoading, setError } = doctorsSlice.actions;
export default doctorsSlice.reducer;
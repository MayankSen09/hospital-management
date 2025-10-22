import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import patientsSlice from './slices/patientsSlice';
import appointmentsSlice from './slices/appointmentsSlice';
import doctorsSlice from './slices/doctorsSlice';
import pharmacySlice from './slices/pharmacySlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    patients: patientsSlice,
    appointments: appointmentsSlice,
    doctors: doctorsSlice,
    pharmacy: pharmacySlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
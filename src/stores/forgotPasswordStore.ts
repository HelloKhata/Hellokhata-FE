import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ForgotPasswordState {
  phone: string;
  otp: string;
  setForgotPasswordInfo: (phone: string, otp: string) => void;
  clearForgotPasswordInfo: () => void;
}

export const useForgotPasswordStore = create<ForgotPasswordState>()(
  persist(
    (set) => ({
      phone: '',
      otp: '',
      setForgotPasswordInfo: (phone, otp) => set({ phone, otp }),
      clearForgotPasswordInfo: () => set({ phone: '', otp: '' }),
    }),
    {
      name: 'hello-khata-forgot-password',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

import { create } from "zustand";

type RegistrationState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  setAll: (v: Partial<RegistrationState>) => void;
  reset: () => void;
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  setAll: (v) => set((s) => ({ ...s, ...v })),
  reset: () =>
    set({ username: "", email: "", password: "", confirmPassword: "" }),
}));

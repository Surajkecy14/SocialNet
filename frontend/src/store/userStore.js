import { create } from 'zustand';
import axios from 'axios';

const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/profile`, {
        withCredentials: true,
      });
      set({ user: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Unauthorized", loading: false });
      set({ user: null });
    }
  },

  logout: async () => {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, {
      withCredentials: true,
    });
    set({ user: null });
  }
}));

export default useUserStore;

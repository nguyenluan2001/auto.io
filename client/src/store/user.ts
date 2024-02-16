import { Edge } from 'reactflow';
import { create } from 'zustand';
import { generateNode } from '@/utils/generateNode';

const initialState = {
  currentUser: null,
};
const useUser = create((set, get) => ({
  ...initialState,
  reset: () => {
    set(initialState);
  },
  setCurrentUser: (currentUser: any) =>
    set((state: any) => {
      return { currentUser };
    }),
}));
export { useUser };

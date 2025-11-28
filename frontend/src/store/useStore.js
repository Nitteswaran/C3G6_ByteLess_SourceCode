import { create } from 'zustand'

const useStore = create((set) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),

  // Tracking state
  isTracking: false,
  currentLocation: null,
  route: [],
  setIsTracking: (isTracking) => set({ isTracking }),
  setCurrentLocation: (location) => set({ currentLocation: location }),
  addRoutePoint: (point) => set((state) => ({
    route: [...state.route, point]
  })),
  clearRoute: () => set({ route: [] }),

  // Emergency state
  emergencyActive: false,
  setEmergencyActive: (active) => set({ emergencyActive: active }),

  // Socket connection
  socket: null,
  setSocket: (socket) => set({ socket }),
}))

export default useStore


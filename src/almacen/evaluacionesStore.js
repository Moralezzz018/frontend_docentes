import { create } from 'zustand'

export const useEvaluacionesStore = create((set) => ({
  evaluaciones: [],
  evaluacionActual: null,
  filtros: {
    claseId: null,
    parcialId: null,
    periodoId: null,
  },

  setEvaluaciones: (evaluaciones) => set({ evaluaciones }),
  
  setEvaluacionActual: (evaluacion) => set({ evaluacionActual: evaluacion }),
  
  setFiltros: (filtros) => set({ filtros }),
  
  agregarEvaluacion: (evaluacion) =>
    set((state) => ({
      evaluaciones: [...state.evaluaciones, evaluacion],
    })),
  
  actualizarEvaluacion: (id, data) =>
    set((state) => ({
      evaluaciones: state.evaluaciones.map((ev) =>
        ev.id === id ? { ...ev, ...data } : ev
      ),
    })),
  
  eliminarEvaluacion: (id) =>
    set((state) => ({
      evaluaciones: state.evaluaciones.filter((ev) => ev.id !== id),
    })),
}))

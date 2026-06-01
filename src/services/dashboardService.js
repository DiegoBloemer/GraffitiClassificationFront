import { API_BASE_URL } from "./api.js";

export const dashboardService = {
  async getSummary() {
    const response = await fetch(`${API_BASE_URL}/api/Dashboard/summary`);
    if (!response.ok) throw new Error('Erro ao buscar resumo do dashboard');
    return response.json();
  },

  async getGraffitisByGang() {
    const response = await fetch(`${API_BASE_URL}/api/Dashboard/graffitis-by-gang`);
    if (!response.ok) throw new Error('Erro ao buscar pichações por facção');
    return response.json();
  },

  async getGraffitisByState() {
    const response = await fetch(`${API_BASE_URL}/api/Dashboard/graffitis-by-state`);
    if (!response.ok) throw new Error('Erro ao buscar pichações por estado');
    return response.json();
  },

  async getGraffitisByGangAndState() {
    const response = await fetch(`${API_BASE_URL}/api/Dashboard/graffitis-by-gang-and-state`);
    if (!response.ok) throw new Error('Erro ao buscar pichações por estado e facção');
    return response.json();
  }
};

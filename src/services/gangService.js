import { API_BASE_URL } from "./api.js";


export const gangService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/api/gangs`);
    if (!response.ok) throw new Error('Erro ao buscar facções');
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/api/gangs/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar facção');
    return response.json();
  },

  async create(gang) {
    const response = await fetch(`${API_BASE_URL}/api/gangs/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gang)
    });
    if (!response.ok) throw new Error('Erro ao criar facção');
    return response.json();
  },

  async update(id, gang) {
    const response = await fetch(`${API_BASE_URL}/api/gangs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...gang, id })
    });
    if (!response.ok) throw new Error('Erro ao atualizar facção');
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/api/gangs/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Não é possível excluir facção com pichações vinculadas');
      }
      throw new Error('Erro ao excluir facção');
    }
  }
};

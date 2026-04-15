const API_URL = 'http://localhost:5219/api/graffitis';

export const graffitiService = {
  async getAll() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar pichações');
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar pichação');
    return response.json();
  },

  async create(formData) {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Erro ao criar pichação');
    return response.json();
  },

  async update(id, graffiti) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...graffiti, id })
    });
    if (!response.ok) throw new Error('Erro ao atualizar pichação');
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao excluir pichação');
  }
};

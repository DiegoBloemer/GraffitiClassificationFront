import { API_BASE_URL } from "./api.js";

const extractApiErrorMessage = (data) => {
  if (!data || typeof data !== 'object') {
    return '';
  }

  let message = typeof data.message === 'string' ? data.message : '';
  const errors = data.errors;

  if (errors && typeof errors === 'object') {
    const errorMessages = Object.values(errors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value) => typeof value === 'string' && value.trim().length > 0);

    if (errorMessages.length > 0) {
      message = message ? `${message} ${errorMessages.join(' ')}` : errorMessages.join(' ');
    }
  }

  return message;
};

const buildApiError = async (response, fallbackMessage) => {
  let message = fallbackMessage;

  try {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      const apiMessage = extractApiErrorMessage(data);
      if (apiMessage) {
        message = apiMessage;
      }
    } else {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }
  } catch {
    // Fallback to the default message when parsing fails.
  }

  return new Error(message);
};

export const graffitiService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/api/graffitis`);
    if (!response.ok) throw await buildApiError(response, 'Erro ao buscar pichações');
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/api/graffitis/${id}`);
    if (!response.ok) throw await buildApiError(response, 'Erro ao buscar pichação');
    return response.json();
  },

  async create(formData) {
    const response = await fetch(`${API_BASE_URL}/api/graffitis`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw await buildApiError(response, 'Erro ao criar pichação');
    return response.json();
  },

async update(id, formData) {
    if (!formData.has('id')) {
      formData.append('id', id);
    }

    const response = await fetch(`${API_BASE_URL}/api/graffitis/${id}`, {
      method: 'PUT',
      body: formData // Passamos o FormData diretamente
    });
    
    if (!response.ok) throw await buildApiError(response, 'Erro ao atualizar pichação');
    return response.json();
  },
  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/api/graffitis/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw await buildApiError(response, 'Erro ao excluir pichação');
  }
};

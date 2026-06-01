import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Save } from 'lucide-react';

export function GangFormModal({ isOpen, onClose, onSave, gang }) {
  const [formData, setFormData] = useState({ name: '', acronym: '', origin: '' });

  useEffect(() => {
    if (gang) {
      setFormData({ name: gang.name, acronym: gang.acronym, origin: gang.origin || '' });
    } else {
      setFormData({ name: '', acronym: '', origin: '' });
    }
  }, [gang, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={gang ? 'Editar Facção' : 'Nova Facção'} size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <input
            type="text"
            required
            maxLength={100}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sigla *</label>
          <input
            type="text"
            required
            maxLength={10}
            value={formData.acronym}
            onChange={(e) => setFormData({ ...formData, acronym: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Origem</label>
          <input
            type="text"
            maxLength={2}
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3 justify-end pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
            Cancelar
          </button>
          <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Save className="w-4 h-4" />
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}

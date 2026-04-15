import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Save, Upload } from 'lucide-react';
import { gangService } from '../../services/gangService';

export function GraffitiFormModal({ isOpen, onClose, onSave }) {
  const [gangs, setGangs] = useState([]);
  const [formData, setFormData] = useState({
    visualDescription: '',
    threatLevel: 'Low',
    gangId: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
    lat: '',
    lon: '',
    image: null
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadGangs();
      setFormData({
        visualDescription: '',
        threatLevel: 'Low',
        gangId: '',
        street: '',
        neighborhood: '',
        city: '',
        state: '',
        lat: '',
        lon: '',
        image: null
      });
      setPreview(null);
    }
  }, [isOpen]);

  const loadGangs = async () => {
    try {
      const data = await gangService.getAll();
      setGangs(data);
    } catch (error) {
      console.error('Erro ao carregar facções:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('visualDescription', formData.visualDescription);
    data.append('threatLevel', formData.threatLevel);
    data.append('gangId', formData.gangId);
    data.append('street', formData.street);
    data.append('neighborhood', formData.neighborhood);
    data.append('city', formData.city);
    data.append('state', formData.state);
    data.append('lat', formData.lat);
    data.append('lon', formData.lon);
    if (formData.image) {
      data.append('image', formData.image);
    }
    onSave(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Pichação" size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Visual *</label>
            <textarea
              required
              rows={3}
              value={formData.visualDescription}
              onChange={(e) => setFormData({ ...formData, visualDescription: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Ameaça *</label>
            <select
              required
              value={formData.threatLevel}
              onChange={(e) => setFormData({ ...formData, threatLevel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="Low">Baixo</option>
              <option value="Medium">Médio</option>
              <option value="High">Alto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facção *</label>
            <select
              required
              value={formData.gangId}
              onChange={(e) => setFormData({ ...formData, gangId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="">Selecione...</option>
              {gangs.map((gang) => (
                <option key={gang.id} value={gang.id}>
                  {gang.name} ({gang.acronym})
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagem</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Selecionar Imagem
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {preview && <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded-lg border" />}
            </div>
          </div>

          <div className="col-span-2 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Localização</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rua *</label>
            <input
              type="text"
              required
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
            <input
              type="text"
              required
              value={formData.neighborhood}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
            <input
              type="text"
              required
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
            <input
              type="number"
              step="any"
              required
              value={formData.lat}
              onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
            <input
              type="number"
              step="any"
              required
              value={formData.lon}
              onChange={(e) => setFormData({ ...formData, lon: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
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

import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { MapPin, Calendar, AlertTriangle, Users, Save, Pencil } from 'lucide-react';
import { gangService } from '../../services/gangService';

export function GraffitiDetailModal({ isOpen, onClose, graffiti, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [gangs, setGangs] = useState([]);
  const [formData, setFormData] = useState({
    visualDescription: '',
    threatLevel: '',
    gangId: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
    lat: '',
    lon: ''
  });

  const COORDINATE_PATTERN = /^-?\d*(?:[.,]\d*)?$/;

  const toInputValue = (value) => {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value);
  };

  const isCoordinateValueAllowed = (value, min, max) => {
    if (value === '' || value === '-' || value === '.' || value === '-.' || value === ',') {
      return true;
    }

    if (!COORDINATE_PATTERN.test(value)) {
      return false;
    }

    const numericValue = Number(value.replace(',', '.'));
    if (Number.isNaN(numericValue)) {
      return false;
    }

    return numericValue >= min && numericValue <= max;
  };

  const handleCoordinateChange = (key, value, min, max) => {
    if (isCoordinateValueAllowed(value, min, max)) {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const parseCoordinateValue = (value, min, max) => {
    if (value === '' || value === '-' || value === '.' || value === '-.' || value === ',') {
      return null;
    }

    const numericValue = Number(String(value).replace(',', '.'));
    if (Number.isNaN(numericValue)) {
      return null;
    }

    if (numericValue < min || numericValue > max) {
      return null;
    }

    return numericValue;
  };

  useEffect(() => {
    if (graffiti && isOpen) {
      setFormData({
        visualDescription: graffiti.visualDescription,
        threatLevel: graffiti.threatLevel,
        gangId: graffiti.gangId,
        street: graffiti.location?.street || '',
        neighborhood: graffiti.location?.neighborhood || '',
        city: graffiti.location?.city || '',
        state: graffiti.location?.state || '',
        lat: toInputValue(graffiti.location?.lat),
        lon: toInputValue(graffiti.location?.lon)
      });
      setIsEditing(false);
      loadGangs();
    }
  }, [graffiti, isOpen]);

  const loadGangs = async () => {
    try {
      const data = await gangService.getAll();
      setGangs(data);
    } catch (error) {
      console.error('Erro ao carregar facções:', error);
    }
  };

  const handleSave = () => {
    const latValue = parseCoordinateValue(formData.lat, -90, 90);
    const lonValue = parseCoordinateValue(formData.lon, -180, 180);

    onUpdate({
      ...formData,
      lat: latValue ?? graffiti.location?.lat ?? 0,
      lon: lonValue ?? graffiti.location?.lon ?? 0
    });
    setIsEditing(false);
  };

  if (!graffiti) return null;

  const threatColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800'
  };

  const threatLabels = {
    Low: 'Baixo',
    Medium: 'Médio',
    High: 'Alto'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalhes da Pichação" size="md">
      {/* Conteúdo com rolagem */}
      <div className="flex flex-col gap-6">
        {graffiti.imagePath ? (
          <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden shrink-0">
            <img
              src={graffiti.imagePath}
              alt="Pichação"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                console.error('Erro ao carregar imagem do MinIO:', graffiti.imagePath);
              }}
            />
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Visual</label>
            {isEditing ? (
              <textarea
                rows={3}
                value={formData.visualDescription}
                onChange={(e) => setFormData({ ...formData, visualDescription: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{graffiti.visualDescription}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Ameaça</label>
            {isEditing ? (
              <select
                value={formData.threatLevel}
                onChange={(e) => setFormData({ ...formData, threatLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="Low">Baixo</option>
                <option value="Medium">Médio</option>
                <option value="High">Alto</option>
              </select>
            ) : (
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span className={`px-2 py-1 rounded text-xs font-medium ${threatColors[graffiti.threatLevel]}`}>
                  {threatLabels[graffiti.threatLevel]}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facção</label>
            {isEditing ? (
              <select
                value={formData.gangId}
                onChange={(e) => setFormData({ ...formData, gangId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                {gangs.map((gang) => (
                  <option key={gang.id} value={gang.id}>
                    {gang.name} ({gang.acronym})
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-gray-900">{graffiti.gangName} ({graffiti.gangAcronym})</span>
              </div>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Registro</label>
            <div className="flex items-center gap-2 text-gray-900">
              <Calendar className="w-4 h-4" />
              {new Date(graffiti.registeredAt).toLocaleString('pt-BR')}
            </div>
          </div>

          {graffiti.location && (
            <>
              <div className="col-span-2 border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Localização
                </h3>
              </div>

              {/* Rua */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Rua das Flores, 123"
                  />
                ) : (
                  <p className="text-gray-900">{graffiti.location.street}</p>
                )}
              </div>

              {/* Bairro */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Centro"
                  />
                ) : (
                  <p className="text-gray-900">{graffiti.location.neighborhood}</p>
                )}
              </div>

              {/* Cidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Florianópolis"
                  />
                ) : (
                  <p className="text-gray-900">{graffiti.location.city}</p>
                )}
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: SC"
                    maxLength={2}
                  />
                ) : (
                  <p className="text-gray-900">{graffiti.location.state}</p>
                )}
              </div>

              {/* Latitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                {isEditing ? (
                  <input
                    type="text"
                    inputMode="decimal"
                    value={formData.lat}
                    onChange={(e) => handleCoordinateChange('lat', e.target.value, -90, 90)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: -27.5954"
                  />
                ) : (
                  <p className="text-gray-900">{graffiti.location.lat}</p>
                )}
              </div>

              {/* Longitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                {isEditing ? (
                  <input
                    type="text"
                    inputMode="decimal"
                    value={formData.lon}
                    onChange={(e) => handleCoordinateChange('lon', e.target.value, -180, 180)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: -48.5480"
                  />
                ) : (
                  <p className="text-gray-900">{graffiti.location.lon}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Botões de ação - dentro da área de rolagem mas com espaçamento */}
        <div className="flex gap-3 justify-end pt-4 border-t mt-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Salvar Alterações
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              Editar
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

import { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin, AlertTriangle, Filter, X } from 'lucide-react';
import { graffitiService } from '../../services/graffitiService';
import { useToast } from '../../hooks/useToast';
import { GraffitiFormModal } from './GraffitiFormModal';
import { GraffitiDetailModal } from './GraffitiDetailModal';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export function GraffitisPage() {
  const [graffitis, setGraffitis] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGraffiti, setSelectedGraffiti] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterGang, setFilterGang] = useState('');
  const [filterThreat, setFilterThreat] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const toast = useToast();

  useEffect(() => {
    loadGraffitis();
  }, []);

  const loadGraffitis = async () => {
    try {
      const data = await graffitiService.getAll();
      setGraffitis(data);
    } catch (error) {
      toast.error('Erro ao carregar pichações');
    }
  };

  const handleCreate = async (formData) => {
    try {
      await graffitiService.create(formData);
      toast.success('Pichação cadastrada com sucesso!');
      setIsFormOpen(false);
      loadGraffitis();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await graffitiService.update(selectedGraffiti.id, {
        ...formData,
        registeredAt: selectedGraffiti.registeredAt
      });
      toast.success('Pichação atualizada com sucesso!');
      setIsDetailOpen(false);
      setSelectedGraffiti(null);
      loadGraffitis();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await graffitiService.delete(selectedGraffiti.id);
      toast.success('Pichação excluída com sucesso!');
      setIsDeleteOpen(false);
      setSelectedGraffiti(null);
      loadGraffitis();
    } catch (error) {
      toast.error(error.message);
    }
  };

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

  const normalizeText = (text) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const uniqueGangs = [...new Set(graffitis.map(g => g.gangName))].sort();

  const pichacoesFiltradas = graffitis.filter(graffiti => {
    const matchSearch = searchText === '' || 
      normalizeText(graffiti.visualDescription).includes(normalizeText(searchText)) ||
      normalizeText(graffiti.gangName).includes(normalizeText(searchText));
    
    const matchGang = filterGang === '' || graffiti.gangName === filterGang;
    
    const matchThreat = filterThreat === '' || graffiti.threatLevel === filterThreat;
    
    const matchDate = filterDate === '' || 
      new Date(graffiti.registeredAt).toISOString().split('T')[0] >= filterDate;
    
    const matchLocation = filterLocation === '' || 
      (graffiti.location && (
        normalizeText(graffiti.location.street || '').includes(normalizeText(filterLocation)) ||
        normalizeText(graffiti.location.neighborhood || '').includes(normalizeText(filterLocation))
      ));
    
    return matchSearch && matchGang && matchThreat && matchDate && matchLocation;
  });

  const clearFilters = () => {
    setSearchText('');
    setFilterGang('');
    setFilterThreat('');
    setFilterDate('');
    setFilterLocation('');
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Pichações Registradas</h1>
        <p className="text-gray-600 mt-1">Visualize e gerencie as pichações cadastradas no sistema</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por descrição ou facção..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nova Pichação
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facção</label>
                <select
                  value={filterGang}
                  onChange={(e) => setFilterGang(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">Todas</option>
                  {uniqueGangs.map(gang => (
                    <option key={gang} value={gang}>{gang}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Ameaça</label>
                <select
                  value={filterThreat}
                  onChange={(e) => setFilterThreat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">Todos</option>
                  <option value="Low">Baixo</option>
                  <option value="Medium">Médio</option>
                  <option value="High">Alto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data (a partir de)</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                <input
                  type="text"
                  placeholder="Rua ou bairro..."
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
                Limpar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pichacoesFiltradas.map((graffiti) => (
          <div key={graffiti.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
            <div
              className="h-48 bg-gray-100 cursor-pointer"
              onClick={() => { setSelectedGraffiti(graffiti); setIsDetailOpen(true); }}
            >
              {graffiti.imagePath ? (
                <img
                  src={`http://localhost:5219${graffiti.imagePath}`}
                  alt="Pichação"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Sem imagem
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1">
                  {graffiti.visualDescription}
                </h3>
                <button
                  onClick={() => { setSelectedGraffiti(graffiti); setIsDeleteOpen(true); }}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-gray-400" />
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${threatColors[graffiti.threatLevel]}`}>
                  {threatLabels[graffiti.threatLevel]}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">{graffiti.gangName}</span> ({graffiti.gangAcronym})
              </div>

              {graffiti.location && (
                <div className="flex items-start gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    {graffiti.location.neighborhood}, {graffiti.location.city}
                  </span>
                </div>
              )}

              <button
                onClick={() => { setSelectedGraffiti(graffiti); setIsDetailOpen(true); }}
                className="mt-3 w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {pichacoesFiltradas.length === 0 && graffitis.length > 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhuma pichação encontrada com os filtros aplicados
        </div>
      )}

      {graffitis.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhuma pichação cadastrada
        </div>
      )}

      <GraffitiFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleCreate}
      />

      <GraffitiDetailModal
        isOpen={isDetailOpen}
        onClose={() => { setIsDetailOpen(false); setSelectedGraffiti(null); }}
        graffiti={selectedGraffiti}
        onUpdate={handleUpdate}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setSelectedGraffiti(null); }}
        onConfirm={handleDelete}
        title="Excluir Pichação"
        message="Tem certeza que deseja excluir esta pichação? Esta ação não pode ser desfeita."
        confirmText="Excluir"
      />
    </div>
  );
}

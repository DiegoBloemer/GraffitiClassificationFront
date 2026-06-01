import { useState, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { gangService } from '../../services/gangService';
import { useToast } from '../../hooks/useToast';
import { GangFormModal } from './GangFormModal';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export function GangsPage() {
  const [gangs, setGangs] = useState([]);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGang, setSelectedGang] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadGangs();
  }, []);

  const filteredGangs = useMemo(() =>
      gangs.filter(g =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.acronym.toLowerCase().includes(search.toLowerCase())
     ),
  [gangs, search]);

  const loadGangs = async () => {
    try {
      const data = await gangService.getAll();
      setGangs(data);
    } catch (error) {
      toast.error('Erro ao carregar facções');
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedGang) {
        await gangService.update(selectedGang.id, formData);
        toast.success('Facção atualizada com sucesso!');
      } else {
        await gangService.create(formData);
        toast.success('Facção criada com sucesso!');
      }
      setIsFormOpen(false);
      setSelectedGang(null);
      loadGangs();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await gangService.delete(selectedGang.id);
      toast.success('Facção excluída com sucesso!');
      setIsDeleteOpen(false);
      setSelectedGang(null);
      loadGangs();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestão de Facções</h1>
        <p className="text-gray-600 mt-1">Gerencie as facções criminosas cadastradas no sistema</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou sigla..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => { setSelectedGang(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nova Facção
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sigla</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origem</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredGangs.map((gang) => (
                <tr key={gang.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{gang.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{gang.acronym}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{gang.origin || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => { setSelectedGang(gang); setIsFormOpen(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setSelectedGang(gang); setIsDeleteOpen(true); }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredGangs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {search ? 'Nenhuma facção encontrada' : 'Nenhuma facção cadastrada'}
            </div>
          )}
        </div>
      </div>

      <GangFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setSelectedGang(null); }}
        onSave={handleSave}
        gang={selectedGang}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setSelectedGang(null); }}
        onConfirm={handleDelete}
        title="Excluir Facção"
        message={`Tem certeza que deseja excluir a facção "${selectedGang?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
      />
    </div>
  );
}

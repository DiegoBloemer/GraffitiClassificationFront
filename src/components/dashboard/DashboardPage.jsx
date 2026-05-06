import { useState, useEffect } from 'react';
import { BarChart2, Users, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../../services/dashboardService';
import { useToast } from '../../hooks/useToast';

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [graffitisByGang, setGraffitisByGang] = useState([]);
  const [graffitisByState, setGraffitisByState] = useState([]);
  const [graffitisByGangAndState, setGraffitisByGangAndState] = useState([]);
  const toast = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryData, byGang, byState, byGangAndState] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getGraffitisByGang(),
        dashboardService.getGraffitisByState(),
        dashboardService.getGraffitisByGangAndState()
      ]);

      setSummary(summaryData);
      setGraffitisByGang(byGang);
      setGraffitisByState(byState);
      
      // Transformar dados para formato do Recharts
      const transformed = byGangAndState.map(item => ({
        state: item.state,
        ...item.gangCounts
      }));
      setGraffitisByGangAndState(transformed);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cores para os gráficos
  const GANG_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  
  const THREAT_COLORS = {
    Low: '#10b981',
    Medium: '#f59e0b',
    High: '#ef4444',
    'N/A': '#6b7280'
  };

  // Obter todas as facções únicas para o gráfico empilhado
  const allGangs = [...new Set(graffitisByGangAndState.flatMap(item => 
    Object.keys(item).filter(key => key !== 'state')
  ))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <BarChart2 className="w-8 h-8 text-blue-600" />
          Dashboard Analítico
        </h1>
        <p className="text-gray-600 mt-1">Visão geral e estatísticas do sistema de classificação</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total de Pichações */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Pichações</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summary?.totalGraffitis || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total de Facções */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Facções Mapeadas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summary?.totalGangs || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Nível Predominante */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nível Predominante</p>
              <p className="text-3xl font-bold mt-2" style={{ color: THREAT_COLORS[summary?.predominantThreatLevel] || '#6b7280' }}>
                {summary?.predominantThreatLevel === 'Low' && 'Baixo'}
                {summary?.predominantThreatLevel === 'Medium' && 'Médio'}
                {summary?.predominantThreatLevel === 'High' && 'Alto'}
                {summary?.predominantThreatLevel === 'N/A' && 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de Pizza - Pichações por Facção */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Pichações por Facção</h2>
          {graffitisByGang.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={graffitisByGang}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ label, percent }) => `${label}: ${(percent * 100).toFixed(0)}%`}
                >
                  {graffitisByGang.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GANG_COLORS[index % GANG_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Nenhum dado disponível
            </div>
          )}
        </div>

        {/* Gráfico de Barras - Pichações por Estado */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Pichações por Estado</h2>
          {graffitisByState.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graffitisByState}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Nenhum dado disponível
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de Barras Empilhadas - Pichações por Estado e Facção */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Pichações por Estado e Facção</h2>
        {graffitisByGangAndState.length > 0 && allGangs.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={graffitisByGangAndState}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis />
              <Tooltip />
              <Legend />
              {allGangs.map((gang, index) => (
                <Bar 
                  key={gang} 
                  dataKey={gang} 
                  stackId="a" 
                  fill={GANG_COLORS[index % GANG_COLORS.length]} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            Nenhum dado disponível
          </div>
        )}
      </div>

      {/* Mapa de Calor - Temporariamente desabilitado */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Mapa de Calor - Pichações por Estado</h2>
        <div className="h-[400px] flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="mb-2">Mapa em desenvolvimento</p>
            <p className="text-sm">Visualização por estado disponível no gráfico de barras acima</p>
          </div>
        </div>
      </div>
    </div>
  );
}

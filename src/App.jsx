import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { GangsPage } from './components/faccoes/GangsPage';
import { GraffitisPage } from './components/pichacoes/GraffitisPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="faccoes" element={<GangsPage />} />
          <Route path="pichacoes" element={<GraffitisPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

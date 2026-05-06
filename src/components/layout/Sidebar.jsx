import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Image } from 'lucide-react';

export function Sidebar() {
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/faccoes', icon: Users, label: 'Facções' },
    { to: '/pichacoes', icon: Image, label: 'Pichações' }
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Graffiti Classification</h1>
        <p className="text-sm text-gray-400 mt-1">Sistema de Classificação</p>
      </div>
      <nav className="flex-1 p-4">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

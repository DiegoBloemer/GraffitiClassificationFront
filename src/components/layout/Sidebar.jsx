import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Image, ChevronLeft, ChevronRight } from 'lucide-react';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/faccoes', icon: Users, label: 'Facções' },
    { to: '/pichacoes', icon: Image, label: 'Pichações' }
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 900);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside
      className={`bg-gray-900 text-white flex flex-col transition-all duration-200 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-6 border-b border-gray-800 flex items-start justify-between gap-3">
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold">Graffiti Classification</h1>
            <p className="text-sm text-gray-400 mt-1">Sistema de Classificação</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
          aria-label={isCollapsed ? 'Expandir sidebar' : 'Recuar sidebar'}
          title={isCollapsed ? 'Expandir' : 'Recuar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
      <nav className={`flex-1 ${isCollapsed ? 'p-3' : 'p-4'}`}>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg transition-colors ${
                isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'
              } ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`
            }
          >
            <Icon className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

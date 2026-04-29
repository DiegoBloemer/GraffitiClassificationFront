import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${colors[toast.type]}`}>
      {icons[toast.type]}
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button onClick={() => onClose(toast.id)} className="hover:opacity-70 transition-opacity cursor-pointer">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

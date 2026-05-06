import { Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useEffect, useState } from 'react';

export const SearchInput = ({ value, onChange, placeholder = 'Buscar...' }) => {
  const [local, setLocal] = useState(value);
  const debounced = useDebounce(local, 400);

  useEffect(() => {
    onChange(debounced);
  }, [debounced, onChange]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      <input type="text" value={local} onChange={(e) => setLocal(e.target.value)} placeholder={placeholder} className="pl-9 pr-4 py-2 border rounded-lg w-64 dark:bg-gray-800" />
    </div>
  );
};
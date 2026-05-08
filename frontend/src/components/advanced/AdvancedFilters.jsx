import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Calendar, Hash, Building, User, FileText, TrendingUp, X } from 'lucide-react';
import { Button } from '../common/Button';
import Input from '../common/Input';

export const AdvancedFilters = ({ filters, onChange, onApply }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
    if (onChange) onChange({ ...localFilters, [key]: value });
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      processNumber: '',
      entity: '',
      contractor: '',
      contractType: '',
      startDate: '',
      endDate: '',
      minRisk: '',
    };
    setLocalFilters(emptyFilters);
    onApply(emptyFilters);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 transition px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800"
      >
        <Filter size={16} /> Filtros avanzados {expanded ? '▲' : '▼'}
      </button>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 p-4 sm:p-5 glass-card rounded-xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Nº Proceso"
              placeholder="Ej: CM-DTAM NACION-IP No. 035-2019"
              value={localFilters.processNumber || ''}
              onChange={(e) => handleChange('processNumber', e.target.value)}
              icon={<Hash size={16} />}
            />
            <Input
              label="Entidad"
              placeholder="Alcaldía, Ministerio..."
              value={localFilters.entity || ''}
              onChange={(e) => handleChange('entity', e.target.value)}
              icon={<Building size={16} />}
            />
            <Input
              label="Proveedor"
              placeholder="Nombre del Proveedor"
              value={localFilters.contractor || ''}
              onChange={(e) => handleChange('contractor', e.target.value)}
              icon={<User size={16} />}
            />
            <Input
              label="Tipo de contrato"
              placeholder="Obra, servicios..."
              value={localFilters.contractType || ''}
              onChange={(e) => handleChange('contractType', e.target.value)}
              icon={<FileText size={16} />}
            />
            <Input
              label="Fecha inicio (desde)"
              type="date"
              value={localFilters.startDate || ''}
              onChange={(e) => handleChange('startDate', e.target.value)}
              icon={<Calendar size={16} />}
            />
            <Input
              label="Fecha fin (hasta)"
              type="date"
              value={localFilters.endDate || ''}
              onChange={(e) => handleChange('endDate', e.target.value)}
              icon={<Calendar size={16} />}
            />
            <Input
              label="Riesgo mínimo (%)"
              type="number"
              min="0"
              max="100"
              value={localFilters.minRisk || ''}
              onChange={(e) => handleChange('minRisk', e.target.value)}
              icon={<TrendingUp size={16} />}
            />
            <div className="flex items-end gap-2">
              <Button onClick={handleApply} variant="primary" className="flex-1 btn-primary">
                Aplicar
              </Button>
              <Button onClick={handleReset} variant="outline" className="px-3">
                <X size={16} />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
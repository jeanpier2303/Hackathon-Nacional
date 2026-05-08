import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Calendar, Hash, Building, User, FileText, TrendingUp, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '../common/Button';
import Input from '../common/Input';

export const AdvancedFilters = ({ filters, onChange, onApply }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expanded, setExpanded] = useState(false);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    const count = Object.values(localFilters).filter(v => v && v !== '').length;
    setActiveCount(count);
  }, [localFilters]);

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
    if (onChange) onChange({ ...localFilters, [key]: value });
  };

  const handleApply = () => {
    onApply(localFilters);
    setExpanded(false);
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
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 transition px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <SlidersHorizontal size={14} className="sm:size-16" />
          <span>Filtros avanzados</span>
          {activeCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] sm:text-xs bg-purple-500 text-white rounded-full">{activeCount}</span>
          )}
          <span className="text-xs sm:text-sm">{expanded ? '▲' : '▼'}</span>
        </button>
        {activeCount > 0 && (
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-red-500 transition flex items-center gap-1"
          >
            <X size={12} /> Limpiar
          </button>
        )}
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 sm:mt-4 p-3 sm:p-5 glass-card rounded-xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              <Input
                label="Nº Proceso"
                placeholder="Ej: CM-DTAM NACION-IP No. 035-2019"
                value={localFilters.processNumber || ''}
                onChange={(e) => handleChange('processNumber', e.target.value)}
                icon={<Hash size={14} className="sm:size-16" />}
              />
              <Input
                label="Entidad"
                placeholder="Alcaldía, Ministerio..."
                value={localFilters.entity || ''}
                onChange={(e) => handleChange('entity', e.target.value)}
                icon={<Building size={14} className="sm:size-16" />}
              />
              <Input
                label="Proveedor"
                placeholder="Nombre del Proveedor"
                value={localFilters.contractor || ''}
                onChange={(e) => handleChange('contractor', e.target.value)}
                icon={<User size={14} className="sm:size-16" />}
              />
              <Input
                label="Tipo de contrato"
                placeholder="Obra, servicios..."
                value={localFilters.contractType || ''}
                onChange={(e) => handleChange('contractType', e.target.value)}
                icon={<FileText size={14} className="sm:size-16" />}
              />
              <Input
                label="Fecha inicio (desde)"
                type="date"
                value={localFilters.startDate || ''}
                onChange={(e) => handleChange('startDate', e.target.value)}
                icon={<Calendar size={14} className="sm:size-16" />}
              />
              <Input
                label="Fecha fin (hasta)"
                type="date"
                value={localFilters.endDate || ''}
                onChange={(e) => handleChange('endDate', e.target.value)}
                icon={<Calendar size={14} className="sm:size-16" />}
              />
              <Input
                label="Riesgo mínimo (%)"
                type="number"
                min="0"
                max="100"
                value={localFilters.minRisk || ''}
                onChange={(e) => handleChange('minRisk', e.target.value)}
                icon={<TrendingUp size={14} className="sm:size-16" />}
              />
              <div className="flex items-end gap-2">
                <Button onClick={handleApply} variant="primary" className="flex-1 btn-primary text-sm sm:text-base py-1.5 sm:py-2">
                  Aplicar
                </Button>
                <Button onClick={handleReset} variant="outline" className="px-2 sm:px-3 py-1.5 sm:py-2">
                  <X size={14} className="sm:size-16" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
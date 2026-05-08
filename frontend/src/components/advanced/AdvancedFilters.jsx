import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
  Filter,
  Search,
  AlertTriangle,
  Building,
  FileText,
  ShieldAlert,
  X
} from 'lucide-react';

import { Button } from '../common/Button';
import Input from '../common/Input';

export const AdvancedFilters = ({
  filters,
  onChange,
  onApply
}) => {

  const [localFilters, setLocalFilters] =
    useState(filters);

  const [expanded, setExpanded] =
    useState(false);

  useEffect(() => {

    setLocalFilters(filters);

  }, [filters]);

  const handleChange = (
    key,
    value
  ) => {

    const updated = {
      ...localFilters,
      [key]: value
    };

    setLocalFilters(updated);

    if(onChange){

      onChange(updated);
    }
  };

  const handleApply = () => {

    onApply(localFilters);
  };

  const handleReset = () => {

    const emptyFilters = {

      busqueda:'',
      riesgo:'',
      departamento:'',
      modalidad:'',
      sobrecosto:'',
      fraccionamiento:'',
      alerta:''
    };

    setLocalFilters(
      emptyFilters
    );

    onApply(
      emptyFilters
    );
  };

  return (

    <div className="mb-6">

      <button
        onClick={() =>
          setExpanded(!expanded)
        }
        className="
          flex
          items-center
          gap-2
          text-sm
          font-medium
          text-gray-700
          dark:text-gray-300
          hover:text-purple-600
          transition
          px-3
          py-1.5
          rounded-lg
          bg-gray-100
          dark:bg-gray-800
        "
      >
        <Filter size={16} />

        Filtros avanzados

        {expanded ? '▲' : '▼'}

      </button>

      {expanded && (

        <motion.div
          initial={{
            opacity:0,
            height:0
          }}

          animate={{
            opacity:1,
            height:'auto'
          }}

          className="
            mt-4
            p-4
            sm:p-5
            glass-card
            rounded-xl
          "
        >

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
          ">

            <Input
              label="Buscar"
              placeholder="Entidad, proveedor o contrato"
              value={localFilters.busqueda || ''}
              onChange={(e)=>
                handleChange(
                  'busqueda',
                  e.target.value
                )
              }
              icon={<Search size={16} />}
            />

            <div>
              <label className="text-sm font-medium mb-1 block">
                Riesgo
              </label>

              <select
                value={localFilters.riesgo || ''}
                onChange={(e)=>
                  handleChange(
                    'riesgo',
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded-lg
                  border
                  p-2.5
                  dark:bg-gray-900
                "
              >
                <option value="">
                  Todos
                </option>

                <option value="alto">
                  Alto
                </option>

                <option value="medio">
                  Medio
                </option>

                <option value="bajo">
                  Bajo
                </option>

              </select>
            </div>

            <Input
              label="Departamento"
              placeholder="Valle, Antioquia..."
              value={localFilters.departamento || ''}
              onChange={(e)=>
                handleChange(
                  'departamento',
                  e.target.value
                )
              }
              icon={<Building size={16} />}
            />

            <Input
              label="Modalidad"
              placeholder="Mínima cuantía..."
              value={localFilters.modalidad || ''}
              onChange={(e)=>
                handleChange(
                  'modalidad',
                  e.target.value
                )
              }
              icon={<FileText size={16} />}
            />

            <div>
              <label className="text-sm font-medium mb-1 block">
                Sobrecosto
              </label>

              <select
                value={localFilters.sobrecosto || ''}
                onChange={(e)=>
                  handleChange(
                    'sobrecosto',
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded-lg
                  border
                  p-2.5
                  dark:bg-gray-900
                "
              >

                <option value="">
                  Todos
                </option>

                <option value="true">
                  Sí
                </option>

                <option value="false">
                  No
                </option>

              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Fraccionamiento
              </label>

              <select
                value={localFilters.fraccionamiento || ''}
                onChange={(e)=>
                  handleChange(
                    'fraccionamiento',
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded-lg
                  border
                  p-2.5
                  dark:bg-gray-900
                "
              >

                <option value="">
                  Todos
                </option>

                <option value="true">
                  Sí
                </option>

                <option value="false">
                  No
                </option>

              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Alerta mismo día
              </label>

              <select
                value={localFilters.alerta || ''}
                onChange={(e)=>
                  handleChange(
                    'alerta',
                    e.target.value
                  )
                }
                className="
                  w-full
                  rounded-lg
                  border
                  p-2.5
                  dark:bg-gray-900
                "
              >

                <option value="">
                  Todos
                </option>

                <option value="true">
                  Sí
                </option>

                <option value="false">
                  No
                </option>

              </select>
            </div>

            <div className="
              flex
              items-end
              gap-2
            ">

              <Button
                onClick={handleApply}
                variant="primary"
                className="
                  flex-1
                  btn-primary
                "
              >
                Aplicar
              </Button>

              <Button
                onClick={handleReset}
                variant="outline"
                className="px-3"
              >
                <X size={16} />
              </Button>

            </div>

          </div>

        </motion.div>
      )}
    </div>
  );
};
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchFromAPI, postToAPI } from "../utils/api"

// Estilos en línea para el desplegable
const selectStyles = {
  trigger: {
    backgroundColor: 'white',
    color: 'black',
    border: '1px solid #ccc',
  },
  content: {
    backgroundColor: 'white',
    color: 'black',
  },
  item: {
    backgroundColor: 'white',
    color: 'black',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  },
}

export default function StaffDemand() {
  const [days, setDays] = useState([])
  const [shifts, setShifts] = useState([])
  const [positions, setPositions] = useState([])
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedShift, setSelectedShift] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [daysData, shiftsData, positionsData] = await Promise.all([
          fetchFromAPI('/dias'),
          fetchFromAPI('/turno'),
          fetchFromAPI('/cargos')
        ]);

        setDays(daysData);
        setShifts(shiftsData);
        setPositions(positionsData);

        // Log para debugging
        console.log('Opciones cargadas:', { days: daysData, shifts: shiftsData, positions: positionsData });
      } catch (error) {
        console.error('Error al cargar las opciones:', error);
        setError('Error al cargar las opciones. Por favor, intente de nuevo.');
      }
    };

    fetchOptions();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await postToAPI('/staff-demand', {
        day: selectedDay,
        shift: selectedShift,
        position: selectedPosition
      });
      console.log('Resultado de la búsqueda:', result);
    } catch (error) {
      console.error('Error al buscar:', error);
      setError('Error al realizar la búsqueda. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800">Demanda de personal</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Días</label>
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-full" style={selectStyles.trigger}>
              <SelectValue placeholder="Seleccione día" />
            </SelectTrigger>
            <SelectContent style={selectStyles.content}>
              {days.map((day) => (
                <SelectItem key={day.value} value={day.value} style={selectStyles.item}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
          <Select value={selectedShift} onValueChange={setSelectedShift}>
            <SelectTrigger className="w-full" style={selectStyles.trigger}>
              <SelectValue placeholder="Seleccione turno" />
            </SelectTrigger>
            <SelectContent style={selectStyles.content}>
              {shifts.map((shift) => (
                <SelectItem key={shift.value} value={shift.value} style={selectStyles.item}>
                  {shift.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
          <Select value={selectedPosition} onValueChange={setSelectedPosition}>
            <SelectTrigger className="w-full" style={selectStyles.trigger}>
              <SelectValue placeholder="Seleccione cargo" />
            </SelectTrigger>
            <SelectContent style={selectStyles.content}>
              {positions.map((position) => (
                <SelectItem key={position.value} value={position.value} style={selectStyles.item}>
                  {position.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button 
        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? 'Buscando...' : 'Buscar'}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}


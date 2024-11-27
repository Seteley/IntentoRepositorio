import React, { useState, useEffect } from 'react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { fetchFromAPI, postToAPI } from "../utils/api";

export default function AssignedShifts() {
  const [shifts, setShifts] = useState([]);
  const [positions, setPositions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [dni, setDni] = useState('');
  const [assignedShifts, setAssignedShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [shiftsData, positionsData, locationsData] = await Promise.all([
          fetchFromAPI('/turno'),
          fetchFromAPI('/cargos'),
          fetchFromAPI('/locales')
        ]);

        setShifts(shiftsData);
        setPositions(positionsData);
        setLocations(locationsData);
      } catch (error) {
        console.error('Error al cargar las opciones:', error);
        setError('Error al cargar las opciones. Por favor, intente de nuevo.');
      }
    };

    fetchOptions();
  }, []);

  const handleFilter = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await postToAPI('/assigned-shifts', {
        dni,
        shift: selectedShift,
        position: selectedPosition,
        location: selectedLocation
      });
      setAssignedShifts(result);
    } catch (error) {
      console.error('Error al filtrar:', error);
      setError('Error al realizar el filtrado. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Turnos asignados</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">DNI</label>
          <Input 
            type="text" 
            placeholder="Ingrese DNI" 
            value={dni}
            onChange={(e) => setDni(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Turno</label>
          <Select value={selectedShift} onValueChange={setSelectedShift}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione turno" />
            </SelectTrigger>
            <SelectContent>
              {shifts.map((shift) => (
                <SelectItem key={shift.value} value={shift.value}>
                  {shift.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Cargo</label>
          <Select value={selectedPosition} onValueChange={setSelectedPosition}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione cargo" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((position) => (
                <SelectItem key={position.value} value={position.value}>
                  {position.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Local</label>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione local" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className
="flex justify-end">
        <Button 
          className="bg-blue-500 hover:bg-blue-600"
          onClick={handleFilter}
          disabled={loading}
        >
          {loading ? 'Filtrando...' : 'Filtrar'}
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-zinc-900 text-white rounded-t-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">DNI</TableHead>
              <TableHead className="text-white">Turno</TableHead>
              <TableHead className="text-white">Cargo</TableHead>
              <TableHead className="text-white">Días</TableHead>
              <TableHead className="text-white">Local</TableHead>
              <TableHead className="text-white">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignedShifts.map((shift, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{shift.dni}</TableCell>
                <TableCell>{shift.shift}</TableCell>
                <TableCell>{shift.position}</TableCell>
                <TableCell>{shift.days}</TableCell>
                <TableCell>{shift.location}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button className="bg-blue-500 hover:bg-blue-600">Editar</Button>
                    <Button variant="destructive">Eliminar</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


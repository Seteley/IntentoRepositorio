import React from 'react';
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

export default function AvailableStaff() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Personal disponible</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DNI</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>
                <Button className="bg-blue-500 hover:bg-blue-600">Asignar</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


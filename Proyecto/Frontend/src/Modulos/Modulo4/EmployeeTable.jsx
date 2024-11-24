import React from "react";
import "../../styles/EmployeeTable.css"; // Agrega un archivo de estilo dedicado, si es necesario.
const EmployeeTable = ({ empleados }) => {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Primer Nombre</th>
              <th>Primer Apellido</th>
              <th>Segundo Apellido</th>
              <th>DNI</th>
              <th>Contacto</th>
              <th>Dirección</th>
              <th>Turno</th>
              <th>Local</th>
              <th>Contrato</th>
              <th>Cargo</th>
            </tr>
          </thead>
          <tbody>
            {empleados.length > 0 ? (
              empleados.map((empleado) => (
                <tr key={empleado.codigo_empleado}>
                  <td>{empleado.codigo_empleado}</td>
                  <td>{empleado.primer_nombre}</td>
                  <td>{empleado.primer_apellido}</td>
                  <td>{empleado.segundo_apellido}</td>
                  <td>{empleado.dni}</td>
                  <td>{empleado.contacto}</td>
                  <td>{empleado.direccion}</td>
                  <td>{empleado.cod_turno}</td>
                  <td>{empleado.cod_local}</td>
                  <td>{empleado.cod_contrato}</td>
                  <td>{empleado.cod_cargo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No hay empleados disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };
export default EmployeeTable;

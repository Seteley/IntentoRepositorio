import React, { useState, useContext } from "react";
import { EmpleadoContext } from "../context/EmpleadoContext";
import { useNavigate } from "react-router-dom";

const FormularioEmpleado = () => {
  const { setEmpleado } = useContext(EmpleadoContext); // Confirma que EmpleadoContext esté cargado correctamente
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmpleado(codigo);
    navigate(`/modulo5/inicio`);
  };

  return (
    <div>
      <h2>Ingrese su código de empleado</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código de empleado"
          required
        />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default FormularioEmpleado;

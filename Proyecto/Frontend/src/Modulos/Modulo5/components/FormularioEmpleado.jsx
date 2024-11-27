import React, { useState, useContext } from "react";
import { EmpleadoContext } from "../context/EmpleadoContext";
import { useNavigate } from "react-router-dom";
import "../styles/FormularioEmpleado.css";

const FormularioEmpleado = () => {
  const { setEmpleado } = useContext(EmpleadoContext);
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmpleado(codigo);
    navigate(`/modulo5/inicio`);
  };

  return (
    <div className="page-container">
      <div className="formulario-empleado">
        <h2>Ingrese su código de empleado</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código de empleado"
            required
          />
          <button type="submit">Guardar</button>
        </form>
      </div>
    </div>
  );
};

export default FormularioEmpleado;


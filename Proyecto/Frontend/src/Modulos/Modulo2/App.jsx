import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Keypad from "./Keypad";
import { autenticarMesero } from "./Service";
import "../../styles/autenticacion.css";

const AuthenticationForm = () => {
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  const handleKeyPress = (value) => {
    if (value === "clear") {
      setCodigo("");
    } else if (value === "submit") {
      autenticar();
    } else {
      setCodigo((prev) => (prev.length < 8 ? prev + value : prev));
    }
  };

  const autenticar = async () => {
    try {
      setMensaje(null);
      const response = await autenticarMesero(codigo);
      setMensaje({ type: "success", text: response.message });

      setTimeout(() => {
        navigate("/asignacion-mesa");
      }, 350);
    } catch (error) {
      setMensaje({ type: "error", text: error.message });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="fr-text">FR</div>
        <div className="auth-form">
          <input
            type="text"
            value={codigo}
            readOnly
            placeholder="Ingrese su código"
          />
          <Keypad onKeyPress={handleKeyPress} />
          {mensaje && <div className={mensaje.type}>{mensaje.text}</div>}
        </div>
        <div className="ay-text">AY</div>
      </div>
    </div>
  );
};

export default AuthenticationForm;
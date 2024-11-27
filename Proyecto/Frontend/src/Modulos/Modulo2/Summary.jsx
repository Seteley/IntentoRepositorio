import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerSummary } from './Service_Summary';
import '../../styles/Summary.css';

const Summary = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
       
        const data = await obtenerSummary();
        
        setSummaryData(data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!summaryData || summaryData.length === 0) return <div>No hay datos disponibles</div>;

  const calculateTotal = () => {
    return summaryData.reduce((acc, item) => acc + parseFloat(item.precio) * parseFloat(item.cantidad), 0);
  };

  const handleModificar = () => {
    navigate(-1); // Volver a la pantalla anterior
  };

  const handleConfirmar = () => {
    // Aquí iría la lógica para confirmar el pedido
    console.log('Pedido confirmado');
  };

  return (
    <div className="summary-container">
      <div className="summary-card">
        <div className="mesero-info">
          <h2>MESERO</h2>
          <p>{summaryData[0].mesero}</p>
        </div>

        <div className="summary-content">
          <h1>SUMMARY</h1>
          <div className="summary-items">
            {summaryData.map((item, index) => (
              <div key={index} className="summary-item">
                <div className="item-detail">
                  <span className="item-name">{item.nombre_producto}</span>
                  <span className="item-quantity">{item.cantidad}</span>
                  <span className="item-price">S/. {parseFloat(item.precio).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <span>TOTAL</span>
            {summaryData.length > 0 && (
                    <div>
                    <span>S/. {summaryData[0].total}</span>
                    </div>)}
          </div>
        </div>

        <div className="mesa-info">
          <span># MESA</span>
          <div className="mesa-numero">{summaryData[0].num_mesa}</div>
        </div>
      </div>

      <div className="summary-buttons">
        <button className="btn-modificar" onClick={handleModificar}>
          MODIFICAR
        </button>
        <button className="btn-confirmar" onClick={handleConfirmar}>
          CONFIRMAR PEDIDO
        </button>
      </div>
    </div>
  );
};

export default Summary;
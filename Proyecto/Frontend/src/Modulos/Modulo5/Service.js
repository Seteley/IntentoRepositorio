const API_URL = import.meta.env.VITE_APP_API_URL;


// Función para obtener órdenes de compra del mismo día
export const fetchOrdenesMismoDia = async (codigoEmpleado) => {
  try {
    const response = await fetch(`${API_URL}/ordencompra`, {
      method: "POST", // Cambiamos a POST
      headers: {
        "Content-Type": "application/json", // Indicamos que enviamos JSON
      },
      body: JSON.stringify({ codigo_empleado: codigoEmpleado }), // Enviamos el parámetro en el cuerpo
    });

    const responseText = await response.text(); // Leer la respuesta como texto
    console.log("Respuesta del servidor:", responseText);

    if (!response.ok) {
      throw new Error("Error al obtener órdenes de compra");
    }

    return JSON.parse(responseText); // Convertir la respuesta a JSON manualmente
  } catch (error) {
    console.error("Error en fetchOrdenesMismoDia:", error);
    throw error;
  }
};


export const fetchContenidoOrden = async (codOrden) => {
  try {
    const response = await fetch(`${API_URL}/contenido`, {
      method: 'POST',  // Usamos POST en lugar de GET
      headers: {
        'Content-Type': 'application/json',  // Especificamos que el contenido es JSON
      },
      body: JSON.stringify({ cod_orden: codOrden }),  // Pasamos el código de la orden en el cuerpo
    });

    const data = await response.json();  // Obtenemos la respuesta en formato JSON

    if (!response.ok) {
      throw new Error("Error al obtener el contenido de la orden.");
    }

    return data.contenido;  // Retornamos el contenido de la orden
  } catch (error) {
    console.error("Error en fetchContenidoOrden:", error);
    throw error;
  }
};


export const fetchSupervisores = async (codigoEmpleado) => {
  try {
    const response = await fetch(`${API_URL}/asignacion/${codigoEmpleado}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Error al obtener supervisores");
    }

    return data.empleado; // Retorna la lista de supervisores
  } catch (error) {
    console.error("Error en fetchSupervisores:", error);
    throw error;
  }
};


export const crearRevision = async (codOrdencompra, codSupCantidad, codSupCalidad) => {
  try {
    const response = await fetch(`${API_URL}/insertar_revision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cod_ordencompra: codOrdencompra,
        cod_supcantidad: codSupCantidad,
        cod_supcalidad: codSupCalidad,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Error al crear la revisión");
    }

    return data; // Retorna la respuesta del servidor
  } catch (error) {
    console.error("Error en crearRevision:", error);
    throw error;
  }
};


export const actualizarProceso = async (codOrdencompra) => {
  try {
    const response = await fetch(`${API_URL}/actualizar_proceso2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cod_ordencompra: codOrdencompra,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Error al actualizar el proceso de la orden");
    }

    return data; // Retorna la respuesta del servidor
  } catch (error) {
    console.error("Error en actualizarProceso:", error);
    throw error;
  }
};


export const fetchCantidades = async (codOrdenCompra) => {
  try {
    const response = await fetch(`${API_URL}/cantidades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cod_ordencompra: codOrdenCompra }),
    });

    if (!response.ok) {
      throw new Error("Error al obtener las cantidades");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en fetchCantidades:", error);
    throw error;
  }
};



export const actualizarCantidadRecibida = async (codOrdenCompra, codInsumo, cantidadRecibida) => {
  try {
    const response = await fetch(`${API_URL}/actualizar-cantidad-recibida`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cod_ordencompra: codOrdenCompra,
        cod_insumo: codInsumo,
        cantidad_recibida: cantidadRecibida,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la cantidad recibida");
    }

    return await response.json(); // Devuelve la respuesta del backend
  } catch (error) {
    console.error("Error en actualizarCantidadRecibida:", error);
    throw error;
  }
};

export const fetchCalidades = async (codOrdenCompra) => {
  try {
    const response = await fetch(`${API_URL}/calidades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cod_ordencompra: codOrdenCompra }),
    });

    if (!response.ok) {
      throw new Error("Error al obtener calidades");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en fetchCalidades:", error);
    throw error;
  }
};

export const fetchValoresCalidad = async () => {
  try {
    const response = await fetch(`${API_URL}/valorescalidad`);
    if (!response.ok) {
      throw new Error("Error al obtener los valores de calidad.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en fetchValoresCalidad:", error);
    throw error;
  }
};


// Función para actualizar la revisión de calidad de un insumo
export const actualizarRevision = async (codOrdenCompra, codInsumo, estadoCalidad, descripcion) => {
  try {
    const response = await fetch(`${API_URL}/actualizar-revision`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cod_ordencompra: codOrdenCompra,
        cod_insumo: codInsumo,
        estado_calidad: estadoCalidad,
        descripcion: descripcion,
      }),
    });

    const responseText = await response.text(); // Leer la respuesta como texto
    console.log('Respuesta del servidor:', responseText);

    if (!response.ok) {
      throw new Error(`Error al actualizar la revisión para el insumo ${codInsumo}`);
    }

    return JSON.parse(responseText); // Convertir la respuesta a JSON manualmente
  } catch (error) {
    console.error("Error en actualizarRevision:", error);
    throw error;
  }
};

export const fetchDetallesRevision = async (cod_ordencompra) => {
  try {
    const response = await fetch(`${API_URL}/detalles-revision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cod_ordencompra }), // Enviamos el código de la orden de compra en el cuerpo
    });
    const responseText = await response.text(); // Leer la respuesta como texto
    console.log("Respuesta del servidor:", responseText);

    if (!response.ok) {
      throw new Error("Error al obtener los detalles de la revisión");
    }

    return JSON.parse(responseText); // Convertir la respuesta a JSON manualmente
  } catch (error) {
    console.error("Error en fetchDetallesRevision:", error);
    throw error;
  }
};

// service.js
export const fetchCondicionesIngreso = async (cod_ordencompra) => {
  try {
    const response = await fetch(`${API_URL}/ingreso_condiciones`, { // Asegúrate de que la URL es correcta
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cod_ordencompra }), // Enviamos el cod_ordencompra en el cuerpo
    });

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error('Error al obtener las condiciones.');
    }

    const data = await response.json();
    // Asegurarse de que la respuesta tiene el formato esperado
    return data.condiciones_insumos || []; // Retornamos los datos de las condiciones, si existe
  } catch (error) {
    console.error('Error en fetchCondicionesIngreso:', error);
    throw error; // Rethrow para manejar el error en el frontend
  }
};
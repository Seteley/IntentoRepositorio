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
    const response = await fetch(`${API_URL}/asignacion`, {
      method: 'POST',  // Usamos POST en lugar de GET
      headers: {
        'Content-Type': 'application/json',  // Indicamos que el contenido es JSON
      },
      body: JSON.stringify({ cod_empleado: codigoEmpleado }),  // Enviamos el 'codigoEmpleado' en el cuerpo de la solicitud
    });

    const data = await response.json();  // Obtenemos la respuesta en formato JSON

    if (!response.ok) {
      throw new Error("Error al obtener supervisores");
    }

    return data.empleado;  // Retornamos la asignación del empleado (o supervisores)
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


export const actualizarProceso = async (codOrdencompra, codProceso) => {
  try {
    const response = await fetch(`${API_URL}/actualizar_proceso`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cod_ordencompra: codOrdencompra,
        cod_proceso: codProceso,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al actualizar el proceso de la orden");
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
    const response = await fetch(`${API_URL}/ingreso_condiciones`, {
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



export const fetchAlmacenes = async (codigo_empleado, codigo_insumo) => {
  try {
    const response = await fetch(`${API_URL}/ver_almacen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo_empleado, codigo_insumo }), // Enviamos los parámetros en el cuerpo
    });

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener los almacenes.");
    }

    const data = await response.json();
    // Asegurarse de que la respuesta tiene el formato esperado
    return data.resultados || []; // Retornamos los resultados si existen
  } catch (error) {
    console.error("Error en fetchAlmacenes:", error);
    throw error; // Re-lanzamos el error para manejarlo en el frontend
  }
};



export const fetchIngresarStock = async (fechaven, cod_insumo, cod_ordencompra, cod_almacen) => {
  try {
    // Enviar la solicitud POST al backend con los parámetros necesarios
    const response = await fetch(`${API_URL}/ingresar_stock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fechaven,
        cod_insumo,
        cod_ordencompra,
        cod_almacen
      }), // Enviamos los parámetros en el cuerpo de la solicitud
    });

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al ingresar el stock.");
    }

    // Si la respuesta fue exitosa, obtener los datos y devolver el mensaje
    const data = await response.json();
    return data.mensaje || "Ingreso de stock exitoso."; // Retornar el mensaje de éxito
  } catch (error) {
    console.error("Error en fetchIngresarStock:", error);
    throw error; // Re-lanzamos el error para manejarlo en el frontend
  }
};


export const fetchInsertarMovimiento = async (cod_ordencompra, cod_insumo, cod_empleado) => {
  try {
    const response = await fetch(`${API_URL}/ingresar_movimiento`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cod_ordencompra,
        cod_insumo,
        cod_empleado, // ya no se pasa cod_tipomovimiento
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error data:", errorData);  // Imprime el error completo
      throw new Error(errorData.error || "Error al ingresar el movimiento.");
    }

    // Obtener los datos de la respuesta
    const data = await response.json();
    console.log("Data response:", data);  // Imprime la respuesta completa

    return data.mensaje || "Movimiento registrado correctamente.";
  } catch (error) {
    console.error("Error en fetchInsertarMovimiento:", error);
    throw error;
  }
};



export const fetchActualizarFinIngreso = async () => {
  try {
    const response = await fetch(`${API_URL}/actualizar-fin-ingreso`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar la fecha de fin.");
    }

    const data = await response.json();
    return data.mensaje || "Fecha de fin actualizada correctamente.";
  } catch (error) {
    console.error("Error en fetchActualizarFinIngreso:", error);
    throw error;
  }
};


export const fetchActualizarRevisionCalidad = async (cod_ordencompra) => {
  try {
    // Hacer la solicitud a la API con el 'cod_ordencompra' en el cuerpo de la solicitud
    const response = await fetch(`${API_URL}/actualizar-revision-calidad`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cod_ordencompra }), // Pasamos el 'cod_ordencompra' en el cuerpo de la solicitud
    });

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar la fecha y hora de calidad.");
    }

    const data = await response.json();
    return data.mensaje || "Fecha y hora de calidad actualizada correctamente.";
  } catch (error) {
    console.error("Error en fetchActualizarRevisionCalidad:", error);
    throw error;
  }
};


export const fetchActualizarRevisionCantidad = async (cod_ordencompra) => {
  try {
    // Hacer la solicitud a la API con el 'cod_ordencompra' en el cuerpo de la solicitud
    const response = await fetch(`${API_URL}/actualizar-revision-cantidad`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cod_ordencompra }), // Pasamos el 'cod_ordencompra' en el cuerpo de la solicitud
    });

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar la fecha y hora de cantidad.");
    }

    const data = await response.json();
    return data.mensaje || "Fecha y hora de cantidad actualizada correctamente.";
  } catch (error) {
    console.error("Error en fetchActualizarRevisionCantidad:", error);
    throw error;
  }
};

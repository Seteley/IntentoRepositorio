from flask import Blueprint, jsonify, request
from .models import get_all_empleados, create_empleado, update_empleado, get_all_insumos, get_all_condiciones, get_all_unidades, get_local_empleado, get_ordencompra_mismodia, ver_contenido_orden_compra, get_empleado_supervisor, insertar_revision, actualizar_proceso_orden_a_2, obtener_detalles_revision, mostrar_cantidades, actualizar_cantidad_recibida, valorescalidad, mostrar_calidades, actualizar_revision, ingreso_condiciones

router = Blueprint("router", __name__)


# Ruta para obtener todos los empleados
@router.route("/empleados", methods=["GET"])
def get_empleados():
    try:
        empleados = get_all_empleados()
        return jsonify(empleados), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Ruta para crear un empleado
@router.route("/empleados", methods=["POST"])
def add_empleado():
    data = request.json
    nombre = data.get("nombre")
    email = data.get("email")
    salario = data.get("salario")

    if not nombre or not email or not salario:
        return jsonify({"error": "Faltan datos"}), 400

    try:
        empleado_id = create_empleado(nombre, email, salario)
        return jsonify({"id": empleado_id, "message": "Empleado creado"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Ruta para actualizar un empleado
@router.route("/empleados/<int:id>", methods=["PUT"])
def edit_empleado(id):
    data = request.json
    nombre = data.get("nombre")
    email = data.get("email")
    salario = data.get("salario")

    if not nombre or not email or not salario:
        return jsonify({"error": "Faltan datos"}), 400

    try:
        filas_afectadas = update_empleado(id, nombre, email, salario)
        if filas_afectadas == 0:
            return jsonify({"error": "Empleado no encontrado"}), 404
        return jsonify({"message": "Empleado actualizado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Módulo 5 (Gestión de Inventario)
@router.route("/insumo", methods=["GET"])
def get_insumo():
    try:
        # Llamamos a la función que obtiene todos los insumos
        insumos = get_all_insumos()
        # Si no se encuentra contenido, devolvemos un error 404
        if not insumos:
            return jsonify({"error": "No se encontraron insumos"}), 404
        # Estructuramos la respuesta correctamente, incluyendo la lista de insumos
        return jsonify({"insumo": insumos}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@router.route("/condicion", methods=["GET"])
def get_condicion():
    try:
        condiciones = get_all_condiciones()
        return jsonify({"condiciones": condiciones}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@router.route("/unidad", methods=["GET"])
def get_unidad():
    try:
        unidades = get_all_unidades()
        return jsonify({"unidad": unidades}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@router.route("/ordencompra", methods=["POST"])
def get_ordencompra_mismodia_route():
    try:
        # Obtener el cuerpo de la solicitud
        data = request.get_json()
        codigo_empleado = data.get("codigo_empleado")

        # Validar que se recibió el parámetro necesario
        if not codigo_empleado:
            return jsonify({"error": "El parámetro 'codigo_empleado' es obligatorio."}), 400

        # Llamamos a la función que obtiene las órdenes de compra para el mismo día
        print(f"Buscando órdenes de compra para el empleado con código: {codigo_empleado}")
        ordenes = get_ordencompra_mismodia(codigo_empleado)

        # Depurar si no se encuentran órdenes
        if not ordenes:
            return jsonify({"message": "No se encontraron órdenes de compra para hoy"}), 404

        # Si hay órdenes de compra, las devolvemos directamente
        return jsonify({"ordenes": ordenes}), 200

    except ValueError as ve:
        # Capturamos errores esperados (como empleado no asignado a un local)
        print(f"Error esperado: {ve}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        # Si ocurre un error inesperado, lo manejamos y devolvemos un mensaje de error genérico
        print(f"Error inesperado: {e}")
        return jsonify({"error": "Ocurrió un error en el servidor: " + str(e)}), 500



#Ruta para ver contenido de orden de compra
@router.route("/contenido/<int:cod_orden>", methods=["GET"])
def contenido_orden_compra(cod_orden):
    try:
        # Llamar a la función que obtiene el contenido de la orden de compra
        contenido = ver_contenido_orden_compra(cod_orden)

        if not contenido:
            return jsonify({"error": "Orden de compra no encontrada"}), 404

        # Estructurar la respuesta
        return jsonify({"contenido": contenido}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#Ruta para ver los empleados que pueden ser supervisores
# Ruta para ver los empleados que pueden ser supervisores
@router.route("/asignacion/<int:cod_empleado>", methods=["GET"])
def asignacion_empleado(cod_empleado):
    try:
        # Llamamos a la función que obtiene la asignación del empleado
        contenido = get_empleado_supervisor(cod_empleado)

        # Si no se encuentra contenido, devolvemos un error 404
        if not contenido:
            return jsonify({"error": "Empleado no encontrado o no tiene la asignación correspondiente"}), 404

        # Estructuramos la respuesta correctamente, ya que 'contenido' ahora es una lista de diccionarios
        return jsonify({"empleado": contenido}), 200

    except Exception as e:
        # Si ocurre un error inesperado, lo manejamos y devolvemos un mensaje de error genérico
        return jsonify({"error": "Ocurrió un error en el servidor: " + str(e)}), 500



## Ruta para la creación de supervisiones
@router.route('/insertar_revision', methods=['POST'])
def crear_revision():
    try:
        # Obtén los datos enviados en la solicitud como JSON
        data = request.json
        cod_ordencompra = data.get("cod_ordencompra")
        cod_supcantidad = data.get("cod_supcantidad")
        cod_supcalidad = data.get("cod_supcalidad")

        # Verificamos que los datos necesarios estén presentes
        if not cod_ordencompra or not cod_supcantidad or not cod_supcalidad:
            return jsonify({"error": "Faltan datos en la solicitud"}), 400

        # Llamamos a la función para insertar la revisión
        response, status_code = insertar_revision(cod_ordencompra, cod_supcantidad, cod_supcalidad)

        # Retornamos la respuesta de la función insertar_revision
        return jsonify(response), status_code

    except Exception as e:
        # Manejo de excepciones
        return jsonify({"error": "Ocurrió un error en el servidor: " + str(e)}), 500


# Ruta para actualizar el proceso de una orden de compra a 2
@router.route('/actualizar_proceso2', methods=['POST'])
def actualizar_proceso():
    try:
        # Obtener el código de la orden desde el cuerpo de la solicitud (request)
        data = request.json
        cod_ordencompra = data.get("cod_ordencompra")
        
        # Verificar si el código de orden de compra fue proporcionado
        if not cod_ordencompra:
            return jsonify({"error": "El código de la orden es requerido"}), 400
        
        # Llamar a la función que actualiza el proceso de la orden
        filas_afectadas = actualizar_proceso_orden_a_2(cod_ordencompra)

        # Verificar si se actualizó alguna fila
        if filas_afectadas > 0:
            return jsonify({"message": f"{filas_afectadas} orden(es) actualizada(s)"}), 200
        else:
            return jsonify({"message": "No se encontró ninguna orden con ese código"}), 404
    
    except Exception as e:
        return jsonify({"error": f"Ocurrió un error: {str(e)}"}), 500


#Ruta para ver las cantidades que llegarán:
@router.route('/cantidades', methods=['POST'])
def obtener_cantidades():
    try:
        data = request.get_json()
        cod_ordencompra = data.get('cod_ordencompra')
        
        if not cod_ordencompra:
            return jsonify({"error": "Falta el código de la orden de compra."}), 400
        
        cantidades = mostrar_cantidades(cod_ordencompra)
        if not cantidades:
            return jsonify({"message": "No se encontraron insumos para la orden de compra."}), 404
        return jsonify({"cantidades": cantidades}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error al obtener las cantidades."}), 500



# Ruta para ver las calidades asociadas a una orden de compra
@router.route('/calidades', methods=['POST'])
def obtener_calidades():
    try:
        data = request.get_json()
        cod_ordencompra = data.get('cod_ordencompra')
        
        if not cod_ordencompra:
            return jsonify({"error": "Falta el código de la orden de compra."}), 400
        
        calidad = mostrar_calidades(cod_ordencompra)  # Llama a la función que ejecuta la consulta
        if not calidad:
            return jsonify({"message": "No se encontraron insumos para la orden de compra."}), 404
        return jsonify({"calidades": calidad}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error al obtener los insumos de calidad."}), 500



# Ruta para ver las revisiones hechas a los insumos
# Ruta para obtener los detalles de una orden de compra


@router.route('/detalles-revision', methods=['POST'])
def obtener_detalles_revision_ruta():
    try:
        # Obtener los parámetros de la solicitud POST (en formato JSON)
        data = request.get_json()
        cod_ordencompra = data.get('cod_ordencompra')

        # Validar que el código de la orden de compra haya sido enviado
        if not cod_ordencompra:
            return jsonify({"error": "Falta el código de la orden de compra."}), 400

        # Llamar a la función que ejecuta la consulta para obtener los detalles
        detalles = obtener_detalles_revision(cod_ordencompra)
        
        # Verificar si se obtuvieron resultados
        if not detalles:
            return jsonify({"message": "No se encontraron detalles para la orden de compra."}), 404

        # Retornar los detalles encontrados
        return jsonify({"detalles": detalles}), 200
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error al obtener los detalles de revisión."}), 500

    



@router.route('/actualizar-cantidad-recibida', methods=['PUT'])
def actualizar_cantidad_recibida_ruta():
    try:
        # Obtener los parámetros de la petición (en este caso, se asume que es JSON)
        data = request.get_json()

        # Verificar que se recibieron los parámetros necesarios
        cod_ordencompra = data.get('cod_ordencompra')
        cod_insumo = data.get('cod_insumo')
        cantidad_recibida = data.get('cantidad_recibida')

        if not cod_ordencompra or not cod_insumo or cantidad_recibida is None:
            return jsonify({"error": "Faltan parámetros en la solicitud"}), 400

        # Llamamos a la función de actualización
        filas_afectadas = actualizar_cantidad_recibida(cod_ordencompra, cod_insumo, cantidad_recibida)

        # Retornar el resultado de la actualización
        return jsonify({"filas_afectadas": filas_afectadas}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@router.route('/valorescalidad', methods=['GET'])
def get_valores_calidad():
    try:
        valores = valorescalidad()  # Llamamos a la función que consulta la base de datos
        return jsonify({"valores_calidad": valores}), 200  # Retornamos los valores en formato JSON
    except Exception as e:
        # Capturamos cualquier error durante la consulta o procesamiento
        return jsonify({"error": f"Hubo un problema: {str(e)}"}), 500
    



@router.route('/actualizar-revision', methods=['PUT'])
def actualizar_revision_ruta():
    try:
        # Obtener los parámetros de la petición (en este caso, se asume que es JSON)
        data = request.get_json()

        # Verificar que se recibieron los parámetros necesarios
        cod_ordencompra = data.get('cod_ordencompra')
        cod_insumo = data.get('cod_insumo')
        estado_calidad = data.get('estado_calidad')
        descripcion = data.get('descripcion')

        if not cod_ordencompra or not cod_insumo or not estado_calidad or not descripcion:
            return jsonify({"error": "Faltan parámetros en la solicitud"}), 400

        # Llamamos a la función de actualización
        filas_afectadas = actualizar_revision(cod_ordencompra, cod_insumo, estado_calidad, descripcion)

        # Retornar el resultado de la actualización
        return jsonify({"filas_afectadas": filas_afectadas}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@router.route('/ingreso_condiciones', methods=['POST'])
def obtener_ingreso_condiciones():
    # Obtener el cod_ordencompra del cuerpo de la solicitud JSON
    data = request.get_json()
    cod_ordencompra = data.get('cod_ordencompra')  # Extraemos el valor de cod_ordencompra

    if not cod_ordencompra:
        return jsonify({"error": "El parámetro 'cod_ordencompra' es obligatorio."}), 400

    # Llamar a la función ingreso_condiciones para obtener los detalles
    detalles = ingreso_condiciones(cod_ordencompra)

    if detalles is None:
        return jsonify({"error": "No se encontraron detalles para la orden de compra"}), 404

    return jsonify({"condiciones_insumos": detalles})
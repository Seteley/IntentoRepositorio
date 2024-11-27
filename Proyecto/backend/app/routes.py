from flask import Blueprint, jsonify, request
from .models import (
    get_staff_demand,
    get_local,
    get_cargo,
    get_turno,
    meseros_disponibles,
    autenticar_mesero,
    mesa_disponible,
    idm_actual,
    primer_registro_pedido,
    mostrar_categorias,
    get_all_mesas,
    dp_actual,
    boton_categoria,
    insert_item_pedido,
    summary,
    get_dias,
)

from .models import get_all_insumos, get_all_condiciones, get_all_unidades, get_local_empleado, get_ordencompra_mismodia, ver_contenido_orden_compra, get_empleado_supervisor, insertar_revision, actualizar_proceso_orden, obtener_detalles_revision, mostrar_cantidades, actualizar_cantidad_recibida, valorescalidad, mostrar_calidades, actualizar_revision, ingreso_condiciones, VerAlmacen, ingresar_stock, ingresar_movimiento, actualizar_fin_ingreso, actualizar_revision_calidad, actualizar_revision_cantidad


import logging


router = Blueprint("router", __name__)


# Ruta para verificar conexión
@router.route("/", methods=["GET"])
def index():
    try:
        return jsonify({"message": "Conexión exitosa :D"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@router.route("/personal-libre", methods=["POST"])
def obtener_personal_libre():
    try:
        # Datos enviados desde el frontend
        data = request.get_json()
        dia = data.get("dia")
        turno = data.get("turno")
        cargo = data.get("cargo")

        # Validación básica
        if not dia or not turno or not cargo:
            return jsonify({"error": "Faltan parámetros: día, turno o cargo"}), 400

        # Realizar consulta
        personal_libre = get_personal_libre(dia, turno, cargo)
        return jsonify(personal_libre), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Ruta para obtener todos los empleados
@router.route("/turno", methods=["GET"])
def get_turnos():
    try:
        turnos = get_turno()
        return jsonify(turnos), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@router.route("/dias", methods=["GET"])
def get_dia():
    try:
        dias = get_dias()
        return jsonify(dias), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@router.route("/cargos", methods=["GET"])
def get_cargos():
    try:
        cargos = get_cargo()
        return jsonify(cargos), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@router.route("/locales", methods=["GET"])
def get_locales():
    try:
        locales = get_local()
        return jsonify(locales), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@router.route("/staff-demand", methods=["GET"])
def staff_demand():
    day = request.args.get("day")
    shift = request.args.get("shift")
    position = request.args.get("position")
    demand = get_staff_demand(day, shift, position)
    return jsonify(demand[0][0] if demand else 0)


@router.route("/available-staff", methods=["GET"])
def available_staff():
    day = request.args.get("day")
    shift = request.args.get("shift")
    position = request.args.get("position")
    staff = models.get_available_staff(day, shift, position)
    return jsonify([{"dni": s[0], "name": s[1], "last_name": s[2]} for s in staff])


@router.route("/assigned-shifts", methods=["GET"])
def assigned_shifts():
    dni = request.args.get("dni")
    shift = request.args.get("shift")
    position = request.args.get("position")
    location = request.args.get("location")
    shifts = models.get_assigned_shifts(dni, shift, position, location)
    return jsonify(
        [
            {
                "id": s[0],
                "dni": s[1],
                "name": s[2],
                "last_name": s[3],
                "day": s[4],
                "shift": s[5],
                "position": s[6],
                "location": s[7],
            }
            for s in shifts
        ]
    )


@router.route("/assign-shift", methods=["POST"])
def assign_new_shift():
    data = request.json
    try:
        shift_id = models.assign_shift(
            data["dni"], data["day"], data["shift"], data["location"]
        )
        return jsonify({"message": "Shift assigned successfully", "id": shift_id}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 400


@router.route("/remove-shift/<int:shift_id>", methods=["DELETE"])
def remove_assigned_shift(shift_id):
    try:
        models.remove_shift(shift_id)
        return jsonify({"message": "Shift removed successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400


@router.route("/update-shift/<int:shift_id>", methods=["PUT"])
def update_assigned_shift(shift_id):
    data = request.json
    try:
        models.update_shift(shift_id, data["day"], data["shift"], data["location"])
        return jsonify({"message": "Shift updated successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400


# MODULO 2


# AUTENTICACION DE MESERO
@router.route("/modulo2/autenticacion_mesero", methods=["POST"])
def autenticar_meseros():
    try:
        meseros_allow = meseros_disponibles()
        data_user = request.json
        cod_empleado = data_user.get("codigo_empleado")
        if cod_empleado in meseros_allow:
            autenticar_mesero(cod_empleado)
            return (
                jsonify({"message": "Autenticación exitosa"}),
                200,
            )  # Respuesta válida
        else:
            return (
                jsonify({"error": "Empleado no permitido"}),
                400,
            )  # Error si el empleado no está     permitido
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ASIGNACION DE MESA _ ELIMINA
@router.route("/modulo2/asignacion_mesa/<int:num_mesa>", methods=["GET"])
def mesas(num_mesa):
    try:
        mesas = mesa_disponible(num_mesa)
        print(mesas[0].get("disp_mesa"))  # Valor de 0
        return mesas

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# VER TODAS LAS MESAS
@router.route("/modulo2/registrando_pedido", methods=["GET"])
def mostrar_mesas():
    try:
        mesas = get_all_mesas()
        return mesas

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ASIGNACION DE MESA
@router.route("/modulo2/registrando_pedido/mesa", methods=["POST"])
def primer_registro_pedido_mesa():
    try:
        num_mesa = request.json
        num_mesa = num_mesa.get("cod_mesa")
        print(f"Recibido cod_mesa: {num_mesa}")
        mesas = mesa_disponible(num_mesa)
        cod_idm = idm_actual()
        cod_idm = cod_idm[0].get("cod_im_actual")  # COD_IDM_ACTUAL
        bool_mesa = mesas[0].get("disp_mesa")  # Valor de 0: DISPONIBLE
        print(f"Estado de mesa: {bool_mesa}")

        if bool_mesa == 0:
            cod_estado_dp = "RE"
            primer_registro_pedido(cod_estado_dp, cod_idm, num_mesa)
            return jsonify({"message": "Detalle Pedido registrado"}), 200
        else:
            return jsonify({"error": "Mesa no disponible"}), 400

    except Exception as e:
        print(f"Error en la asignación de la mesa: {str(e)}")
        return jsonify({"error": str(e)}), 500


# MOSTRANDO CATEGORIAS
@router.route("/modulo2/registrando_pedido/categorias", methods=["GET"])
def categorias_friday():
    try:
        categories = mostrar_categorias()
        return jsonify(categories), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# CLICK EN ALGUNA CATEOGORIA
@router.route(
    "/modulo2/registrando_pedido/categorias/<string:cod_categoria>/", methods=["GET"]
)
def seleccionando_items(cod_categoria):
    try:
        productos_friday = boton_categoria(cod_categoria)
        return jsonify(productos_friday), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# REGISTRANDO ITEMS DEL PEDIDO
@router.route(
    "/modulo2/registrando_pedido/categorias/<string:cod_categoria>/items_pedido",
    methods=["POST"],
)
def items_pedido(cod_categoria):
    try:
        data_user = request.json
        productosFridays = data_user.get("productos", [])
        cod_dp = dp_actual()
        cod_dp = cod_dp[0].get("cod_dp")
        cod_dp = int(cod_dp) - 1
        cod_dp = f"DP{cod_dp}"

        for producto in productosFridays:
            Cod_prodFriday = producto.get("Cod_prodFriday")
            cantidad = producto.get("cantidad")

            # Verificar que los datos son correctos
            if Cod_prodFriday and cantidad is not None and cantidad > 0:
                insert_item_pedido(Cod_prodFriday, cantidad, cod_dp)
            else:
                return (
                    jsonify(
                        {"error": "Faltan datos para un producto o cantidad inválida"}
                    ),
                    400,
                )

        return (
            jsonify({"message": f"Items de {cod_categoria} registrados correctamente"}),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# SUMMARY
@router.route("/modulo2/registrando_pedido/summary", methods=["GET"])
def mostrar_summary():
    try:
        # cod_dp = request.args.get('cod_dp')  # Cambiar request.json por request.args.get
        cod_dp = dp_actual()
        cod_dp = cod_dp[0].get("cod_dp")
        cod_dp = int(cod_dp) - 1
        cod_dp = f"DP{cod_dp}"
        print(cod_dp)
        productos_friday = summary(cod_dp)
        return jsonify(productos_friday), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# MODULO 5


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
            return (
                jsonify({"error": "El parámetro 'codigo_empleado' es obligatorio."}),
                400,
            )

        # Llamamos a la función que obtiene las órdenes de compra para el mismo día
        print(
            f"Buscando órdenes de compra para el empleado con código: {codigo_empleado}"
        )
        ordenes = get_ordencompra_mismodia(codigo_empleado)

        # Depurar si no se encuentran órdenes
        if not ordenes:
            return (
                jsonify({"message": "No se encontraron órdenes de compra para hoy"}),
                404,
            )

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


@router.route("/contenido", methods=["POST"])
def contenido_orden_compra():
    try:
        # Obtener el 'cod_orden' del cuerpo de la solicitud
        data = request.get_json()  # Obtenemos el cuerpo de la solicitud en formato JSON
        cod_orden = data.get("cod_orden")  # Extraemos el 'cod_orden' del JSON

        if not cod_orden:
            return jsonify({"error": "Falta el código de la orden de compra"}), 400

        # Llamar a la función que obtiene el contenido de la orden de compra
        contenido = ver_contenido_orden_compra(cod_orden)

        # Estructurar la respuesta
        return jsonify({"contenido": contenido}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Ruta para ver los empleados que pueden ser supervisores
# Ruta para ver los empleados que pueden ser supervisores
@router.route("/asignacion", methods=["POST"])
def asignacion_empleado():
    try:
        # Obtener el 'cod_empleado' del cuerpo de la solicitud (JSON)
        data = request.get_json()  # Obtenemos el cuerpo de la solicitud en formato JSON
        cod_empleado = data.get("cod_empleado")  # Extraemos el 'cod_empleado' del JSON

        if not cod_empleado:
            return jsonify({"error": "Falta el código de empleado"}), 400

        # Llamamos a la función que obtiene la asignación del empleado
        contenido = get_empleado_supervisor(cod_empleado)

        # Si no se encuentra contenido, devolvemos un error 404
        if not contenido:
            return (
                jsonify(
                    {
                        "error": "Empleado no encontrado o no tiene la asignación correspondiente"
                    }
                ),
                404,
            )

        # Estructuramos la respuesta correctamente, ya que 'contenido' ahora es una lista de diccionarios
        return jsonify({"empleado": contenido}), 200

    except Exception as e:
        # Si ocurre un error inesperado, lo manejamos y devolvemos un mensaje de error genérico
        return jsonify({"error": "Ocurrió un error en el servidor: " + str(e)}), 500


## Ruta para la creación de supervisiones
@router.route("/insertar_revision", methods=["POST"])
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
        response, status_code = insertar_revision(
            cod_ordencompra, cod_supcantidad, cod_supcalidad
        )

        # Retornamos la respuesta de la función insertar_revision
        return jsonify(response), status_code

    except Exception as e:
        # Manejo de excepciones
        return jsonify({"error": "Ocurrió un error en el servidor: " + str(e)}), 500


# Ruta para actualizar el proceso de una orden de compra a 2
@router.route("/actualizar_proceso", methods=["POST"])
def actualizar_proceso():
    try:
        # Obtener los datos desde el cuerpo de la solicitud (request)
        data = request.json
        cod_ordencompra = data.get("cod_ordencompra")
        cod_proceso = data.get("cod_proceso")

        # Verificar si se proporcionaron ambos parámetros
        if not cod_ordencompra or cod_proceso is None:
            return (
                jsonify(
                    {
                        "error": "El código de la orden y el código de proceso son requeridos"
                    }
                ),
                400,
            )

        # Llamar a la función que actualiza el proceso de la orden
        filas_afectadas = actualizar_proceso_orden(cod_ordencompra, cod_proceso)

        # Verificar si se actualizó alguna fila
        if filas_afectadas > 0:
            return (
                jsonify({"message": f"{filas_afectadas} orden(es) actualizada(s)"}),
                200,
            )
        else:
            return (
                jsonify({"message": "No se encontró ninguna orden con ese código"}),
                404,
            )

    except Exception as e:
        return jsonify({"error": f"Ocurrió un error: {str(e)}"}), 500


# Ruta para ver las cantidades que llegarán:
@router.route("/cantidades", methods=["POST"])
def obtener_cantidades():
    try:
        data = request.get_json()
        cod_ordencompra = data.get("cod_ordencompra")

        if not cod_ordencompra:
            return jsonify({"error": "Falta el código de la orden de compra."}), 400

        cantidades = mostrar_cantidades(cod_ordencompra)
        if not cantidades:
            return (
                jsonify(
                    {"message": "No se encontraron insumos para la orden de compra."}
                ),
                404,
            )
        return jsonify({"cantidades": cantidades}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error al obtener las cantidades."}), 500


# Ruta para ver las calidades asociadas a una orden de compra
@router.route("/calidades", methods=["POST"])
def obtener_calidades():
    try:
        data = request.get_json()
        cod_ordencompra = data.get("cod_ordencompra")

        if not cod_ordencompra:
            return jsonify({"error": "Falta el código de la orden de compra."}), 400

        calidad = mostrar_calidades(
            cod_ordencompra
        )  # Llama a la función que ejecuta la consulta
        if not calidad:
            return (
                jsonify(
                    {"message": "No se encontraron insumos para la orden de compra."}
                ),
                404,
            )
        return jsonify({"calidades": calidad}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error al obtener los insumos de calidad."}), 500


# Ruta para ver las revisiones hechas a los insumos
# Ruta para obtener los detalles de una orden de compra


@router.route("/detalles-revision", methods=["POST"])
def obtener_detalles_revision_ruta():
    try:
        # Obtener los parámetros de la solicitud POST (en formato JSON)
        data = request.get_json()
        cod_ordencompra = data.get("cod_ordencompra")

        # Validar que el código de la orden de compra haya sido enviado
        if not cod_ordencompra:
            return jsonify({"error": "Falta el código de la orden de compra."}), 400

        # Llamar a la función que ejecuta la consulta para obtener los detalles
        detalles = obtener_detalles_revision(cod_ordencompra)

        # Verificar si se obtuvieron resultados
        if not detalles:
            return (
                jsonify(
                    {"message": "No se encontraron detalles para la orden de compra."}
                ),
                404,
            )

        # Retornar los detalles encontrados
        return jsonify({"detalles": detalles}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error al obtener los detalles de revisión."}), 500


@router.route("/actualizar-cantidad-recibida", methods=["PUT"])
def actualizar_cantidad_recibida_ruta():
    try:
        # Obtener los parámetros de la petición (en este caso, se asume que es JSON)
        data = request.get_json()

        # Verificar que se recibieron los parámetros necesarios
        cod_ordencompra = data.get("cod_ordencompra")
        cod_insumo = data.get("cod_insumo")
        cantidad_recibida = data.get("cantidad_recibida")

        if not cod_ordencompra or not cod_insumo or cantidad_recibida is None:
            return jsonify({"error": "Faltan parámetros en la solicitud"}), 400

        # Llamamos a la función de actualización
        filas_afectadas = actualizar_cantidad_recibida(
            cod_ordencompra, cod_insumo, cantidad_recibida
        )

        # Retornar el resultado de la actualización
        return jsonify({"filas_afectadas": filas_afectadas}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@router.route("/valorescalidad", methods=["GET"])
def get_valores_calidad():
    try:
        valores = (
            valorescalidad()
        )  # Llamamos a la función que consulta la base de datos
        return (
            jsonify({"valores_calidad": valores}),
            200,
        )  # Retornamos los valores en formato JSON
    except Exception as e:
        # Capturamos cualquier error durante la consulta o procesamiento
        return jsonify({"error": f"Hubo un problema: {str(e)}"}), 500


@router.route("/actualizar-revision", methods=["PUT"])
def actualizar_revision_ruta():
    try:
        # Obtener los parámetros de la petición (en este caso, se asume que es JSON)
        data = request.get_json()

        # Verificar que se recibieron los parámetros necesarios
        cod_ordencompra = data.get("cod_ordencompra")
        cod_insumo = data.get("cod_insumo")
        estado_calidad = data.get("estado_calidad")
        descripcion = data.get("descripcion")

        if (
            not cod_ordencompra
            or not cod_insumo
            or not estado_calidad
            or not descripcion
        ):
            return jsonify({"error": "Faltan parámetros en la solicitud"}), 400

        # Llamamos a la función de actualización
        filas_afectadas = actualizar_revision(
            cod_ordencompra, cod_insumo, estado_calidad, descripcion
        )

        # Retornar el resultado de la actualización
        return jsonify({"filas_afectadas": filas_afectadas}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@router.route("/ingreso_condiciones", methods=["POST"])
def obtener_ingreso_condiciones():
    try:
        # Obtener el cod_ordencompra del cuerpo de la solicitud JSON
        data = request.get_json()
        cod_ordencompra = data.get(
            "cod_ordencompra"
        )  # Extraemos el valor de cod_ordencompra

        if not cod_ordencompra:
            return (
                jsonify({"error": "El parámetro 'cod_ordencompra' es obligatorio."}),
                400,
            )

        # Llamar a la función ingreso_condiciones para obtener los detalles
        detalles = ingreso_condiciones(cod_ordencompra)

        if detalles is None:
            return (
                jsonify(
                    {"error": "No se encontraron detalles para la orden de compra."}
                ),
                404,
            )

        return jsonify({"condiciones_insumos": detalles}), 200

    except Exception as e:
        return jsonify({"error": f"Ocurrió un error inesperado: {str(e)}"}), 500


@router.route("/ver_almacen", methods=["POST"])
def ver_almacen():
    # Obtenemos los parámetros enviados en la solicitud POST
    data = request.get_json()

    # Validamos que los parámetros existan
    if "codigo_empleado" not in data or "codigo_insumo" not in data:
        return (
            jsonify({"error": "Se requieren 'codigo_empleado' y 'codigo_insumo'"}),
            400,
        )

    codigo_empleado = data["codigo_empleado"]
    codigo_insumo = data["codigo_insumo"]

    # Llamamos a la función VerAlmacen
    resultados = VerAlmacen(codigo_empleado, codigo_insumo)

    # Si hay un error o no se encontraron resultados, lo indicamos
    if isinstance(resultados, str):  # Si la función retorna un mensaje de error
        return jsonify({"error": resultados}), 400
    else:
        # Si hay resultados, los retornamos en formato JSON
        return jsonify({"resultados": resultados}), 200


@router.route("/ingresar_stock", methods=["POST"])
def obtener_ingreso_stock():
    try:
        # Obtener los parámetros enviados en la solicitud JSON
        data = request.get_json()

        # Extraemos los valores de los parámetros
        fechaven = data.get("fechaven")
        cod_insumo = data.get("cod_insumo")
        cod_ordencompra = data.get("cod_ordencompra")
        cod_almacen = data.get("cod_almacen")

        # Validar que todos los parámetros sean proporcionados
        if not fechaven or not cod_insumo or not cod_ordencompra or not cod_almacen:
            return (
                jsonify(
                    {
                        "error": "Todos los parámetros ('fechaven', 'cod_insumo', 'cod_ordencompra', 'cod_almacen') son obligatorios."
                    }
                ),
                400,
            )

        # Llamar a la función para ingresar el stock
        resultado = ingresar_stock(fechaven, cod_insumo, cod_ordencompra, cod_almacen)

        # Si la inserción fue exitosa, retornamos un mensaje de éxito
        if "Ingreso de stock realizado correctamente" in resultado:
            return jsonify({"mensaje": resultado}), 200
        else:
            return jsonify({"error": resultado}), 400

    except Exception as e:
        # Manejo de excepciones generales
        return jsonify({"error": f"Ocurrió un error inesperado: {str(e)}"}), 500


@router.route("/ingresar_movimiento", methods=["POST"])
def obtener_ingreso_movimiento():
    try:
        # Obtener los parámetros enviados en la solicitud JSON
        data = request.get_json()

        # Extraemos los valores de los parámetros
        cod_ordencompra = data.get("cod_ordencompra")
        cod_insumo = data.get("cod_insumo")
        cod_empleado = data.get("cod_empleado")

        # Validar que todos los parámetros sean proporcionados
        if not cod_ordencompra or not cod_insumo or not cod_empleado:
            return (
                jsonify(
                    {
                        "error": "Todos los parámetros ('cod_ordencompra', 'cod_insumo', 'cod_empleado') son obligatorios."
                    }
                ),
                400,
            )

        # Llamar a la función para ingresar el movimiento
        resultado = ingresar_movimiento(cod_ordencompra, cod_insumo, cod_empleado)

        # Si la inserción fue exitosa, retornamos un mensaje de éxito
        if "Ingreso de movimiento realizado correctamente" in resultado:
            return jsonify({"mensaje": resultado}), 200
        else:
            return jsonify({"error": resultado}), 400

    except Exception as e:
        # Manejo de excepciones generales
        return jsonify({"error": f"Ocurrió un error inesperado: {str(e)}"}), 500


@router.route("/actualizar-fin-ingreso", methods=["POST"])
def actualizar_fin_ingreso_ruta():
    try:
        mensaje = actualizar_fin_ingreso()  # Llamar a la función con el nuevo nombre
        return jsonify({"mensaje": mensaje})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@router.route("/actualizar-revision-calidad", methods=["POST"])
def actualizar_revision_calidad_ruta():
    try:
        # Obtener el 'cod_ordencompra' desde el cuerpo de la solicitud
        data = request.get_json()
        cod_ordencompra = data.get("cod_ordencompra")

        if not cod_ordencompra:
            return jsonify({"error": "El código de orden de compra es requerido."}), 400

        # Llamar a la función para actualizar la fecha y hora
        mensaje = actualizar_revision_calidad(cod_ordencompra)

        return jsonify({"mensaje": mensaje}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@router.route("/actualizar-revision-cantidad", methods=["POST"])
def actualizar_revision_cantidad_ruta():
    try:
        # Obtener el 'cod_ordencompra' desde el cuerpo de la solicitud
        data = request.get_json()
        cod_ordencompra = data.get("cod_ordencompra")

        if not cod_ordencompra:
            return jsonify({"error": "El código de orden de compra es requerido."}), 400

        # Llamar a la función para actualizar la fecha y hora
        mensaje = actualizar_revision_cantidad(cod_ordencompra)

        return jsonify({"mensaje": mensaje}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

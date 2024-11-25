from .db import get_db_connection
import psycopg2.extras
import psycopg2
from psycopg2.extras import RealDictCursor



def get_all_empleados():
    conn = get_db_connection()
    cursor = conn.cursor(
        cursor_factory=psycopg2.extras.DictCursor
    )  # Cambia el cursor a DictCursor
    try:
        cursor.execute("SELECT * FROM empleado;")
        return [
            dict(row) for row in cursor.fetchall()
        ]  # Convierte a lista de diccionarios
    finally:
        cursor.close()
        conn.close()


# Insertar un nuevo empleado
def create_empleado(nombre, email, salario):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO empleados (nombre, email, salario) VALUES (%s, %s, %s) RETURNING id;",
            (nombre, email, salario),
        )
        conn.commit()
        return cursor.fetchone()["id"]
    finally:
        cursor.close()
        conn.close()


# Actualizar un empleado
def update_empleado(id, nombre, email, salario):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE empleados SET nombre = %s, email = %s, salario = %s WHERE id = %s;",
            (nombre, email, salario, id),
        )
        conn.commit()
        return cursor.rowcount
    finally:
        cursor.close()
        conn.close()


# Módulo 5 (Inventario)

## Obtener todos los insumos
def get_all_insumos():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("SELECT * FROM insumo;")
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

## Mostrar condiciones
def get_all_condiciones():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("select c.nombre_condiciones from condiciones c ;")
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

## Mostrar unidades de medida
def get_all_unidades():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("select um.nombre_unidad from unidad_medidad um;")
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()


def get_local_empleado(codigo_empleado):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT e.cod_local FROM empleado e WHERE e.codigo_empleado = %s",
            (codigo_empleado,)
        )
        local = cursor.fetchone()  # Devuelve la primera fila como un RealDictRow o None

        # Verificar si local es None
        if local is None:
            return None  # Si no se encuentra ningún valor, devolver None

        # Acceder al valor utilizando la clave 'cod_local' en lugar de un índice
        if 'cod_local' in local and local['cod_local'] is not None:
            return int(local['cod_local'])  # Convertir explícitamente a entero
        else:
            return None  # Si el valor de 'cod_local' es None, devolver None
    finally:
        cursor.close()
        conn.close()






## Ver órdenes de compra que deberían llegar el mismo día
def get_ordencompra_mismodia(codigo_empleado):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)  # Usamos RealDictCursor para que los resultados sean diccionarios
    
    try:
        # Obtener el local del empleado
        local = get_local_empleado(codigo_empleado)
        if local is None:  # Si no se encuentra el local, devolver un mensaje de error o lanzar una excepción
            raise ValueError("El empleado no tiene un local asignado o no existe.")

        # Consultar órdenes de compra para el mismo día
        cursor.execute("""
            SELECT 
                oc.cod_ordencompra, 
                p.nombre_empresa, 
                pi2.nombre_proceso 
            FROM orden_compra oc
            INNER JOIN proveedor p ON p.cod_proveedor = oc.cod_proveedor
            INNER JOIN proceso_ingreso pi2 ON pi2.cod_proceso = oc.cod_proceso
            INNER JOIN empleado e ON e.codigo_empleado = oc.codigo_empleado
            WHERE e.cod_local = %s
            AND oc.fecha_requeridaentrega = current_date
            ORDER BY pi2.cod_proceso ASC;
        """, (local,))

        # Obtener todos los resultados de la consulta
        resultados = cursor.fetchall()

        # Si no se encuentran resultados, devolver None o una respuesta vacía
        if not resultados:
            return None
        
        return resultados  # Los resultados ya son diccionarios debido a RealDictCursor

    finally:
        cursor.close()
        conn.close()


## Ver contenido de la orden de compra
def ver_contenido_orden_compra(cod_orden):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        # Consultar contenido de la orden de compra
        cursor.execute(
            """
            select i.nombre_insumo, um.nombre_unidad, oc2.cantidad_compra from orden_compra oc 
            inner join orden_comprainsumo oc2 on oc2.cod_ordencompra = oc.cod_ordencompra
            inner join insumo i on oc2.cod_insumo = i.cod_insumo 
            inner join unidad_medidad um on um.cod_unidad = i.cod_unidad 
            where oc.cod_ordencompra = %s
            """,
            (cod_orden,)
        )

        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()



## Mostrar empleados para seleccionar supervisores
def get_empleado_supervisor(cod_empleado):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)  # Usar RealDictCursor
    try:
        local = get_local_empleado(cod_empleado)

        cursor.execute(
            """
            select 
            e.codigo_empleado,
            CONCAT(e.primer_nombre,' ', e.primer_apellido,' ', e.segundo_apellido) as "Nombre"
            from empleado e 
            inner join posee p on p.codigo_empleado = e.codigo_empleado 
            where p.cod_habilidad = 6
            and e.cod_cargo = 1
            and e.cod_local = %s
            """,
            (local,)
        )

        # Obtener los resultados de la consulta
        resultados = cursor.fetchall()
        return resultados  # Devuelve directamente los resultados en formato RealDictRow

    finally:
        cursor.close()
        conn.close()




## Creación de supervisiones

def insertar_revision(cod_ordencompra, cod_supcantidad, cod_supcalidad):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        # Inserción de los datos en la tabla Revision basados en los parámetros proporcionados
        cursor.execute(
            """
            INSERT INTO Revision (cod_ordencompra, cod_insumo, cod_supcantidad, cod_supcalidad, cantidad_recibida, fechahora_cantidad, Cod_Calidad, fechahora_calidad, descripcion)
            SELECT 
                oci.cod_ordencompra,
                oci.cod_insumo,
                %s,
                %s,
                NULL,
                NULL,
                NULL,
                NULL,
                NULL
            FROM 
                Orden_comprainsumo oci
            WHERE 
                oci.cod_ordencompra = %s;
            """,
            (cod_supcantidad, cod_supcalidad, cod_ordencompra)
        )
        conn.commit()
        return {"message": "Revisión insertada correctamente"}, 200
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


## Actualizar proceso
# Función para actualizar el proceso de una orden de compra
def actualizar_proceso_orden(cod_ordencompra, cod_proceso):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        # Actualizar el proceso de la orden al valor especificado
        cursor.execute(
            """
            UPDATE orden_compra 
            SET cod_proceso = %s 
            WHERE cod_ordencompra = %s
            """,
            (cod_proceso, cod_ordencompra)
        )
        filas_afectadas = cursor.rowcount  # Número de filas actualizadas
        conn.commit()
        return filas_afectadas
    finally:
        cursor.close()
        conn.close()


#Mostrar tabla de las cantidades que deberían llegar:
def mostrar_cantidades(cod_ordencompra):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute(
            """
            SELECT distinct
                i.cod_insumo,
                i.nombre_insumo, 
                um.nombre_unidad, 
                oc.cantidad_compra 
            FROM 
                revision r
            INNER JOIN 
                insumo i ON r.cod_insumo = i.cod_insumo
            INNER JOIN 
                unidad_medidad um ON um.cod_unidad = i.cod_unidad
            INNER JOIN 
                orden_comprainsumo oc ON oc.cod_ordencompra = r.cod_ordencompra AND oc.cod_insumo = r.cod_insumo
            WHERE 
                r.cod_ordencompra = %s;
            """,
            (cod_ordencompra,)
        )
        cantidades = cursor.fetchall()  # Número de filas actualizadas
        return cantidades
    finally:
        cursor.close()
        conn.close()


# Función para actualizar la cantidad recibida
def actualizar_cantidad_recibida(cod_ordencompra, cod_insumo, cantidad_recibida):
    conn = get_db_connection()  # Asegúrate de que esta función esté definida correctamente
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        # Consulta SQL para actualizar la cantidad recibida
        cursor.execute(
            """
            UPDATE Revision r
            SET cantidad_recibida = %s
            FROM Orden_comprainsumo oci
            WHERE 
                r.cod_ordencompra = oci.cod_ordencompra
                AND r.cod_insumo = oci.cod_insumo
                AND oci.cod_ordencompra = %s
                AND oci.cod_insumo = %s;
            """,
            (cantidad_recibida, cod_ordencompra, cod_insumo)  # Se pasan los parámetros para la consulta
        )
        
        filas_afectadas = cursor.rowcount  # Número de filas actualizadas
        conn.commit()  # Se hace el commit de los cambios en la base de datos
        return filas_afectadas
    finally:
        cursor.close()  # Cerramos el cursor
        conn.close()  # Cerramos la conexión a la base de datos


# Función para ver las calidades
def valorescalidad():
    conn = get_db_connection()  # Obtenemos la conexión a la base de datos
    cursor = conn.cursor(cursor_factory=RealDictCursor)  # Usamos RealDictCursor para devolver los resultados como diccionarios

    try:
        # Ejecutamos la consulta SQL
        cursor.execute("SELECT c.estado FROM calidad c;")
        resultados = cursor.fetchall()  # Obtenemos todos los resultados
        
        # Retornamos solo los estados, como una lista
        return resultados

    finally:
        cursor.close()
        conn.close()


# Mostrar calidades
def mostrar_calidades(cod_ordencompra):
    conn = get_db_connection()  # Obtenemos la conexión a la base de datos
    cursor = conn.cursor(cursor_factory=RealDictCursor)  # Usamos RealDictCursor para devolver los resultados como diccionarios
    try:
        # Consulta SQL para obtener los insumos
        cursor.execute(
            """
            SELECT DISTINCT 
                i.cod_insumo,
                i.nombre_insumo  
            FROM 
                Orden_Compra oc
            LEFT JOIN 
                Orden_CompraInsumo oc2 ON oc2.cod_ordencompra = oc.cod_ordencompra 
            LEFT JOIN 
                Revision r ON r.cod_ordencompra = oc.cod_ordencompra 
                AND r.cod_insumo = oc2.cod_insumo
            LEFT JOIN 
                Insumo i ON oc2.cod_insumo = i.cod_insumo 
            LEFT JOIN 
                Calidad c ON r.cod_calidad = c.cod_calidad 
            WHERE 
                oc.cod_ordencompra = %s;
            """,
            (cod_ordencompra,)  # Pasamos el parámetro a la consulta
        )
        resultados = cursor.fetchall()  # Obtenemos los resultados
        return resultados
    finally:
        cursor.close()
        conn.close()


def actualizar_revision(cod_ordencompra, cod_insumo, estado_calidad, descripcion):
    conn = get_db_connection()  # Asegúrate de que esta función esté definida correctamente
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        # Consulta SQL para actualizar la calidad y la descripción
        cursor.execute(
            """
            UPDATE Revision r
            SET 
                Cod_calidad = c.cod_calidad,
                descripcion = %s
            FROM 
                Orden_CompraInsumo oc2
            JOIN 
                Calidad c ON c.estado = %s
            WHERE 
                oc2.cod_ordencompra = r.cod_ordencompra
                AND r.cod_insumo = oc2.cod_insumo
                AND oc2.cod_ordencompra = %s
                AND oc2.cod_insumo = %s;
            """,
            (descripcion, estado_calidad, cod_ordencompra, cod_insumo)  # Se pasan los parámetros para la consulta
        )
        
        filas_afectadas = cursor.rowcount  # Número de filas actualizadas
        conn.commit()  # Se hace el commit de los cambios en la base de datos
        return filas_afectadas
    finally:
        cursor.close()  # Cerramos el cursor
        conn.close()  # Cerramos la conexión a la base de datos








# Función para obtener la información de una orden de compra y sus insumos
def obtener_detalles_revision(cod_ordencompra):
    conn = get_db_connection()  # Asegúrate de tener una función de conexión a tu base de datos
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute(
            """
            SELECT distinct
                i.cod_insumo, 
                i.nombre_insumo, 
                oc2.cantidad_compra, 
                r.cantidad_recibida, 
                c.estado, 
                r.descripcion  
            FROM 
                revision r
            INNER JOIN 
                insumo i ON r.cod_insumo = i.cod_insumo 
            INNER JOIN 
                orden_compra oc ON oc.cod_ordencompra = r.cod_ordencompra
            INNER JOIN 
                orden_comprainsumo oc2 ON oc.cod_ordencompra = oc2.cod_ordencompra 
            AND 
                oc2.cod_insumo = r.cod_insumo
            INNER JOIN 
                calidad c ON c.cod_calidad = r.cod_calidad 
            WHERE 
                r.cod_ordencompra = %s
            """,
            (cod_ordencompra,)  # Parámetro de la consulta
        )

        # Obtener todos los resultados de la consulta
        resultados = cursor.fetchall()

        # Si no hay resultados, devolver None o una respuesta vacía
        if not resultados:
            return None

        return resultados
    finally:
        cursor.close()
        conn.close()



def ingreso_condiciones(cod_ordencompra):
    conn = get_db_connection()  # Asegúrate de tener una función de conexión a tu base de datos
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute(
            """
            select distinct i.cod_insumo, i.nombre_insumo, r.cantidad_recibida, c.nombre_condiciones
            from revision r
            inner join insumo i on r.cod_insumo = i.cod_insumo
            inner join condiciones c on c.cod_condiciones = i.cod_condiciones 
            where r.cod_ordencompra = %s
            """,
            (cod_ordencompra,)  # Parámetro de la consulta
        )

        # Obtener todos los resultados de la consulta
        resultados = cursor.fetchall()

        # Si no hay resultados, devolver None o una respuesta vacía
        if not resultados:
            return None

        return resultados

    finally:
        cursor.close()
        conn.close()


def VerAlmacen(codigo_empleado, codigo_insumo):
    # Obtener el cod_local del empleado
    cod_local = get_local_empleado(codigo_empleado)
    
    if cod_local is None:
        return "El empleado no tiene un local asignado."  # Manejo de caso cuando no se encuentra el local
    
    conn = get_db_connection()  # Asumiendo que esta función ya está definida para obtener conexión
    cursor = conn.cursor()

    try:
        # Ejecutamos la consulta con los parámetros necesarios
        cursor.execute("""
            SELECT ta.nombre_tipo_almacen, a.cod_almacen, l.nombre_local 
            FROM almacen a
            INNER JOIN "local" l ON a.cod_local = l.cod_local
            INNER JOIN tipo_almacen ta ON ta.cod_tipo_almacen = a.cod_tipo_almacen
            INNER JOIN Compatibilidad c ON c.cod_tipo_almacen = ta.cod_tipo_almacen 
            INNER JOIN condiciones co ON co.cod_condiciones = c.cod_condiciones
            WHERE a.cod_local = %s
            AND co.cod_condiciones = (
                SELECT i.cod_condiciones
                FROM insumo i
                WHERE i.cod_insumo = %s
            );
        """, (cod_local, codigo_insumo))

        # Obtener los resultados
        resultados = cursor.fetchall()
        
        if not resultados:
            return "No se encontraron resultados para la consulta."

        # Devolver los resultados
        return resultados

    except Exception as e:
        # Manejar posibles errores
        return f"Error al ejecutar la consulta: {str(e)}"
    
    finally:
        # Cerrar la conexión
        cursor.close()
        conn.close()




def ingresar_stock(fechaven, cod_insumo, cod_ordencompra, cod_almacen):
    conn = get_db_connection()  # Asegúrate de tener una función de conexión a tu base de datos
    cursor = conn.cursor()

    try:
        # Ejecutar la nueva consulta de inserción con los parámetros proporcionados
        cursor.execute("""
            INSERT INTO stock (fecha_vencimiento, cantidad, cod_insumo, cod_proveedor, cod_almacen)
            VALUES (%s,
                    (SELECT r.cantidad_recibida FROM revision r WHERE r.cod_ordencompra = %s AND r.cod_insumo = %s),
                    %s,
                    (SELECT oc.cod_proveedor FROM orden_compra oc WHERE oc.cod_ordencompra = %s),
                    %s);
        """, (fechaven, cod_ordencompra, cod_insumo, cod_insumo, cod_ordencompra, cod_almacen))

        # Confirmar la transacción
        conn.commit()

        return "Ingreso de stock realizado correctamente."

    except Exception as e:
        # Manejar posibles errores
        return f"Error al ingresar stock: {str(e)}"

    finally:
        # Cerrar la conexión
        cursor.close()
        conn.close()



def ingresar_movimiento(cod_ordencompra, cod_insumo, cod_empleado):
    conn = get_db_connection()  # Asegúrate de tener una función de conexión a tu base de datos
    cursor = conn.cursor()

    try:
        # Ejecutar la consulta de inserción con los parámetros proporcionados
        cursor.execute("""
            INSERT INTO movimiento (fecha_movimiento, cantidad_movimiento, fecha_fin, codigo_empleado, cod_stock, cod_tipomovimiento)
            VALUES (
                NOW(),
                (SELECT r.cantidad_recibida FROM revision r WHERE r.cod_ordencompra = %s AND r.cod_insumo = %s),
                NULL,
                %s,
                (SELECT MAX(cod_stock) FROM stock),
                1  -- cod_tipomovimiento siempre será 1
            );
        """, (cod_ordencompra, cod_insumo, cod_empleado))

        # Confirmar la transacción
        conn.commit()

        return "Ingreso de movimiento realizado correctamente."

    except Exception as e:
        # Manejar posibles errores
        return f"Error al ingresar movimiento: {str(e)}"

    finally:
        # Cerrar la conexión
        cursor.close()
        conn.close()


def actualizar_fin_ingreso():
    conn = get_db_connection()  # Asegúrate de tener una función de conexión a tu base de datos
    cursor = conn.cursor()

    try:
        # Ejecutar la consulta de actualización
        cursor.execute("""
            UPDATE movimiento
            SET fecha_fin = NOW()
            WHERE cod_movimiento = (
                SELECT MAX(cod_movimiento)
                FROM movimiento
            );
        """)

        # Confirmar la transacción
        conn.commit()

        return "Fecha de fin actualizada correctamente."

    except Exception as e:
        # Manejar posibles errores
        return f"Error al actualizar fecha de fin: {str(e)}"

    finally:
        # Cerrar la conexión
        cursor.close()
        conn.close()



def actualizar_revision_calidad(cod_ordencompra):
    conn = get_db_connection()  # Asegúrate de tener una función de conexión a tu base de datos
    cursor = conn.cursor()

    try:
        # Ejecutar la consulta de actualización
        cursor.execute("""
            UPDATE Revision r
            SET fechahora_calidad = NOW()
            WHERE r.cod_ordencompra = %s;
        """, (cod_ordencompra,))

        # Confirmar la transacción
        conn.commit()

        return "Fecha y hora de calidad actualizada correctamente."

    except Exception as e:
        # Manejar posibles errores
        return f"Error al actualizar fecha y hora de calidad: {str(e)}"

    finally:
        # Cerrar la conexión
        cursor.close()
        conn.close()




def actualizar_revision_cantidad(cod_ordencompra):
    conn = get_db_connection()  # Asegúrate de tener una función de conexión a tu base de datos
    cursor = conn.cursor()

    try:
        # Ejecutar la consulta de actualización
        cursor.execute("""
            UPDATE Revision r
            SET fechahora_cantidad = NOW()
            WHERE r.cod_ordencompra = %s;
        """, (cod_ordencompra,))

        # Confirmar la transacción
        conn.commit()

        return "Fecha y hora de cantidad actualizada correctamente."

    except Exception as e:
        # Manejar posibles errores
        return f"Error al actualizar fecha y hora de cantidad: {str(e)}"

    finally:
        # Cerrar la conexión
        cursor.close()
        conn.close()

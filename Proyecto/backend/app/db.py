import psycopg2
from psycopg2.extras import RealDictCursor
from .config import Config


def get_db_connection():
    try:
        conn = psycopg2.connect(
            dsn=Config.DATABASE_URI,
            cursor_factory=RealDictCursor,  # Retorna resultados como diccionarios
        )
        return conn
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")
        raise

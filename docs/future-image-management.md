# Idea futura: gestión externa de imágenes

La landing actualmente debe continuar usando las imágenes optimizadas incluidas en `public/img`, servidas como archivos estáticos desde Vercel. Esta opción es la más estable para el sitio actual: no requiere API keys, funciones, permisos externos ni servicios adicionales.

## Idea pendiente

Permitir que las imágenes del carrusel principal puedan actualizarse sin modificar el repositorio ni realizar un despliegue manual.

## Opciones a evaluar más adelante

- Un servicio especializado de imágenes con CDN, optimización automática y transformaciones.
- Un almacenamiento de objetos con URLs públicas y caché.
- Google Drive únicamente si se acepta administrar permisos, API keys, cuotas y un proxy servidor.

## Requisitos para decidir

- Mantener siempre un fallback local funcional.
- No bloquear la carga inicial de la landing esperando un servicio externo.
- Optimizar automáticamente WebP/AVIF y tamaños móviles.
- Usar caché CDN y evitar servir imágenes grandes desde funciones.
- Mantener las credenciales fuera del repositorio.
- Permitir sustituir, ordenar y retirar imágenes de forma sencilla.
- Verificar límites, términos de uso y costos antes de ponerlo en producción.

No se integra ninguna implementación externa en esta versión. Esta documentación solo conserva la idea para evaluarla posteriormente.

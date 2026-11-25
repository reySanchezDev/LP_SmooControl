# Mensajes temporales del header

La franja del header muestra un mensaje dentro de un rango de fechas y se oculta
automáticamente al vencer. El texto y sus fechas se administran en
[`public/header-messages.json`](../public/header-messages.json).

## Mensaje de Jasmine

Texto exacto:

> ¡Vamos, Jasmine! La Sazón de Sheyla está con vos. ¡Brillá, Nicaragua!

Su vigencia corresponde únicamente al **24 de noviembre de 2026 en Nicaragua**:

- Inicio: `2026-11-24T00:00:00-06:00`.
- Fin exclusivo: `2026-11-25T00:00:00-06:00`.
- Equivalente UTC del fin: `2026-11-25T06:00:00Z`.

A las 00:00 del día 25 ya no debe mostrarse. No hay que esperar otro despliegue ni
eliminar manualmente el registro para que desaparezca.

## Programar los próximos mensajes

1. Edita `public/header-messages.json`, manteniendo `timeZone: "America/Managua"`.
2. Agrega un objeto a `messages` con un `id` único, texto, fecha de inicio y fin.
3. Usa siempre fechas completas con segundos y zona horaria. Para Nicaragua,
   escribe el sufijo **`-06:00`**; no uses fechas sin zona ni expresiones como
   «hoy» o «mañana» dentro de los campos de vigencia.
4. Conserva los registros que quieras guardar como historial. Para desactivar uno
   antes de su vencimiento, cambia `enabled` a `false` y publica el cambio.
5. Ejecuta la validación y las pruebas, y sube el archivo a `main` en GitHub.
   Vercel incorporará el calendario al siguiente despliegue.

Ejemplo de un mensaje para todo el 1 de diciembre, **solo como ejemplo**:

```json
{
  "timeZone": "America/Managua",
  "messages": [
    {
      "id": "bienvenida-diciembre-2026-12-01",
      "text": "¡Bienvenido, diciembre!",
      "startsAt": "2026-12-01T00:00:00-06:00",
      "endsAt": "2026-12-02T00:00:00-06:00",
      "priority": 10,
      "enabled": true
    }
  ]
}
```

Al agregar un mensaje, incorpora el objeto al arreglo existente; no sustituyas
otros mensajes programados por el ejemplo.

| Campo | Regla |
| --- | --- |
| `id` | Identificador único y estable para el mensaje. |
| `text` | Texto plano, con tildes y signos correctos. No admite HTML. Mantén los mensajes cortos. |
| `startsAt` | Primer instante en que se permite mostrarlo, inclusive. |
| `endsAt` | Primer instante en que deja de mostrarse, exclusivo. Debe ser posterior al inicio. |
| `priority` | Número; gana el mayor si coinciden varios mensajes. Por defecto, `0`. |
| `enabled` | `false` permite desactivarlo. Si se omite, se considera activo dentro de sus fechas. |

Si coinciden mensajes con la misma prioridad, gana el que haya comenzado más
recientemente. Si también coincide el inicio, se desempata por `id` en orden
alfabético. Solo se muestra un mensaje a la vez; no hay rotación entre campañas.
Para quitar todos los mensajes, conserva el archivo y deja `"messages": []`.

## Comportamiento del sitio

- El rango se evalúa en el navegador como un instante absoluto: cambiar la zona
  horaria del visitante no cambia el vencimiento. El reloj del dispositivo debe
  estar correctamente ajustado y JavaScript debe estar habilitado.
- Se programa un temporizador para el siguiente inicio o vencimiento. También se
  revisa el reloj al menos cada minuto y al volver a enfocar o mostrar la pestaña.
  Si el navegador suspende una pestaña, se corrige al reanudarla.
- Se consulta `/header-messages.json` sin caché al cargar y aproximadamente cada
  minuto, para recoger nuevos calendarios publicados sin exigir una recarga.
- Si esa consulta falla, sigue funcionando el calendario incluido en el último
  despliegue o el último válido recibido. Su fecha de fin se sigue respetando.
- Un calendario remoto inválido se ignora. Los calendarios inválidos en el
  repositorio detienen `dev` y `build` antes de publicar.
- En escritorio el texto va dentro del header original de 64px, centrado entre
  el nombre del restaurante y el horario. No crea una franja, fondo adicional ni
  espacio debajo del header. Mantén los mensajes cortos para ese espacio central.
- En móvil se conserva la franja inferior de mayor alto, con una sola fila y
  desplazamiento suave cuando el texto no cabe.
- Con movimiento reducido no hay desplazamiento automático: la fila permite
  desplazamiento horizontal manual. Al enfocar la franja también se pausa el
  movimiento. El texto completo permanece disponible para lectores de pantalla.
- Solo en móvil se mide la franja para reservar su espacio bajo el header.
  Al vencer, se retiran tanto el mensaje como ese espacio adicional. En escritorio
  la altura y el comienzo del contenido permanecen iguales con o sin mensaje.

## Validación y publicación

```bash
node scripts/validate-header-messages.mjs
npm run test:header-messages
npm run build
git add public/header-messages.json
git commit -m "Schedule header message"
git push origin main
```

Los archivos de texto deben guardarse en UTF-8. Comprueba el mensaje en móvil y
escritorio, los acentos, el comienzo y el vencimiento. No cambies los temporizadores
o el CSS para programar una campaña; usa únicamente el calendario JSON.

La validación exige fechas ISO válidas con zona explícita, inicio anterior al fin,
texto no vacío, identificadores únicos y tipos correctos. Las pruebas cubren la
medianoche de Nicaragua, mensajes desactivados, coincidencias y calendarios vacíos.

Las pruebas del mensaje de Jasmine conservan esa fecha histórica como caso de
regresión. Al archivar o retirar su registro, conserva sus datos de prueba como
fixture para seguir verificando el límite de medianoche.

# Actualizar las imágenes del carrusel

## Carpeta correcta

Deja las imágenes optimizadas directamente en:

```text
public/img/
```

Esa es la única carpeta que debe recibir las imágenes del carrusel. No uses `src/assets`, `public/images` ni otra carpeta.

## Formatos admitidos

`.webp`, `.avif`, `.jpg`, `.jpeg` y `.png`.

El sistema genera automáticamente `public/img-manifest.json` durante `npm run dev` y `npm run build`. El carrusel y la galería leen ese manifiesto, por lo que no hay que editar manualmente los componentes Astro.

## Procedimiento

1. Antes de subir la imagen, elige el nombre del archivo según las reglas de la siguiente sección: ese nombre se usará como nombre visible del producto.
2. Optimiza la imagen, cópiala a `public/img/` y, si necesitas un nombre visible diferente, agrega su excepción a `public/img-labels.json`, conservando las entradas existentes.
3. Para probarla localmente, ejecuta:

   ```bash
   npm run dev -- --background
   ```

4. Para publicarla, agrega el archivo al repositorio y haz push a `main`:

   ```bash
   git add public/img/mi-imagen.webp
   git add public/img-labels.json
   git commit -m "Add carousel image"
   git push origin main
   ```

5. Vercel ejecutará el build y la imagen aparecerá automáticamente en el carrusel.

## Cómo nombrar imágenes nuevas

- Usa el nombre real del producto, en minúsculas y con guiones entre palabras: `tacos-al-pastor.webp`.
- Elige nombres cortos y legibles. Evita nombres como `IMG_20261124.webp`, `foto-final-2.webp`, códigos de cámara, fechas y números de versión: el sistema también mostraría esas palabras o números.
- Los guiones bajos se admiten y se convierten en espacios, pero usa guiones para mantener una convención uniforme.
- Preferiblemente usa nombres de archivo sin tildes y escribe el nombre correcto, con sus acentos y mayúsculas, en `public/img-labels.json` cuando haga falta. El sistema admite tildes en los nombres de archivo; guarda el archivo de configuración en UTF-8.
- Si el archivo contiene un sufijo técnico como `-mesa`, usa una excepción para que ese sufijo no aparezca en la etiqueta. El sistema no elimina palabras técnicas automáticamente.
- Para cambiar solo el texto visible de una imagen existente, edita su excepción. Conserva el archivo y el resto de las excepciones.

| Nombre del archivo | Texto automático | Excepción recomendada |
| --- | --- | --- |
| `tacos-al-pastor.webp` | Tacos al pastor | No hace falta |
| `refresco-de-cacao.webp` | Refresco de cacao | No hace falta |
| `sueno-de-verano.webp` | Sueno de verano | Sueño de Verano |
| `cerdo-asado-mesa.webp` | Cerdo asado mesa | Cerdo asado |

## Nombre del producto debajo del carrusel

La etiqueta se actualiza junto con cada fotografía. El build genera `productLabel` en
`public/img-manifest.json`, usando el nombre del archivo sin extensión, cambiando
guiones y guiones bajos por espacios y poniendo la primera letra en mayúscula.
Por ejemplo, `tacos-al-pastor.webp` muestra **Tacos al pastor** automáticamente.

Si necesitas una tilde, una presentación más corta o un nombre comercial, puedes
añadir una excepción opcional en `public/img-labels.json`:

```json
{
  "cacao.webp": "Refresco de cacao",
  "cerdo-asado-mesa.webp": "Cerdo asado"
}
```

La clave debe coincidir exactamente con el archivo. Las imágenes sin excepción
siguen funcionando automáticamente; no hace falta enumerarlas todas. Los acentos
deben estar en el nombre del archivo o en la excepción: el sistema no adivina
nombres ni ingredientes a partir de la foto. La etiqueta no cambia los nombres
existentes de la galería.

Sube los archivos nuevos y, si la utilizaste, la excepción a GitHub. Vercel genera
el manifiesto de nuevo durante el build; no edites `img-manifest.json` a mano.

## Comprobaciones antes de publicar

1. Confirma que el archivo tiene un nombre descriptivo y un formato admitido.
2. Si añadiste una excepción, comprueba que la clave coincide exactamente con el nombre y la extensión del archivo, incluidas las mayúsculas. Añádela al objeto JSON existente; no sustituyas los nombres de otros productos.
3. Ejecuta `npm run build` para regenerar el manifiesto y validar el JSON. Si cambias nombres durante una sesión local, regenera el manifiesto o reinicia el servidor: no se vuelve a generar con cada cambio en la carpeta.
4. Revisa que la etiqueta muestre el nombre correcto al aparecer la foto y que los acentos se vean bien en móvil y escritorio.
5. Incluye en el mismo commit la imagen y, si corresponde, `public/img-labels.json`. Tras publicar, comprueba el resultado en el sitio.

## Quitar o reemplazar imágenes

Elimina el archivo de `public/img/` y haz commit/push. Para reemplazar una imagen, conserva el nombre si quieres que la referencia sea estable; de lo contrario, usa un nuevo nombre descriptivo.

Si renombras o eliminas un archivo con una excepción, actualiza o elimina también su clave en `public/img-labels.json`.

## Importante

Las imágenes que solo estén en una rama local o en una rama distinta de `main` no llegan a producción. Deben existir en `main/public/img/` y formar parte del despliegue de Vercel.

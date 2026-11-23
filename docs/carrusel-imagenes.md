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

1. Optimiza la imagen y copia el archivo a `public/img/`.
2. Usa un nombre descriptivo, por ejemplo `cerdo-asado-mesa.webp`.
3. Para probarla localmente, ejecuta:

   ```bash
   npm run dev
   ```

4. Para publicarla, agrega el archivo al repositorio y haz push a `main`:

   ```bash
   git add public/img/mi-imagen.webp
   git commit -m "Add carousel image"
   git push origin main
   ```

5. Vercel ejecutará el build y la imagen aparecerá automáticamente en el carrusel.

## Quitar o reemplazar imágenes

Elimina el archivo de `public/img/` y haz commit/push. Para reemplazar una imagen, conserva el nombre si quieres que la referencia sea estable; de lo contrario, usa un nuevo nombre descriptivo.

## Importante

Las imágenes que solo estén en una rama local o en una rama distinta de `main` no llegan a producción. Deben existir en `main/public/img/` y formar parte del despliegue de Vercel.

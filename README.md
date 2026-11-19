# Biblioteca Técnica CAEX 794 AC – PWA

Aplicación basada en el HTML original, conservando sus datos e ilustraciones integrados. Incluye manifest, iconos, registro de Service Worker y ajustes de interfaz móvil.

## Probar localmente
Ejecuta un servidor HTTP desde esta carpeta (no abrir index.html directamente):

```bash
python -m http.server 8000
```
Abre http://localhost:8000. La instalación PWA requiere HTTPS o localhost.

## Publicar en GitHub Pages
Sube el contenido completo de esta carpeta a la rama configurada para GitHub Pages. La app usa rutas relativas para funcionar desde un subdirectorio.

En iPhone/iPad: abrir en Safari y usar Compartir → Añadir a pantalla de inicio. En Android: usar Instalar aplicación cuando el navegador lo ofrezca.

## Nota
El modo offline cachea la aplicación y los recursos que se van solicitando. Para que el primer uso offline funcione, abre la app una vez con conexión.

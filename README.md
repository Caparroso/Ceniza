# Ceniza — MEX-í-CAN: Al Grito de Guerra

Invitación web estática para la exposición audiovisual y performance en vivo
curada por Ian Jaramillo. Está preparada para GitHub Pages y para abrirse
localmente en VS Code con Live Server.

## Vista previa en VS Code

1. Abre esta carpeta completa en VS Code.
2. Haz clic derecho sobre `index.html`.
3. Selecciona **Open with Live Server**.

No requiere instalar Node, npm ni dependencias.

## Estructura

```text
index.html          contenido y estructura de la invitación
styles.css          diseño, responsive y animaciones
script.js           intro, video progresivo, registro y boleto
config.js           datos editables del evento y Formspree
assets/             imágenes, logos y video optimizados
vendor/             generador local de códigos QR
.nojekyll           compatibilidad directa con GitHub Pages
```

## Experiencia

- Entrada negra y mínima: el visitante toca el sello central para habilitar el sonido.
- Intro a pantalla completa con tres logotipos dentro de la recámara activa, tres detonaciones, giro mecánico y humo.
- El armazón del revólver permanece inmóvil; únicamente rota el tambor.
- Las recámaras están vacías y negras: cada logotipo funciona como la carga que se detona y desaparece.
- En teléfono y tablet vertical, el logotipo permanece centrado dentro de la recámara superior; en horizontal se muestra el encuadre completo.
- El arma aparece como un contorno tenue, sin textos ni controles visibles durante la secuencia.
- `IA BACKGROUND` comienza con el primer toque y se repite durante toda la experiencia.
- `SHOOT SOUND` se reproduce desde el inicio en cada una de las tres detonaciones.
- Fotografía principal de íA.
- Manifiesto, línea temporal, programa, ubicación y registro.
- Boleto individual con token, QR, recuperación local y modo screenshot.
- Animaciones reducidas automáticamente si el dispositivo lo solicita.
- El video de 9 MB se carga sólo cuando el visitante se acerca a su sección.

## Registro

El registro usa el buzón de Formspree dedicado a
**MEX-í-CAN — Al Grito de Guerra**.

La configuración está en `config.js`:

```js
formEndpoint: "https://formspree.io/f/xdeodooy"
```

Si se crea un formulario exclusivo para Ceniza, sólo hay que reemplazar esa
dirección. No es necesario modificar `script.js`.

Formspree recibe:

- nombre;
- Instagram opcional;
- token individual;
- fecha y hora de registro;
- evento y ubicación.

El boleto se genera únicamente después de que Formspree confirma la recepción.
Una copia queda guardada en el navegador del visitante para poder recuperarla.

## Publicar en GitHub Pages

Sube todo el contenido de esta carpeta sin cambiar la estructura. Después,
activa GitHub Pages para la rama y carpeta donde se encuentran estos archivos.

Cuando exista la URL pública final, conviene reemplazar los valores relativos
de `og:image` y `twitter:image` en `index.html` por la dirección absoluta de
`assets/og-ceniza.jpg`. Esto mejora la miniatura en WhatsApp e Instagram.

## Datos editables

Nombre del evento, fecha, ubicación, liga de Maps y destino del registro están
centralizados en `config.js`. El programa y los textos curatoriales están en
`index.html`.

## Archivos principales

- `assets/ia-portrait.webp`: retrato web optimizado de íA.
- `assets/tree-timelapse.mp4`: video original del árbol.
- `assets/tree-poster.webp`: imagen ligera previa al video.
- `assets/revolver-frame.webp`: contorno inmóvil del armazón.
- `assets/revolver-drum.webp`: contorno independiente del tambor animado.
- `assets/revolver-empty.webp`: cilindro corregido con las recámaras vacías.
- `assets/revolver-cylinder.webp`: imagen fuente conservada para futuros ajustes.
- `assets/ia-background.mp3`: ambiente musical continuo de la invitación.
- `assets/shoot-sound.mp3`: detonación utilizada en los tres disparos.
- `assets/logo-ceniza.png`, `logo-edb.png`, `logo-xcu.png`: logos optimizados con transparencia.
- `assets/logo-ceniza-light.png`, `logo-edb-light.png`, `logo-xcu-light.png`: versiones claras LOGO2 usadas dentro de las recámaras.
- `assets/og-ceniza.jpg`: imagen para compartir el enlace.

## Nota de fecha

La invitación usa el lineup más reciente recibido:

- Apertura: 7:30 PM.
- Show de íA: 11:25 PM.
- Cierre: 3:00 AM.

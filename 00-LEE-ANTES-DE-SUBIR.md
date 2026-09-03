# Qué subir a GitHub

Abre esta carpeta y selecciona **todo su contenido**. Arrastra esos archivos y
carpetas a la raíz del repositorio. No subas la carpeta
`CENIZA-GITHUB-PAGES-SUBIR-ESTO` como una subcarpeta.

En la página principal del repositorio deben verse directamente:

```text
index.html
styles.css
script.js
config.js
assets/
vendor/
.nojekyll
```

## Activar GitHub Pages

1. Abre **Settings → Pages**.
2. En **Source**, selecciona **Deploy from a branch**.
3. Elige la rama **main** y la carpeta **/(root)**.
4. Guarda y espera a que GitHub muestre la liga publicada.

Si `index.html` aparece dentro de otra carpeta o Pages apunta a `/docs`, la
dirección principal puede mostrar un error 404.

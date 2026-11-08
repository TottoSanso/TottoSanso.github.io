# TottoSanso228 · web

Página estática (HTML/CSS/JS, sin build).

## Agregar una news
Editá `news.json` y sumá un objeto al principio de la lista:

```json
{
  "date": "2026-11-19",
  "title": "Título",
  "body": "Texto corto.",
  "image": "assets/mi-imagen.jpg",
  "link": "https://...",
  "linkText": "Ver más"
}
```
`image`, `link` y `linkText` son opcionales. Se ordenan solas por fecha (más nueva primero).

## Cambiar links, horario o estado "en vivo"
Todo está arriba de `main.js`, en `CONFIG` y `LINKS`.

## Probar en local
`news.json` se carga con fetch, así que hace falta un servidor:
```
npx serve .
```

## Publicar
Subí esta carpeta a un repo de GitHub y activá **Settings → Pages → Deploy from branch (main, /root)**.

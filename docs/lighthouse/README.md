# Auditoría Lighthouse

La rúbrica exige un reporte Lighthouse de la **aplicación pública** (la vista Next.js
desplegada en Vercel) y un breve análisis.

## Cómo generar el reporte

1. Despliega `public-next` en Vercel y abre la URL pública en Chrome.
2. Abre DevTools (F12) → pestaña **Lighthouse**.
3. Marca las categorías: *Performance, Accessibility, Best Practices, SEO*.
4. Modo: *Navigation* · Dispositivo: *Mobile* (y repite en *Desktop*).
5. Pulsa **Analyze page load**.
6. Exporta el reporte: menú ⋮ → **Save as HTML** (o imprime a PDF) y guárdalo en esta carpeta
   como `lighthouse-public.html` / `lighthouse-public.pdf`.

Alternativa por CLI:

```bash
npx lighthouse https://TU-APP-PUBLICA.vercel.app \
  --output html --output-path docs/lighthouse/lighthouse-public.html \
  --preset=desktop
```

## Plantilla de análisis (completar con tus resultados)

| Categoría | Puntaje | Observación |
|---|---|---|
| Performance | __ / 100 | |
| Accessibility | __ / 100 | |
| Best Practices | __ / 100 | |
| SEO | __ / 100 | |

### Mejoras aplicadas
- Next.js con SSG/ISR → HTML pre-renderizado (mejora FCP/LCP y SEO).
- Metadatos (`title`, `description`) por página vía `generateMetadata`.
- Imágenes con dimensiones y `alt` descriptivos.
- CSS mínimo e inlineable; sin librerías pesadas en la vista pública.

### Mejoras pendientes (si el puntaje lo requiere)
- Optimizar imágenes con `next/image`.
- Precargar fuentes o usar `font-display: swap`.
- Revisar contraste de color para accesibilidad.

/**
 * Pure TS/HTML renderer for a color palette swatch.
 * Designed to be instantiated many times with minimal overhead — no Vue reactivity.
 */

let idCounter = 0

/**
 * Creates a color-palette swatch SVG element and returns it.
 * Append the returned element wherever you need it in the DOM.
 */
export function createColorPaletteSwatch(): SVGSVGElement {
  const clipId = `swatch-clip-${idCounter++}-${Math.random().toString(36).slice(2, 9)}`

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', 'block w-full h-full')
  svg.setAttribute('viewBox', '0 0 200 200')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  svg.innerHTML = `
    <defs>
      <clipPath id="${clipId}">
        <rect x="5" y="5" width="190" height="190" rx="28" ry="28" />
      </clipPath>
    </defs>

    <g clip-path="url(#${clipId})">
      <!-- Background colors — large diagonal bands (bottom layer) -->
      <foreignObject x="5" y="5" width="190" height="190">
        <div xmlns="http://www.w3.org/1999/xhtml" class="relative w-full h-full overflow-hidden">
          <!-- Background diagonal stripes container -->
          <div class="absolute"
            style="width: 200%; height: 200%; top: -50%; left: -50%; transform: rotate(-25deg); transform-origin: center center; display: flex;">
            <div class="bg-(--main-bg-start)" style="flex: 1.2;"></div>
            <div class="bg-(--main-bg-mid)" style="flex: 0.7;"></div>
            <div class="bg-(--main-bg-end)" style="flex: 1.2;"></div>
          </div>

          <!-- Primary colors — overlapping circles (top layer) -->
          <div class="bg-(--primary-start) absolute rounded-full opacity-85"
            style="width: 55%; height: 55%; top: 8%; left: 5%;"></div>
          <div class="bg-(--primary-mid) absolute rounded-full opacity-85"
            style="width: 50%; height: 50%; top: 22%; left: 30%;"></div>
          <div class="bg-(--primary-end) absolute rounded-full opacity-85"
            style="width: 45%; height: 45%; top: 42%; left: 50%;"></div>
        </div>
      </foreignObject>

      <!-- Rounded-square border -->
      <rect x="5" y="5" width="190" height="190" rx="28" ry="28"
        fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.15" />
    </g>
  `

  return svg
}

/**
 * Returns the swatch as an HTML string.
 * Useful when building markup via string concatenation (e.g. `innerHTML` batches).
 */
export function renderColorPaletteSwatchHTML(): string {
  const clipId = `swatch-clip-${idCounter++}-${Math.random().toString(36).slice(2, 9)}`

  return `<svg class="block w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="${clipId}">
      <rect x="5" y="5" width="190" height="190" rx="28" ry="28" />
    </clipPath>
  </defs>

  <g clip-path="url(#${clipId})">
    <foreignObject x="5" y="5" width="190" height="190">
      <div xmlns="http://www.w3.org/1999/xhtml" class="relative w-full h-full overflow-hidden">
        <div class="absolute"
          style="width: 200%; height: 200%; top: -50%; left: -50%; transform: rotate(-25deg); transform-origin: center center; display: flex;">
          <div class="bg-(--main-bg-start)" style="flex: 1.2;"></div>
          <div class="bg-(--main-bg-mid)" style="flex: 0.7;"></div>
          <div class="bg-(--main-bg-end)" style="flex: 1.2;"></div>
        </div>

        <div class="bg-(--primary-start) absolute rounded-full opacity-85"
          style="width: 55%; height: 55%; top: 8%; left: 5%;"></div>
        <div class="bg-(--primary-mid) absolute rounded-full opacity-85"
          style="width: 50%; height: 50%; top: 22%; left: 30%;"></div>
        <div class="bg-(--primary-end) absolute rounded-full opacity-85"
          style="width: 45%; height: 45%; top: 42%; left: 50%;"></div>
      </div>
    </foreignObject>

    <rect x="5" y="5" width="190" height="190" rx="28" ry="28"
      fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.15" />
  </g>
</svg>`
}
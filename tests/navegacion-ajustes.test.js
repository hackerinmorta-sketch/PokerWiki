import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const leer = ruta => readFileSync(new URL(ruta, import.meta.url), 'utf8');

test('La portada de modalidades usa el catálogo original y no la academia dinámica', () => {
  const app = leer('../src/App.jsx');
  assert.match(app, /ruta === '\/modalidades'.*<Modalidades \/>/);
  assert.match(app, /ruta === '\/academia'.*<Academia \/>/);
});

test('El encabezado incluye Mi aprendizaje, Info y símbolos animados', () => {
  const header = leer('../src/components/Estructura.jsx');
  assert.match(header, /to: '\/mis-cursos', texto: 'Mi aprendizaje', palo: '♣'/);
  assert.match(header, /to: '\/info', texto: 'Info'/);
  assert.match(header, /to: '\/', texto: 'Inicio', palo: '♠'/);
  assert.match(header, /enlaces\.map\(renderEnlace\)/);
});

test('El footer permanece fuera del contenedor principal', () => {
  const app = leer('../src/App.jsx');
  assert.match(app, /<\/div>\s*<PiePagina \/>\s*<\/div>/);
});

test('Los cursos dinámicos no mezclan los originales en el catálogo', () => {
  const academia = leer('../src/pages/Academia.jsx');
  const catalogo = academia.split('// Reseñas escritas de cursos dinámicos:')[0];
  assert.doesNotMatch(catalogo, /FichaCursoOriginal|cursosLegados/);
  assert.match(catalogo, /\.from\('courses'\)/);
});

test('Los tres apartados de Info están disponibles', () => {
  const info = leer('../src/pages/Informacion.jsx');
  assert.match(info, /export function InformacionGeneral/);
  assert.match(info, /to="\/empresa"/);
  assert.match(info, /to="\/contacto"/);
  assert.match(info, /to="\/juego-responsable"/);
});

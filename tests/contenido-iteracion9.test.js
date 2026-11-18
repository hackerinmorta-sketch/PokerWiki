import test from 'node:test';
import assert from 'node:assert/strict';
import { formatos, variantes } from '../src/data.js';
import { cursos } from '../src/contenidoCursos.js';

test('Los siete cursos originales conservan sus identificadores y contenido', () => {
  const ids = [...formatos, ...variantes].map(item => item.slug);
  assert.equal(ids.length, 7);
  assert.equal(new Set(ids).size, 7);
  for (const slug of ids) {
    assert.ok(cursos[slug], `Falta el curso original ${slug}`);
    assert.ok(cursos[slug].capitulos.length >= 3, `${slug} debe tener contenido`);
  }
});

test('Los fundamentos se integraron en Texas Holdem sin reemplazar lecciones previas', () => {
  const capitulos = cursos['texas-holdem'].capitulos;
  const ids = capitulos.map(c => c.id);
  for (const id of ['cartas', 'rondas', 'decisiones', 'acciones-basicas', 'jerarquia-manos', 'glosario-inicial']) {
    assert.ok(ids.includes(id), `Falta la lección ${id}`);
  }
  assert.equal(new Set(ids).size, ids.length, 'Los ids deben ser únicos para guardar el progreso');
  assert.ok(capitulos.every(c => c.parrafos.every(p => p.length > 60)), 'El contenido debe aportar explicaciones completas');
});

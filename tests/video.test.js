import test from 'node:test';
import assert from 'node:assert/strict';
import { extraerIdYouTube, urlEmbedSegura, urlYouTube } from '../src/lib/video.js';

const id = 'M7lc1UVf-VE'; // ID público de ejemplo de la documentación de YouTube.
test('URLs oficiales permitidas y rutas compatibles', () => {
  for (const url of [
    `https://www.youtube.com/watch?v=${id}&t=3s`,
    `https://youtube.com/embed/${id}`,
    `https://m.youtube.com/shorts/${id}`,
    `https://www.youtube.com/live/${id}`,
    `https://youtu.be/${id}`,
    `https://www.youtube-nocookie.com/embed/${id}`,
    id
  ]) assert.equal(extraerIdYouTube(url), id, url);
});
test('Rechaza URLs no confiables o mal formadas', () => {
  for (const valor of [
    'https://youtube.com.evil.net/watch?v=' + id,
    'https://youtube.com@evil.net/watch?v=' + id,
    'http://youtube.com/watch?v=' + id,
    'javascript:alert(1)',
    'data:text/html;base64,123',
    'https://example.org/video/' + id,
    'https://youtu.be/notvalid',
    'https://www.youtube.com/watch?v=AAAA<script',
    'https://www.youtube.com:444/watch?v=' + id,
    '', null, undefined
  ]) assert.equal(extraerIdYouTube(valor), null, String(valor));
});
test('Iframe solo permite identificadores válidos en URL construida', () => {
  assert.equal(urlEmbedSegura(id), `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1`);
  assert.equal(urlYouTube(id), `https://www.youtube.com/watch?v=${id}`);
  assert.equal(urlEmbedSegura('evil?x=<script>'), null);
});

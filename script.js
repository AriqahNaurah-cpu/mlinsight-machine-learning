const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
menuToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navMenu.classList.remove('open')));

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});

const form = document.getElementById('irisForm');
const result = document.getElementById('predictionResult');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const sl = Number(document.getElementById('sepalLength').value);
  const sw = Number(document.getElementById('sepalWidth').value);
  const pl = Number(document.getElementById('petalLength').value);
  const pw = Number(document.getElementById('petalWidth').value);
  if (![sl, sw, pl, pw].every(Number.isFinite)) return;

  let name, description, color;
  // Heuristik edukatif berdasarkan ukuran petal; bukan model terlatih.
  if (pl < 2.5 && pw < 0.8) {
    name = 'Iris-setosa'; color = '#168b60';
    description = 'Ukuran petal kecil paling dekat dengan pola contoh Iris-setosa.';
  } else if (pl < 5.0 && pw < 1.8) {
    name = 'Iris-versicolor'; color = '#2368db';
    description = 'Ukuran petal berada di rentang tengah, menyerupai pola Iris-versicolor.';
  } else {
    name = 'Iris-virginica'; color = '#7a3ed1';
    description = 'Ukuran petal yang lebih besar menyerupai pola Iris-virginica.';
  }
  result.querySelector('h3').textContent = name;
  result.querySelector('p').textContent = description;
  result.querySelector('small').textContent = 'HASIL SIMULASI';
  result.querySelector('.flower').style.color = color;
  result.style.background = name === 'Iris-setosa' ? 'linear-gradient(110deg,#dff9ed,#e7fff5)' : name === 'Iris-versicolor' ? 'linear-gradient(110deg,#e3efff,#edf4ff)' : 'linear-gradient(110deg,#f0e6ff,#f8efff)';
});

const svg = document.getElementById('scatterChart');
const ns = 'http://www.w3.org/2000/svg';
function addSvg(tag, attrs, textContent) {
  const el = document.createElementNS(ns, tag);
  Object.entries(attrs || {}).forEach(([key, value]) => el.setAttribute(key, value));
  if (textContent !== undefined) el.textContent = textContent;
  svg.appendChild(el);
  return el;
}
function drawChart() {
  svg.innerHTML = '';
  const plot = {x: 52, y: 18, w: 465, h: 205};
  const xMax = 7.5, yMax = 2.7;
  const X = v => plot.x + (v / xMax) * plot.w;
  const Y = v => plot.y + plot.h - (v / yMax) * plot.h;
  for (let x = 0; x <= 7; x += 1) {
    addSvg('line', {x1:X(x), y1:plot.y, x2:X(x), y2:plot.y+plot.h, stroke:'#e5edf6', 'stroke-width':1});
    addSvg('text', {x:X(x), y:plot.y+plot.h+18, fill:'#70809a', 'font-size':10, 'text-anchor':'middle'}, x);
  }
  for (let y = 0; y <= 2.5; y += .5) {
    addSvg('line', {x1:plot.x, y1:Y(y), x2:plot.x+plot.w, y2:Y(y), stroke:'#e5edf6', 'stroke-width':1});
    addSvg('text', {x:plot.x-10, y:Y(y)+3, fill:'#70809a', 'font-size':10, 'text-anchor':'end'}, y.toFixed(1));
  }
  addSvg('line',{x1:plot.x,y1:plot.y+plot.h,x2:plot.x+plot.w,y2:plot.y+plot.h,stroke:'#9eb0c7','stroke-width':1.2});
  addSvg('line',{x1:plot.x,y1:plot.y,x2:plot.x,y2:plot.y+plot.h,stroke:'#9eb0c7','stroke-width':1.2});
  addSvg('text',{x:plot.x+plot.w/2,y:plot.y+plot.h+38,fill:'#455875','font-size':11,'text-anchor':'middle'},'Petal Length (cm)');
  addSvg('text',{x:14,y:plot.y+plot.h/2,fill:'#455875','font-size':11,'text-anchor':'middle',transform:`rotate(-90 14 ${plot.y+plot.h/2})`},'Petal Width (cm)');
  const groups = [
    {color:'#ff737e', x:[1.0,1.2,1.4,1.5,1.3,1.6,1.1,1.7,1.4,1.5,1.2,1.8,1.0,1.3,1.6,1.4,1.7], y:[.2,.2,.3,.4,.2,.4,.1,.3,.2,.4,.2,.5,.1,.3,.4,.3,.5]},
    {color:'#3f91ff', x:[3.0,3.5,4.0,4.2,4.5,4.7,4.1,4.8,5.0,4.4,4.6,3.8,4.9,5.2,4.3,4.7,5.1], y:[1.0,1.1,1.3,1.0,1.5,1.4,1.2,1.6,1.5,1.3,.9,1.2,1.4,1.7,1.1,1.5,1.6]},
    {color:'#43c994', x:[5.5,5.8,6.0,6.2,6.4,6.6,6.8,7.0,6.3,6.7,5.9,6.5,7.1,6.1,6.9,6.4,7.2], y:[1.5,1.7,1.6,1.8,2.0,2.2,2.1,2.4,1.9,2.3,1.7,2.0,2.5,1.8,2.2,2.1,2.4]}
  ];
  groups.forEach(group => group.x.forEach((x,i) => addSvg('circle',{cx:X(x),cy:Y(group.y[i]),r:4.2,fill:group.color,opacity:.9,stroke:'#fff','stroke-width':.8})));
}
drawChart();

const caseDetails = {
  finance: '<strong>Alur:</strong> data transaksi → ekstraksi fitur (jumlah, waktu, lokasi) → model memberi skor risiko → petugas meninjau transaksi yang ditandai. Hasil model bukan bukti otomatis terjadinya penipuan.',
  health: '<strong>Alur:</strong> citra yang telah dianonimkan → prapemrosesan → model mengenali pola → tenaga medis memeriksa hasil bersama informasi klinis. Sistem tidak menggantikan diagnosis profesional.',
  retail: '<strong>Alur:</strong> interaksi pengguna dan katalog produk → model menghitung kemiripan atau preferensi → daftar rekomendasi ditampilkan → sistem dievaluasi dari relevansi dan umpan balik.'
};
const detail = document.getElementById('caseDetail');
document.querySelectorAll('.learn-more').forEach(button => {
  button.addEventListener('click', () => {
    detail.innerHTML = caseDetails[button.dataset.case];
    detail.hidden = false;
    detail.scrollIntoView({behavior:'smooth',block:'nearest'});
  });
});

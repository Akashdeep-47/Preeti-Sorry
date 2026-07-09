(function () {
  var dEl = document.getElementById('cd-days');
  var hEl = document.getElementById('cd-hours');
  var mEl = document.getElementById('cd-mins');
  var sEl = document.getElementById('cd-secs');
  if (!dEl) return;

  var target = new Date('2026-08-14T00:00:00');
  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    var diff = target - new Date();
    if (diff < 0) diff = 0;
    dEl.textContent = pad(Math.floor(diff / 86400000));
    hEl.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    mEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
    sEl.textContent = pad(Math.floor((diff % 60000) / 1000));
  }
  tick();
  setInterval(tick, 1000);
})();

(function () {
  var arc = document.getElementById('gauge-arc');
  if (!arc) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  arc.style.transition = 'stroke-dashoffset 1.4s ease 0.2s';
})();

(function () {
  var canvas = document.getElementById('confetti-canvas');
  var btn = document.getElementById('heart-btn');
  if (!canvas || !btn) return;

  var ctx = canvas.getContext('2d');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var particles = [];
  var running = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function heartPath(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.3);
    ctx.bezierCurveTo(x, y, x - size, y, x - size, y + size * 0.3);
    ctx.bezierCurveTo(x - size, y + size * 0.7, x, y + size, x, y + size * 1.2);
    ctx.bezierCurveTo(x, y + size, x + size, y + size * 0.7, x + size, y + size * 0.3);
    ctx.bezierCurveTo(x + size, y, x, y, x, y + size * 0.3);
    ctx.closePath();
  }

  var colors = ['#ff5e86', '#ffcb3d', '#3fb873', '#ff7a9c'];

  function spawn(rect) {
    var count = reduce ? 6 : 22;
    for (var i = 0; i < count; i++) {
      particles.push({
        x: rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width,
        y: rect.top,
        vx: (Math.random() - 0.5) * 2.2,
        vy: -3 - Math.random() * 3,
        size: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1
      });
    }
    if (!running) { running = true; requestAnimationFrame(loop); }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.life -= 0.012;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      heartPath(ctx, p.x, p.y, p.size);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    particles = particles.filter(function (p) { return p.life > 0 && p.y < canvas.height + 40; });
    if (particles.length > 0) {
      requestAnimationFrame(loop);
    } else {
      running = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  btn.addEventListener('click', function () { spawn(btn.getBoundingClientRect()); });
})();

/* MA-0125 — laboratorio de lectura gráfica (GitHub Pages, estático) */
(function () {
  "use strict";

  var SQ6 = Math.sqrt(6);
  var SQ3 = Math.sqrt(3);

  var SCEN = {
    parabola: {
      key: "parabola",
      label: "Parábola acotada",
      formula: "f(x)=0,25x²−1,5",
      xmin: -5.3,
      xmax: 5.3,
      ymin: -2.35,
      ymax: 4.35,
      domain: [-4.5, 4.5],
      f: function (x) {
        return 0.25 * x * x - 1.5;
      },
      zeros: [-SQ6, SQ6],
      yIntercept: [0, -1.5],
      yRange: [-1.5, 0.25 * 4.5 * 4.5 - 1.5],
      monotonia: [
        { a: -4.5, b: 0, tipo: "dec" },
        { a: 0, b: 4.5, tipo: "inc" }
      ],
      signo: [
        { a: -4.5, b: -SQ6, pos: true },
        { a: -SQ6, b: SQ6, pos: false },
        { a: SQ6, b: 4.5, pos: true }
      ],
      concav: [{ a: -4.5, b: 4.5, tipo: "cup" }],
      inflexion: null,
      extremos: [
        { x: 0, y: -1.5, tipo: "Mín. absoluto" },
        { x: -4.5, y: 0.25 * 4.5 * 4.5 - 1.5, tipo: "Máx. absoluto (extremo)" },
        { x: 4.5, y: 0.25 * 4.5 * 4.5 - 1.5, tipo: "Máx. absoluto (extremo)" }
      ],
      asintotas: []
    },
    cubica: {
      key: "cubica",
      label: "Cúbica",
      formula: "g(x)=0,15(x³−3x)",
      xmin: -3,
      xmax: 3,
      ymin: -1.65,
      ymax: 1.65,
      domain: [-2.5, 2.5],
      f: function (x) {
        return 0.15 * (x * x * x - 3 * x);
      },
      zeros: [-SQ3, 0, SQ3],
      yIntercept: [0, 0],
      yRange: [-1.21875, 1.21875],
      monotonia: [
        { a: -2.5, b: -1, tipo: "inc" },
        { a: -1, b: 1, tipo: "dec" },
        { a: 1, b: 2.5, tipo: "inc" }
      ],
      signo: [
        { a: -2.5, b: -SQ3, pos: false },
        { a: -SQ3, b: 0, pos: true },
        { a: 0, b: SQ3, pos: false },
        { a: SQ3, b: 2.5, pos: true }
      ],
      concav: [
        { a: -2.5, b: 0, tipo: "cap" },
        { a: 0, b: 2.5, tipo: "cup" }
      ],
      inflexion: [0, 0],
      extremos: [
        { x: -1, y: 0.3, tipo: "Máx. local" },
        { x: 1, y: -0.3, tipo: "Mín. local" },
        { x: -2.5, y: -1.21875, tipo: "Mín. absoluto" },
        { x: 2.5, y: 1.21875, tipo: "Máx. absoluto" }
      ],
      asintotas: []
    }
  };

  var ASPECTS = [
    { id: "panorama", label: "Panorama" },
    { id: "dominio", label: "Dominio" },
    { id: "ambito", label: "Ámbito" },
    { id: "intersecciones", label: "Intersecciones" },
    { id: "asintotas", label: "Asíntotas" },
    { id: "signo", label: "Signo" },
    { id: "monotonia", label: "Monotonía" },
    { id: "concavidad", label: "Concavidad" },
    { id: "inflexion", label: "Inflexión" },
    { id: "extremos", label: "Extremos" }
  ];

  function fmt(x) {
    return (Math.round(x * 100) / 100).toFixed(2).replace(".", ",");
  }

  function fmtDot(x) {
    return (Math.round(x * 100) / 100).toFixed(1);
  }

  function makeCoord(s, cvs) {
    var padL = 52,
      padR = 22,
      padT = 22,
      padB = 46;
    var W = cvs.width,
      H = cvs.height;
    function x2px(x) {
      return padL + ((x - s.xmin) / (s.xmax - s.xmin)) * (W - padL - padR);
    }
    function y2px(y) {
      return padT + ((s.ymax - y) / (s.ymax - s.ymin)) * (H - padT - padB);
    }
    return { x2px: x2px, y2px: y2px, W: W, H: H, padL: padL, padR: padR, padT: padT, padB: padB };
  }

  function drawGridAxes(ctx, c) {
    var s = ctx.__s;
    var i;
    ctx.strokeStyle = "#e8e8e8";
    ctx.lineWidth = 1;
    for (i = Math.floor(s.xmin); i <= Math.ceil(s.xmax); i++) {
      ctx.beginPath();
      ctx.moveTo(c.x2px(i), c.y2px(s.ymin));
      ctx.lineTo(c.x2px(i), c.y2px(s.ymax));
      ctx.stroke();
    }
    for (i = Math.floor(s.ymin); i <= Math.ceil(s.ymax); i++) {
      ctx.beginPath();
      ctx.moveTo(c.x2px(s.xmin), c.y2px(i));
      ctx.lineTo(c.x2px(s.xmax), c.y2px(i));
      ctx.stroke();
    }
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(c.x2px(s.xmin), c.y2px(0));
    ctx.lineTo(c.x2px(s.xmax), c.y2px(0));
    ctx.moveTo(c.x2px(0), c.y2px(s.ymin));
    ctx.lineTo(c.x2px(0), c.y2px(s.ymax));
    ctx.stroke();
    ctx.fillStyle = "#003874";
    ctx.font = "13px Source Sans 3, system-ui, sans-serif";
    ctx.fillText("x", c.W - c.padR - 2, c.y2px(0) + 16);
    ctx.fillText("y", c.x2px(0) + 8, c.padT + 12);
  }

  function drawCurve(ctx, c, s) {
    var step = (s.domain[1] - s.domain[0]) / 200;
    var x,
      y,
      px,
      py,
      first = true;
    ctx.strokeStyle = "#003874";
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (x = s.domain[0]; x <= s.domain[1] + 1e-6; x += step) {
      y = s.f(x);
      if (y < s.ymin - 2 || y > s.ymax + 2) {
        first = true;
        continue;
      }
      px = c.x2px(x);
      py = c.y2px(y);
      if (first) {
        ctx.moveTo(px, py);
        first = false;
      } else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.fillStyle = "#003874";
    ctx.beginPath();
    ctx.arc(c.x2px(s.domain[0]), c.y2px(s.f(s.domain[0])), 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(c.x2px(s.domain[1]), c.y2px(s.f(s.domain[1])), 4.2, 0, Math.PI * 2);
    ctx.fill();
  }

  function fillBetweenCurveAndAxis(ctx, c, s, xa, xb, pos) {
    var step = (xb - xa) / 48;
    var x,
      y,
      y0 = c.y2px(0);
    ctx.beginPath();
    ctx.moveTo(c.x2px(xa), y0);
    for (x = xa; x <= xb + 1e-9; x += step) {
      y = s.f(x);
      ctx.lineTo(c.x2px(x), c.y2px(y));
    }
    ctx.lineTo(c.x2px(xb), y0);
    ctx.closePath();
    ctx.fillStyle = pos ? "rgba(0,120,60,0.2)" : "rgba(180,30,30,0.18)";
    ctx.fill();
  }

  function drawDomainHighlight(ctx, c, s) {
    var yb = c.y2px(s.ymin) + 10;
    ctx.strokeStyle = "rgba(200,155,40,0.95)";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(c.x2px(s.domain[0]), yb);
    ctx.lineTo(c.x2px(s.domain[1]), yb);
    ctx.stroke();
    ctx.fillStyle = "#7a5200";
    ctx.font = "11px Source Sans 3, system-ui, sans-serif";
    ctx.fillText("Proyección del dominio en X", c.x2px((s.domain[0] + s.domain[1]) / 2) - 78, yb + 18);
  }

  function drawAmbitoHighlight(ctx, c, s) {
    var xl = c.x2px(s.xmin) + 8;
    var y1 = c.y2px(s.yRange[1]);
    var y0 = c.y2px(s.yRange[0]);
    ctx.strokeStyle = "rgba(0,120,60,0.95)";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(xl, y1);
    ctx.lineTo(xl, y0);
    ctx.stroke();
    ctx.save();
    ctx.translate(xl - 6, (y0 + y1) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#004d26";
    ctx.font = "11px Source Sans 3, system-ui, sans-serif";
    ctx.fillText("Ámbito en Y", -36, 0);
    ctx.restore();
  }

  function drawMonotoneBar(ctx, c, s) {
    var yb = c.y2px(s.ymin) + 28;
    s.monotonia.forEach(function (seg) {
      var col = seg.tipo === "inc" ? "rgba(0,120,60,0.55)" : seg.tipo === "dec" ? "rgba(180,30,30,0.55)" : "rgba(100,100,100,0.55)";
      ctx.strokeStyle = col;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(c.x2px(seg.a), yb);
      ctx.lineTo(c.x2px(seg.b), yb);
      ctx.stroke();
      var xm = (seg.a + seg.b) / 2;
      var t = seg.tipo === "inc" ? "↗" : seg.tipo === "dec" ? "↘" : "→";
      ctx.fillStyle = "#222";
      ctx.font = "bold 12px Source Sans 3, sans-serif";
      ctx.fillText(t, c.x2px(xm) - 5, yb - 6);
    });
    ctx.fillStyle = "#444";
    ctx.font = "10px Source Sans 3, sans-serif";
    ctx.fillText("Lectura en X: intervalos abiertos en los cambios", c.x2px(s.domain[0]), yb + 18);
  }

  function drawConcavBar(ctx, c, s) {
    var yt = c.y2px(s.ymax) - 18;
    s.concav.forEach(function (seg) {
      var col = seg.tipo === "cup" ? "rgba(0,56,116,0.35)" : "rgba(180,30,30,0.32)";
      ctx.strokeStyle = col;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(c.x2px(seg.a), yt);
      ctx.lineTo(c.x2px(seg.b), yt);
      ctx.stroke();
      var sym = seg.tipo === "cup" ? "∪" : "∩";
      ctx.fillStyle = "#003874";
      ctx.font = "bold 14px serif";
      ctx.fillText(sym, c.x2px((seg.a + seg.b) / 2) - 5, yt + 4);
    });
  }

  function drawZeros(ctx, c, s) {
    s.zeros.forEach(function (xz) {
      var yz = s.f(xz);
      ctx.strokeStyle = "rgba(180,30,30,0.55)";
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(c.x2px(xz), c.y2px(0));
      ctx.lineTo(c.x2px(xz), c.y2px(yz));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#b41e1e";
      ctx.beginPath();
      ctx.arc(c.x2px(xz), c.y2px(0), 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawYIntercept(ctx, c, s) {
    var p = s.yIntercept;
    ctx.strokeStyle = "rgba(200,155,40,0.75)";
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(c.x2px(0), c.y2px(0));
    ctx.lineTo(c.x2px(p[0]), c.y2px(p[1]));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#c89b28";
    ctx.beginPath();
    ctx.arc(c.x2px(p[0]), c.y2px(p[1]), 5.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawExtremos(ctx, c, s) {
    s.extremos.forEach(function (e) {
      ctx.fillStyle = "#003874";
      ctx.beginPath();
      ctx.arc(c.x2px(e.x), c.y2px(e.y), 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });
  }

  function drawInflexion(ctx, c, s) {
    if (!s.inflexion) return;
    var p = s.inflexion;
    ctx.fillStyle = "#c89b28";
    ctx.beginPath();
    ctx.arc(c.x2px(p[0]), c.y2px(p[1]), 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function explainHTML(s, aspect) {
    var d0 = fmt(s.domain[0]);
    var d1 = fmt(s.domain[1]);
    var yr0 = fmt(s.yRange[0]);
    var yr1 = fmt(s.yRange[1]);
    var z = s.zeros
      .map(function (x) {
        return "(" + fmt(x) + ",0)";
      })
      .join(" y ");
    var yi = "(" + fmt(s.yIntercept[0]) + "," + fmt(s.yIntercept[1]) + ")";
    if (aspect === "panorama") {
      return (
        "<h4>Qué ver en esta vista</h4>" +
        "<p class='lead'>Primero identifique <strong>dominio</strong> (proyección en X) y <strong>trazo</strong> con extremos cerrados. Luego recorra el eje X y pregúntese por signo, crecimiento y curvatura.</p>" +
        "<ul><li><strong>Fórmula mostrada:</strong> " +
        s.formula +
        "</li><li><strong>Dominio gráfico:</strong> [" +
        d0 +
        ", " +
        d1 +
        "] (segmento dibujado).</li></ul>"
      );
    }
    if (aspect === "dominio") {
      return (
        "<h4>Dominio D<sub>f</sub></h4>" +
        "<p class='lead'>Se lee en el <strong>eje X</strong>, de izquierda a derecha. Incluya extremos cerrados si el punto pertenece a la gráfica.</p>" +
        "<ul><li>Aquí: <code>D_f = [" +
        d0 +
        ",\\ " +
        d1 +
        "]</code>.</li><li>Si hubiera asíntota vertical en <code>x=a</code>, el valor <code>a</code> queda <strong>abierto</strong> en los intervalos del dominio.</li></ul>"
      );
    }
    if (aspect === "ambito") {
      return (
        "<h4>Ámbito A<sub>f</sub></h4>" +
        "<p class='lead'>Se lee en el <strong>eje Y</strong>, de abajo hacia arriba: el conjunto de alturas alcanzadas por la curva.</p>" +
        "<ul><li>Aquí: <code>A_f = [" +
        yr0 +
        ",\\ " +
        yr1 +
        "]</code> (mínimo y máximo de la curva sobre ese dominio).</li></ul>"
      );
    }
    if (aspect === "intersecciones") {
      return (
        "<h4>Intersecciones con ejes</h4>" +
        "<p class='lead'>Siempre como <strong>par ordenado</strong> <code>(x,y)</code>.</p>" +
        "<ul><li><strong>Eje x (ceros):</strong> " +
        z +
        ".</li><li><strong>Eje y:</strong> " +
        yi +
        ".</li></ul>"
      );
    }
    if (aspect === "asintotas") {
      if (!s.asintotas || !s.asintotas.length) {
        return (
          "<h4>Asíntotas</h4>" +
          "<p class='lead'>En este ejemplo <strong>no hay asíntotas</strong>. Si las hubiera, recuerde: el valor de la asíntota es extremo <strong>abierto</strong> del intervalo correspondiente.</p>" +
          "<ul><li>Vertical <code>x=a</code>: afecta el <strong>dominio</strong>.</li><li>Horizontal <code>y=b</code>: afecta el <strong>ámbito</strong>.</li></ul>"
        );
      }
    }
    if (aspect === "signo") {
      return (
        "<h4>Signo de f</h4>" +
        "<p class='lead'>Compare la curva con el eje <strong>X</strong>. Los intervalos se escriben en <strong>X</strong> y <strong>abiertos</strong> en los ceros.</p>" +
        "<ul><li>Verde: <code>f(x) &gt; 0</code>. Rojo: <code>f(x) &lt; 0</code>.</li><li>Los puntos con <code>f(x)=0</code> no entran en los intervalos de positividad/negatividad.</li></ul>"
      );
    }
    if (aspect === "monotonia") {
      return (
        "<h4>Monotonía</h4>" +
        "<p class='lead'>Al avanzar en <strong>X</strong>, ¿sube o baja la gráfica? Intervalos <strong>abiertos</strong> donde cambia la tendencia.</p>" +
        "<ul><li>Verde ↗ creciente; rojo ↘ decreciente.</li><li>En el examen: <em>«intervalo donde f es creciente y cóncava…»</em> = intersección de dos condiciones leídas en X.</li></ul>"
      );
    }
    if (aspect === "concavidad") {
      return (
        "<h4>Concavidad</h4>" +
        "<p class='lead'>Mire la curvatura al moverse en <strong>X</strong>. ∪ convexa (hacia arriba), ∩ cóncava (hacia abajo). Intervalos <strong>abiertos</strong> en el cambio.</p>" +
        "<ul><li>Útil: «sonríe» ∪ vs «llora» ∩.</li></ul>"
      );
    }
    if (aspect === "inflexion") {
      if (!s.inflexion) {
        return (
          "<h4>Punto de inflexión</h4>" +
          "<p class='lead'>Aquí <strong>no hay</strong> cambio de concavidad en el interior del dominio (la parábola mantiene la misma curvatura).</p>"
        );
      }
      return (
        "<h4>Punto de inflexión</h4>" +
        "<p class='lead'>Donde cambia la concavidad y la función es continua. Coordenadas como <strong>par ordenado</strong>.</p>" +
        "<ul><li>Aquí: <code>(" +
        fmt(s.inflexion[0]) +
        ",\\ " +
        fmt(s.inflexion[1]) +
        ")</code>.</li></ul>"
      );
    }
    if (aspect === "extremos") {
      return (
        "<h4>Extremos</h4>" +
        "<p class='lead'>Locales: máximo/mínimo en un entorno. Absolutos: sobre <strong>todo</strong> el dominio. Siempre <strong>(x,y)</strong>.</p>" +
        "<ul><li>En la gráfica, marcamos candidatos y extremos de frontera.</li></ul>"
      );
    }
    return "<h4>Análisis</h4><p class='lead'>Seleccione un aspecto arriba.</p>";
  }

  function quizHTML(s, aspect) {
    var id = "labq-" + s.key + "-" + aspect;
    if (aspect === "dominio") {
      return (
        "<div class='quiz-block' data-lab-quiz='" +
        id +
        "'><h4>Mini‑reto</h4><p style='margin:0 0 0.5rem;font-size:0.9rem'>¿Cuál es el dominio <em>gráfico</em> de este ejemplo?</p>" +
        "<div class='opts'><label><input type='radio' name='" +
        id +
        "' value='0' /> Todos los reales</label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='1' /> <code>[" +
        fmtDot(s.domain[0]) +
        ", " +
        fmtDot(s.domain[1]) +
        "]</code> (segmento dibujado)</label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='2' /> Solo <code>x&gt;0</code></label></div>" +
        "<button type='button' class='btn' data-lab-btn='" +
        id +
        "' data-lab-ok='1'>Comprobar</button>" +
        "<div class='feedback' data-lab-fb='" +
        id +
        "'></div></div>"
      );
    }
    if (aspect === "ambito") {
      return (
        "<div class='quiz-block' data-lab-quiz='" +
        id +
        "'><h4>Mini‑reto</h4><p style='margin:0 0 0.5rem;font-size:0.9rem'>El ámbito es un intervalo en…</p>" +
        "<div class='opts'><label><input type='radio' name='" +
        id +
        "' value='0' /> el eje <strong>X</strong></label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='1' /> el eje <strong>Y</strong></label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='2' /> la recta <code>y=x</code></label></div>" +
        "<button type='button' class='btn' data-lab-btn='" +
        id +
        "' data-lab-ok='1'>Comprobar</button>" +
        "<div class='feedback' data-lab-fb='" +
        id +
        "'></div></div>"
      );
    }
    if (aspect === "signo") {
      return (
        "<div class='quiz-block' data-lab-quiz='" +
        id +
        "'><h4>Mini‑reto</h4><p style='margin:0 0 0.5rem;font-size:0.9rem'>Para el <strong>signo</strong>, los extremos de los intervalos en el eje X deben ser…</p>" +
        "<div class='opts'><label><input type='radio' name='" +
        id +
        "' value='0' /> cerrados <code>[\\,,]</code> siempre</label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='1' /> abiertos en los ceros (salvo indicación)</label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='2' /> solo notación de desigualdades, sin intervalos</label></div>" +
        "<button type='button' class='btn' data-lab-btn='" +
        id +
        "' data-lab-ok='1'>Comprobar</button>" +
        "<div class='feedback' data-lab-fb='" +
        id +
        "'></div></div>"
      );
    }
    if (aspect === "monotonia") {
      return (
        "<div class='quiz-block' data-lab-quiz='" +
        id +
        "'><h4>Mini‑reto</h4><p style='margin:0 0 0.5rem;font-size:0.9rem'>¿Dónde se lee la monotonía?</p>" +
        "<div class='opts'><label><input type='radio' name='" +
        id +
        "' value='0' /> en el eje <strong>Y</strong></label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='1' /> en el eje <strong>X</strong> (al avanzar a la derecha)</label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='2' /> en la pendiente de la recta tangente numérica</label></div>" +
        "<button type='button' class='btn' data-lab-btn='" +
        id +
        "' data-lab-ok='1'>Comprobar</button>" +
        "<div class='feedback' data-lab-fb='" +
        id +
        "'></div></div>"
      );
    }
    if (aspect === "intersecciones") {
      return (
        "<div class='quiz-block' data-lab-quiz='" +
        id +
        "'><h4>Mini‑reto</h4><p style='margin:0 0 0.5rem;font-size:0.9rem'>Los ceros del ejemplo se reportan como…</p>" +
        "<div class='opts'><label><input type='radio' name='" +
        id +
        "' value='0' /> solo los valores de <code>x</code></label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='1' /> pares <code>(x,y)</code> con <code>y=0</code></label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='2' /> intervalos en el eje X</label></div>" +
        "<button type='button' class='btn' data-lab-btn='" +
        id +
        "' data-lab-ok='1'>Comprobar</button>" +
        "<div class='feedback' data-lab-fb='" +
        id +
        "'></div></div>"
      );
    }
    if (aspect === "concavidad") {
      return (
        "<div class='quiz-block' data-lab-quiz='" +
        id +
        "'><h4>Mini‑reto</h4><p style='margin:0 0 0.5rem;font-size:0.9rem'>La concavidad se describe con intervalos en…</p>" +
        "<div class='opts'><label><input type='radio' name='" +
        id +
        "' value='0' /> el eje <strong>Y</strong></label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='1' /> el eje <strong>X</strong> (al recorrer la gráfica)</label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='2' /> el eje de ordenadas de la derivada</label></div>" +
        "<button type='button' class='btn' data-lab-btn='" +
        id +
        "' data-lab-ok='1'>Comprobar</button>" +
        "<div class='feedback' data-lab-fb='" +
        id +
        "'></div></div>"
      );
    }
    if (aspect === "inflexion") {
      var ok = s.inflexion ? "1" : "0";
      return (
        "<div class='quiz-block' data-lab-quiz='" +
        id +
        "'><h4>Mini‑reto</h4><p style='margin:0 0 0.5rem;font-size:0.9rem'>En <strong>este</strong> ejemplo, ¿hay punto de inflexión en el interior del dominio?</p>" +
        "<div class='opts'><label><input type='radio' name='" +
        id +
        "' value='0' /> No</label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='1' /> Sí</label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='2' /> Solo si hay asíntota horizontal</label></div>" +
        "<button type='button' class='btn' data-lab-btn='" +
        id +
        "' data-lab-ok='" +
        ok +
        "'>Comprobar</button>" +
        "<div class='feedback' data-lab-fb='" +
        id +
        "'></div></div>"
      );
    }
    if (aspect === "extremos") {
      return (
        "<div class='quiz-block' data-lab-quiz='" +
        id +
        "'><h4>Mini‑reto</h4><p style='margin:0 0 0.5rem;font-size:0.9rem'>Los extremos (locales o absolutos) se entregan como…</p>" +
        "<div class='opts'><label><input type='radio' name='" +
        id +
        "' value='0' /> solo la imagen <code>y</code></label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='1' /> par ordenado <code>(x,y)</code></label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='2' /> un intervalo en <code>X</code></label></div>" +
        "<button type='button' class='btn' data-lab-btn='" +
        id +
        "' data-lab-ok='1'>Comprobar</button>" +
        "<div class='feedback' data-lab-fb='" +
        id +
        "'></div></div>"
      );
    }
    if (aspect === "asintotas") {
      return (
        "<div class='quiz-block' data-lab-quiz='" +
        id +
        "'><h4>Mini‑reto</h4><p style='margin:0 0 0.5rem;font-size:0.9rem'>Si <code>x=2</code> es una asíntota vertical, entonces <code>2</code> pertenece al dominio de <code>f</code>.</p>" +
        "<div class='opts'><label><input type='radio' name='" +
        id +
        "' value='0' /> Verdadero</label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='1' /> Falso</label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='2' /> Solo a veces</label></div>" +
        "<button type='button' class='btn' data-lab-btn='" +
        id +
        "' data-lab-ok='1'>Comprobar</button>" +
        "<div class='feedback' data-lab-fb='" +
        id +
        "'></div></div>"
      );
    }
    if (aspect === "panorama") {
      return (
        "<div class='quiz-block' data-lab-quiz='" +
        id +
        "'><h4>Mini‑reto</h4><p style='margin:0 0 0.5rem;font-size:0.9rem'>¿Dónde se lee el <strong>ámbito</strong>?</p>" +
        "<div class='opts'><label><input type='radio' name='" +
        id +
        "' value='0' /> en el eje <strong>X</strong></label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='1' /> en el eje <strong>Y</strong></label>" +
        "<label><input type='radio' name='" +
        id +
        "' value='2' /> en la diagonal</label></div>" +
        "<button type='button' class='btn' data-lab-btn='" +
        id +
        "' data-lab-ok='1'>Comprobar</button>" +
        "<div class='feedback' data-lab-fb='" +
        id +
        "'></div></div>"
      );
    }
    return "";
  }

  function wireLabButton(btn) {
    btn.addEventListener("click", function () {
      var qid = btn.getAttribute("data-lab-btn");
      var ok = btn.getAttribute("data-lab-ok");
      var root = document.querySelector("[data-lab-quiz='" + qid + "']");
      if (!root) return;
      var sel = root.querySelector("input[type=radio]:checked");
      var fb = root.querySelector("[data-lab-fb='" + qid + "']");
      fb.classList.remove("ok", "bad");
      fb.style.display = "none";
      if (!sel) {
        fb.textContent = "Selecciona una opción.";
        fb.classList.add("bad");
        fb.style.display = "block";
        return;
      }
      var hit = sel.value === ok;
      fb.textContent = hit ? "Correcto." : "Revisa la definición o el ejemplo en pantalla.";
      fb.classList.add(hit ? "ok" : "bad");
    });
  }

  function mountLabPanels(s, aspect) {
    var ex = document.getElementById("labExplain");
    var qz = document.getElementById("labQuiz");
    if (ex) ex.innerHTML = explainHTML(s, aspect);
    if (qz) {
      qz.innerHTML = quizHTML(s, aspect);
      qz.querySelectorAll("[data-lab-btn]").forEach(wireLabButton);
    }
  }

  function drawLab(state) {
    var cvs = document.getElementById("labCvs");
    if (!cvs) return;
    var ctx = cvs.getContext("2d");
    var s = SCEN[state.scenario];
    var aspect = state.aspect;
    var c = makeCoord(s, cvs);
    ctx.__s = s;
    ctx.clearRect(0, 0, c.W, c.H);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.W, c.H);

    drawGridAxes(ctx, c);

    if (aspect === "signo") {
      s.signo.forEach(function (seg) {
        fillBetweenCurveAndAxis(ctx, c, s, seg.a, seg.b, seg.pos);
      });
    }

    drawCurve(ctx, c, s);

    if (aspect === "dominio" || aspect === "panorama") drawDomainHighlight(ctx, c, s);
    if (aspect === "ambito" || aspect === "panorama") drawAmbitoHighlight(ctx, c, s);
    if (aspect === "intersecciones" || aspect === "panorama") {
      drawZeros(ctx, c, s);
      drawYIntercept(ctx, c, s);
    }
    if (aspect === "signo" || aspect === "panorama") {
      s.zeros.forEach(function (xz) {
        ctx.fillStyle = "#111";
        ctx.beginPath();
        ctx.arc(c.x2px(xz), c.y2px(0), 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    if (aspect === "monotonia" || aspect === "panorama") drawMonotoneBar(ctx, c, s);
    if (aspect === "concavidad" || aspect === "panorama") drawConcavBar(ctx, c, s);
    if (aspect === "inflexion") drawInflexion(ctx, c, s);
    if (aspect === "extremos" || aspect === "panorama") drawExtremos(ctx, c, s);
    if (aspect === "panorama" && s.inflexion) drawInflexion(ctx, c, s);

    var cap = document.getElementById("labCaption");
    if (cap) {
      var lines = {
        panorama: "Vista general: dominio (banda dorada abajo), ámbito (banda verde a la izquierda), monotonía y concavidad en X.",
        dominio: "Dominio: observe la proyección sobre el eje X entre los puntos extremos cerrados.",
        ambito: "Ámbito: alturas mínima y máxima alcanzadas por la curva en ese dominio.",
        intersecciones: "Intersecciones: ceros en el eje X y cruce con el eje Y.",
        asintotas: "Asíntotas: no hay en este ejemplo; revise otros trazos con ramas infinitas.",
        signo: "Signo: regiones entre ceros; los ceros se excluyen de los intervalos positivo/negativo.",
        monotonia: "Monotonía: flechas en la franja inferior (lectura en X).",
        concavidad: "Concavidad: símbolos ∪/∩ arriba del trazo (lectura en X).",
        inflexion: s.inflexion ? "Inflexión: punto donde cambia la concavidad." : "Inflexión: no hay cambio de concavidad en este ejemplo.",
        extremos: "Extremos: puntos destacados (locales y absolutos según el contexto del dominio)."
      };
      cap.textContent = lines[aspect] || "";
    }
  }

  function init() {
    var cvs = document.getElementById("labCvs");
    var tabs = document.getElementById("aspectTabs");
    var sel = document.getElementById("labScenario");
    if (!cvs || !tabs || !sel) return;

    var state = { scenario: sel.value || "parabola", aspect: "panorama" };

    ASPECTS.forEach(function (a, idx) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tab";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", idx === 0 ? "true" : "false");
      b.textContent = a.label;
      b.dataset.aspect = a.id;
      b.addEventListener("click", function () {
        state.aspect = a.id;
        tabs.querySelectorAll(".tab").forEach(function (t) {
          t.setAttribute("aria-selected", t === b ? "true" : "false");
        });
        mountLabPanels(SCEN[state.scenario], state.aspect);
        drawLab(state);
      });
      tabs.appendChild(b);
    });

    sel.addEventListener("change", function () {
      state.scenario = sel.value;
      mountLabPanels(SCEN[state.scenario], state.aspect);
      drawLab(state);
    });

    mountLabPanels(SCEN[state.scenario], state.aspect);
    drawLab(state);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else init();
})();

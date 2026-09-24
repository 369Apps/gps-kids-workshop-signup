/* GPS Kids Doodle tab: kid-simple finger drawing. No login, no backend. */
(function () {
  var canvas = document.getElementById("doodle-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var COLORS = ["#14213d", "#1458d4", "#de4a3e", "#f3bd35", "#2f9e44", "#7c3aed"];
  var color = COLORS[0];
  var drawing = false;
  var sized = false;

  function dpr() { return window.devicePixelRatio || 1; }

  function sizeCanvas() {
    var r = canvas.getBoundingClientRect();
    if (r.width < 10) return false;
    var k = dpr();
    canvas.width = Math.round(r.width * k);
    canvas.height = Math.round(300 * k);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 6 * k;
    ctx.strokeStyle = color;
    clearCanvas();
    sized = true;
    return true;
  }

  function clearCanvas() {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  function pos(e) {
    var r = canvas.getBoundingClientRect();
    var k = dpr();
    return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
  }

  canvas.addEventListener("pointerdown", function (e) {
    if (!sized) return;
    drawing = true;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    var p = pos(e);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + 0.1, p.y + 0.1);
    ctx.stroke();
    e.preventDefault();
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!drawing) return;
    var p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    e.preventDefault();
  });
  function stop(e) { drawing = false; if (e) e.preventDefault(); }
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);

  // Size the canvas the first time the Doodle tab opens (it is hidden before that).
  var tabBtn = document.querySelector('.tab-btn[data-tab="doodle"]');
  if (tabBtn) {
    tabBtn.addEventListener("click", function initOnce() {
      tabBtn.removeEventListener("click", initOnce);
      requestAnimationFrame(function () { sizeCanvas(); });
    });
  }

  // Color palette
  var pal = document.getElementById("doodle-colors");
  COLORS.forEach(function (c, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "doodle-color" + (i === 0 ? " on" : "");
    b.style.background = c;
    b.setAttribute("aria-label", "Color " + (i + 1));
    b.addEventListener("click", function () {
      color = c;
      var kids = pal.querySelectorAll(".doodle-color");
      for (var j = 0; j < kids.length; j++) kids[j].classList.remove("on");
      b.classList.add("on");
    });
    pal.appendChild(b);
  });

  document.getElementById("doodle-clear").addEventListener("click", function () {
    if (sized) clearCanvas();
  });

  document.getElementById("doodle-save").addEventListener("click", function () {
    if (!sized) return;
    var a = document.createElement("a");
    a.download = "my-gpsk-doodle.png";
    a.href = canvas.toDataURL("image/png");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  // Share straight to WhatsApp etc. when the phone supports file sharing.
  var shareBtn = document.getElementById("doodle-share");
  function canFileShare() {
    if (!navigator.canShare) return false;
    try {
      var f = new File(["x"], "t.png", { type: "image/png" });
      return navigator.canShare({ files: [f] });
    } catch (e) { return false; }
  }
  if (!canFileShare()) {
    shareBtn.style.display = "none";
  } else {
    shareBtn.addEventListener("click", function () {
      if (!sized) return;
      canvas.toBlob(function (blob) {
        if (!blob) return;
        var file = new File([blob], "my-gpsk-doodle.png", { type: "image/png" });
        navigator.share({ files: [file], title: "My GPS Kids doodle" }).catch(function () {});
      }, "image/png");
    });
  }

  // Weekly prompt from the class plan.
  var md = window.MICDROP;
  if (md) {
    var p = document.getElementById("doodle-prompt");
    if (p && md.doodlePrompt) p.textContent = md.doodlePrompt;
    var l = document.getElementById("doodle-learned");
    if (l && md.learned) l.textContent = "This week we learned " + md.learned + ".";
  }
})();

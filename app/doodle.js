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
        var files = [new File([blob], "my-gpsk-doodle.png", { type: "image/png" })];
        var va = window.__gpskDoodleAudio;
        if (va && va.blob) {
          try { files.push(new File([va.blob], "my-doodle-story." + va.ext, { type: va.blob.type })); }
          catch (e) {}
        }
        // If the phone cannot share the voice note too, just share the doodle.
        try {
          if (files.length > 1 && !navigator.canShare({ files: files })) files = files.slice(0, 1);
        } catch (e) { files = files.slice(0, 1); }
        navigator.share({ files: files, title: "My GPS Kids doodle" }).catch(function () {});
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

/* Doodle voice: a 30-second "tell about it" note. On-device only, no upload. */
(function () {
  var tellBtn = document.getElementById("doodle-tell");
  if (!tellBtn) return;
  var row = document.getElementById("doodle-voice-row");
  var hearBtn = document.getElementById("doodle-hear");
  var againBtn = document.getElementById("doodle-again");
  var hint = document.getElementById("doodle-voice-hint");

  var MR = window.MediaRecorder;
  if (!MR || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    tellBtn.style.display = "none";
    return;
  }

  var rec = null, chunks = [], stream = null, timer = null, secs = 0;
  var audioBlob = null, audioURL = null, audioEl = null;
  var MAX_SECS = 30;

  function showHint(t) { hint.textContent = t; hint.hidden = !t; }

  function pickType() {
    var types = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm", ""];
    for (var i = 0; i < types.length; i++) {
      try { if (!types[i] || MR.isTypeSupported(types[i])) return types[i]; } catch (e) {}
    }
    return "";
  }
  function extFor(type) {
    if (type.indexOf("mp4") > -1) return "m4a";
    if (type.indexOf("webm") > -1) return "webm";
    return "audio";
  }

  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

  function finishRecording() {
    stopTimer();
    tellBtn.classList.remove("recording");
    tellBtn.textContent = "Tell about it";
    if (stream) { try { stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} stream = null; }
    if (rec && rec.state !== "inactive") { try { rec.stop(); } catch (e) {} }
  }

  function startRecording() {
    showHint("");
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
      stream = s;
      chunks = [];
      var type = pickType();
      try { rec = type ? new MR(stream, { mimeType: type }) : new MR(stream); }
      catch (e) { showHint("This phone cannot record right now."); return; }
      rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = function () {
        var t = (rec && rec.mimeType) || type || "audio/webm";
        audioBlob = new Blob(chunks, { type: t });
        if (audioURL) { try { URL.revokeObjectURL(audioURL); } catch (e) {} }
        audioURL = URL.createObjectURL(audioBlob);
        window.__gpskDoodleAudio = { blob: audioBlob, ext: extFor(t) };
        row.hidden = false;
        showHint("Nice. Tap Hear it to listen.");
      };
      try { rec.start(); } catch (e) { showHint("This phone cannot record right now."); return; }
      secs = 0;
      tellBtn.classList.add("recording");
      tellBtn.textContent = "Stop (30)";
      timer = setInterval(function () {
        secs++;
        var left = MAX_SECS - secs;
        tellBtn.textContent = "Stop (" + left + ")";
        if (left <= 0) finishRecording();
      }, 1000);
    }).catch(function () {
      showHint("The mic is blocked. Allow the microphone to tell about your doodle.");
    });
  }

  tellBtn.addEventListener("click", function () {
    if (rec && rec.state === "recording") { finishRecording(); return; }
    startRecording();
  });

  hearBtn.addEventListener("click", function () {
    if (!audioURL) return;
    if (!audioEl) audioEl = new Audio();
    audioEl.src = audioURL;
    try { audioEl.play().catch(function () {}); } catch (e) {}
  });

  againBtn.addEventListener("click", function () {
    row.hidden = true;
    audioBlob = null;
    window.__gpskDoodleAudio = null;
    startRecording();
  });
})();

/* Pitch card: record the 3-line pitch and share it on WhatsApp from the card.
   On-device only until the parent taps share. Mirrors the doodle voice pattern. */
(function () {
  var productEl = document.getElementById("pitch-product");
  var reasonEl = document.getElementById("pitch-reason");
  var lineEl = document.getElementById("pitch-line");
  if (!productEl || !reasonEl || !lineEl) return;

  var sayEl = document.getElementById("pitch-say");
  var APP_URL = "https://register.joingpskids.com/app/";
  var LS_PITCH = "gpsk_pitch_v1";

  // Remember the pitch on this phone so it survives reloads.
  function savePitch() {
    try {
      localStorage.setItem(LS_PITCH, JSON.stringify({
        product: productEl.value, reason: reasonEl.value, line: lineEl.value
      }));
    } catch (e) {}
  }
  try {
    var saved = JSON.parse(localStorage.getItem(LS_PITCH) || "null");
    if (saved) {
      productEl.value = saved.product || "";
      reasonEl.value = saved.reason || "";
      lineEl.value = saved.line || "";
    }
  } catch (e) {}

  function refreshSay() {
    var line = lineEl.value.trim();
    sayEl.hidden = !line;
    sayEl.textContent = line ? "\u201C" + line + "\u201D" : "";
  }
  [productEl, reasonEl, lineEl].forEach(function (el) {
    el.addEventListener("input", function () { refreshSay(); savePitch(); });
  });
  refreshSay();

  function getRefCode() {
    try { return localStorage.getItem("gpsk_refcode_v1") || ""; } catch (e) { return ""; }
  }

  function buildText() {
    var product = productEl.value.trim();
    var reason = reasonEl.value.trim();
    var line = lineEl.value.trim();
    var parts = ["\uD83C\uDFA4 *MY KID'S PITCH CARD*"];
    if (product) parts.push("\uD83D\uDCE6 " + product);
    if (reason) parts.push("\uD83D\uDCA1 " + reason);
    if (line) parts.push("\uD83D\uDD25 \u201C" + line + "\u201D");
    parts.push("Delivered at volume 4, loud enough for the back row.");
    var code = getRefCode();
    parts.push("Play tonight's speaking game with us: " + APP_URL + (code ? "?ref=" + code : ""));
    return parts.join("\n");
  }

  /* ---- recording (30s max, same shape as the doodle voice note) ---- */
  var recBtn = document.getElementById("pitch-record");
  var row = document.getElementById("pitch-voice-row");
  var hearBtn = document.getElementById("pitch-hear");
  var againBtn = document.getElementById("pitch-again");
  var hint = document.getElementById("pitch-voice-hint");
  var MR = window.MediaRecorder;
  var rec = null, chunks = [], stream = null, timer = null, secs = 0;
  var audioBlob = null, audioURL = null, audioEl = null;
  var MAX_SECS = 30;

  function showHint(t) { hint.textContent = t; hint.hidden = !t; }

  if (!MR || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    recBtn.style.display = "none";
  } else {
    var types = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm", ""];
    var pickType = function () {
      for (var i = 0; i < types.length; i++) {
        try { if (!types[i] || MR.isTypeSupported(types[i])) return types[i]; } catch (e) {}
      }
      return "";
    };
    var extFor = function (t) {
      if (t.indexOf("mp4") > -1) return "m4a";
      if (t.indexOf("webm") > -1) return "webm";
      return "audio";
    };
    var stopTimer = function () { if (timer) { clearInterval(timer); timer = null; } };
    var finishRecording = function () {
      stopTimer();
      recBtn.classList.remove("recording");
      recBtn.textContent = "Record the pitch";
      if (stream) { try { stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} stream = null; }
      if (rec && rec.state !== "inactive") { try { rec.stop(); } catch (e) {} }
    };
    var startRecording = function () {
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
          window.__gpskPitchAudio = { blob: audioBlob, ext: extFor(t) };
          row.hidden = false;
          showHint("Nice. Tap Hear it to listen, then share it.");
        };
        try { rec.start(); } catch (e) { showHint("This phone cannot record right now."); return; }
        secs = 0;
        recBtn.classList.add("recording");
        recBtn.textContent = "Stop (30)";
        timer = setInterval(function () {
          secs++;
          var left = MAX_SECS - secs;
          recBtn.textContent = "Stop (" + left + ")";
          if (left <= 0) finishRecording();
        }, 1000);
      }).catch(function () {
        showHint("The mic is blocked. Allow the microphone to record the pitch.");
      });
    };
    recBtn.addEventListener("click", function () {
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
      window.__gpskPitchAudio = null;
      startRecording();
    });
  }

  /* ---- share from the card ---- */
  document.getElementById("pitch-share").addEventListener("click", function () {
    var text = buildText();
    if (!productEl.value.trim() && !reasonEl.value.trim() && !lineEl.value.trim() && !window.__gpskPitchAudio) {
      showHint("Write at least one line of the pitch first.");
      return;
    }
    var va = window.__gpskPitchAudio;
    var files = [];
    if (va && va.blob) {
      try { files.push(new File([va.blob], "my-pitch." + va.ext, { type: va.blob.type })); } catch (e) {}
    }
    var canFile = false;
    try { canFile = files.length > 0 && !!navigator.canShare && navigator.canShare({ files: files }); } catch (e) {}
    if (canFile) {
      // Phone share sheet: WhatsApp is one tap away, voice note rides along.
      navigator.share({ files: files, title: "My kid's pitch card", text: text }).catch(function () {});
    } else {
      // Straight into WhatsApp with the card text prefilled.
      window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
    }
  });
})();

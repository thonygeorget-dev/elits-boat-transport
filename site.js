// ---- MENU BURGER ----
document.getElementById("bg").addEventListener("click", function() {
  document.getElementById("mb").classList.toggle("open");
});
document.addEventListener("click", function(e) {
  var m = document.getElementById("mb");
  var b = document.getElementById("bg");
  if (!m.contains(e.target) && !b.contains(e.target)) {
    m.classList.remove("open");
  }
});
document.querySelectorAll(".mob a").forEach(function(a) {
  a.addEventListener("click", function() {
    document.getElementById("mb").classList.remove("open");
  });
});

// ---- MODAL DEVIS ----
function ouvrirDevis() {
  document.getElementById("ov").classList.add("on");
  document.body.style.overflow = "hidden";
}
function fermerDevis() {
  document.getElementById("ov").classList.remove("on");
  document.body.style.overflow = "";
}
document.getElementById("btnX").addEventListener("click", fermerDevis);
document.getElementById("ov").addEventListener("click", function(e) {
  if (e.target === this) fermerDevis();
});
document.querySelectorAll("[data-devis]").forEach(function(b) { b.addEventListener("click", ouvrirDevis); });

// ---- ENVOI DEVIS (envoi réel par serveur via FormSubmit, copie dans la boîte mail) ----
document.getElementById("btnEnvoyer").addEventListener("click", function() {
  var btn  = document.getElementById("btnEnvoyer");
  var nom  = document.getElementById("fNom").value.trim();
  var pre  = document.getElementById("fPre").value.trim();
  var mail = document.getElementById("fMail").value.trim();
  var dep  = document.getElementById("fDep").value.trim();
  var arr  = document.getElementById("fArr").value.trim();
  var type = document.getElementById("fType").value;
  var lon  = document.getElementById("fLong").value.trim();
  if (!nom || !pre || !mail || !dep || !arr || !type || !lon) {
    alert("Merci de renseigner tous les champs obligatoires (*)");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
    alert("Merci de vérifier votre adresse e-mail : elle semble incorrecte.");
    return;
  }
  var adr  = document.getElementById("fAdr").value.trim();
  var pds  = document.getElementById("fPds").value.trim();
  var dat  = document.getElementById("fDate").value;
  var eauD  = document.getElementById("fEauDep").value;
  var eauA  = document.getElementById("fEauArr").value;
  var bersD = document.getElementById("fBersDep").value;
  var bersA = document.getElementById("fBersArr").value;
  var nEau  = (eauD.indexOf("Oui") === 0 ? 1 : 0) + (eauA.indexOf("Oui") === 0 ? 1 : 0);
  var nBers = (bersD.indexOf("Oui") === 0 ? 1 : 0) + (bersA.indexOf("Oui") === 0 ? 1 : 0);
  var prise = document.getElementById("fPrise").value;
  var hp = document.getElementById("fHoney");
  if (!hp) {
    hp = document.createElement("input");
    hp.type = "text"; hp.id = "fHoney"; hp.tabIndex = -1; hp.autocomplete = "off";
    hp.setAttribute("aria-hidden", "true");
    hp.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;opacity:0";
    document.getElementById("formZone").appendChild(hp);
  }
  var err = document.getElementById("fErr");
  if (!err) {
    err = document.createElement("div");
    err.id = "fErr";
    err.setAttribute("role", "alert");
    err.style.cssText = "display:none;margin-top:14px;padding:12px 14px;border-radius:9px;background:#fdecea;color:#8a1c14;font-size:14px;line-height:1.6;border:1px solid #f1b5b0";
    btn.parentNode.appendChild(err);
  }
  err.style.display = "none";
  var libelle = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Envoi en cours…";
  var data = {
    "access_key": "37ab6ef2-7308-4cde-9dbb-cff02e793c8b",
    "subject": "Demande de devis - " + pre + " " + nom,
    "from_name": "Site elitsboattransport.fr",
    "botcheck": hp.value,
    "name": pre + " " + nom,
    "Nom": nom,
    "Prénom": pre,
    "email": mail,
    "Adresse": adr || "non renseignée",
    "Lieu de prise en charge": dep,
    "Lieu de livraison": arr,
    "Mise à l'eau / sortie d'eau au lieu de prise en charge": eauD,
    "Mise à l'eau / sortie d'eau au lieu de livraison": eauA,
    "Nombre de forfaits mise à l'eau / sortie d'eau": nEau + " x 40 €",
    "Manutention sur bers au lieu de prise en charge": bersD,
    "Manutention sur bers au lieu de livraison": bersA,
    "Nombre de forfaits manutention sur bers": nBers + " x 40 €",
    "Forfait d'arrimage du bateau (obligatoire)": "40 € - mise sur remorque et sanglage",
    "Forfait prise en charge (aller chercher et ramener le bateau au ponton)": prise,
    "Type de bateau": type,
    "Longueur (m)": lon,
    "Poids (kg)": pds || "non renseigné",
    "Date envisagée": dat || "non renseignée",
    "Page d'origine": location.href
  };
  var ctrl = (typeof AbortController !== "undefined") ? new AbortController() : null;
  var tmo = ctrl ? setTimeout(function() { ctrl.abort(); }, 20000) : null;
  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(data),
    signal: ctrl ? ctrl.signal : undefined
  }).then(function(r) { return r.json().then(function(j) { return { ok: r.ok, j: j }; }); })
  .then(function(res) {
    if (tmo) clearTimeout(tmo);
    if (res.ok && (res.j.success === true || res.j.success === "true")) {
      document.getElementById("formZone").style.display = "none";
      document.getElementById("fok").style.display = "block";
    } else {
      throw new Error((res.j && res.j.message) ? String(res.j.message) : "echec");
    }
  }).catch(function(e) {
    if (tmo) clearTimeout(tmo);
    btn.disabled = false;
    btn.textContent = libelle;
    err.innerHTML = "<strong>Votre demande n'a pas pu être envoyée.</strong> Vos informations sont conservées : vous pouvez réessayer, ou nous appeler au <a href=\"tel:0667040674\" style=\"color:#8a1c14;font-weight:700\">06.67.04.06.74</a> / écrire à <a href=\"mailto:thonygeorget@elitsboattransport.fr\" style=\"color:#8a1c14;font-weight:700\">thonygeorget@elitsboattransport.fr</a>.";
    if (e && e.message && e.message !== "echec" && e.name !== "TypeError" && e.name !== "AbortError") {
      err.innerHTML += "<br><small style=\"opacity:.8\">Détail technique : " + String(e.message).replace(/</g, "&lt;").slice(0, 200) + "</small>";
    }
    err.style.display = "block";
  });
});

// ---- VISIONNEUSE PHOTOS (page Missions) ----
(function() {
  var links = [].slice.call(document.querySelectorAll("a[data-lb]"));
  if (!links.length) return;
  var lb = document.createElement("div");
  lb.className = "lb";
  lb.setAttribute("role", "dialog");
  lb.innerHTML = '<button class="lb-x" aria-label="Fermer">&#10005;</button><button class="lb-p" aria-label="Photo précédente">&#8249;</button><img alt=""><button class="lb-n" aria-label="Photo suivante">&#8250;</button>';
  document.body.appendChild(lb);
  var img = lb.querySelector("img"), group = [], idx = 0;
  function show() {
    img.src = group[idx].href;
    img.alt = group[idx].getAttribute("data-alt") || "";
  }
  function open(a) {
    var g = a.getAttribute("data-lb");
    group = links.filter(function(l) { return l.getAttribute("data-lb") === g; });
    idx = group.indexOf(a);
    lb.classList.toggle("single", group.length < 2);
    show();
    lb.classList.add("on");
    document.body.style.overflow = "hidden";
  }
  function close() { lb.classList.remove("on"); document.body.style.overflow = ""; img.src = ""; }
  function move(d) { idx = (idx + d + group.length) % group.length; show(); }
  links.forEach(function(a) { a.addEventListener("click", function(e) { e.preventDefault(); open(a); }); });
  lb.querySelector(".lb-x").addEventListener("click", close);
  lb.querySelector(".lb-p").addEventListener("click", function(e) { e.stopPropagation(); move(-1); });
  lb.querySelector(".lb-n").addEventListener("click", function(e) { e.stopPropagation(); move(1); });
  lb.addEventListener("click", function(e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function(e) {
    if (!lb.classList.contains("on")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft" && group.length > 1) move(-1);
    if (e.key === "ArrowRight" && group.length > 1) move(1);
  });
})();

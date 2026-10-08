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

// ---- ENVOI DEVIS ----
document.getElementById("btnEnvoyer").addEventListener("click", function() {
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
  var adr  = document.getElementById("fAdr").value.trim();
  var pds  = document.getElementById("fPds").value.trim();
  var dat  = document.getElementById("fDate").value;
  var eau  = document.getElementById("fEau").value;
  var bers = document.getElementById("fBers").value;
  var prise = document.getElementById("fPrise").value;
  var sujet = "Demande de devis - " + pre + " " + nom;
  var corps =
    "Bonjour,\n\n" +
    "Nom : " + nom + "\n" +
    "Prenom : " + pre + "\n" +
    "Adresse : " + (adr || "non renseignee") + "\n" +
    "Email : " + mail + "\n\n" +
    "Lieu de prise en charge : " + dep + "\n" +
    "Lieu de livraison : " + arr + "\n" +
    "Mise a l eau ou sortie d eau : " + eau + "\n" +
    "Mise sur bers ou manutention : " + bers + "\n" +
    "Forfait prise en charge (sanglage, amarrage) : " + prise + "\n\n" +
    "Type de bateau : " + type + "\n" +
    "Longueur : " + lon + " m\n" +
    "Poids : " + (pds || "non renseigne") + " kg\n" +
    "Date envisagee : " + (dat || "non renseignee") + "\n\n" +
    "Cordialement";
  window.location.href = "mailto:thonygeorget@elitsboattransport.fr?subject=" + encodeURIComponent(sujet) + "&body=" + encodeURIComponent(corps);
  document.getElementById("formZone").style.display = "none";
  document.getElementById("fok").style.display = "block";
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

async function loadSections() {
  const files = [
    ["introduction", "sections/introduction.html"],
    ["domaine-1", "sections/domaine-1-informations-donnees.html"],
    ["domaine-2", "sections/domaine-2-communication-collaboration.html"],
    ["domaine-3", "sections/domaine-3-creation-contenu.html"],
    ["domaine-4", "sections/domaine-4-protection-securite.html"],
    ["domaine-5", "sections/domaine-5-environnement-numerique.html"]
  ];
  const fragments = await Promise.all(files.map(async ([id, path]) => {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Unable to load ${path} (${response.status}).`);
    return [id, await response.text()];
  }));
  const markup = new Map(fragments);
  const deck = document.getElementById("deck");
  const parser = new DOMParser();
  const introduction = parser.parseFromString(markup.get("introduction"), "text/html");
  deck.append(...Array.from(introduction.body.childNodes));
  for (const [id] of files.slice(1)) {
    const slots = deck.querySelectorAll(`template[data-domain-slot="${id}"]`);
    if (slots.length !== 1) throw new Error(`Expected one insertion point for ${id}, found ${slots.length}.`);
    const fragment = parser.parseFromString(markup.get(id), "text/html");
    if (id === "domaine-1") {
      fragment.body.querySelectorAll(".slide").forEach(slide => slide.classList.add("d1-chapter"));
    }
    const content = document.createDocumentFragment();
    content.append(...Array.from(fragment.body.childNodes));
    slots[0].replaceWith(content);
  }
}

function showLoadError(error) {
  console.error("The course could not be initialized.", error);
  const deck = document.getElementById("deck");
  const message = document.createElement("p");
  message.setAttribute("role", "alert");
  message.textContent = "Le cours n’a pas pu être chargé. Vérifie ta connexion puis actualise la page.";
  deck.replaceChildren(message);
  deck.setAttribute("aria-busy", "false");
}

function initializeCourse() {
  const slides=[...document.querySelectorAll(".slide")];
  const N=slides.length, count=document.getElementById("count"), prog=document.getElementById("prog");
  const where=document.getElementById("where"), wtext=document.getElementById("wtext");
  const PARTS={garde:["MAI112 · SupNum","violet"],intro:["Sommaire","blue"],p2:["01 · Cadrage et prérequis","sky"],p3:["02 · Découvrir Pix","violet"],p4:["03 · Domaine 1 · Informations et données","blue"],"d1-vocabulaire":["03 · Domaine 1 · 5 mots à connaître","blue"],d12:["03 · Domaine 1 · 1.2 Gérer des données","blue"],"d12-fichiers":["03 · Domaine 1 · 1.2 · Les fichiers","blue"],"d12-types":["03 · Domaine 1 · 1.2 · Types et tailles","blue"],"d12-stockage":["03 · Domaine 1 · 1.2 · Le stockage","blue"],"d12-organiser":["03 · Domaine 1 · 1.2 · L’arborescence","blue"],"d12-chemin":["03 · Domaine 1 · 1.2 · Les chemins","blue"],"d12-recherche":["03 · Domaine 1 · 1.2 · Recherche et métadonnées","blue"],"d12-manipuler":["03 · Domaine 1 · 1.2 · Copier et déplacer","blue"],"d12-gestes":["03 · Domaine 1 · 1.2 · Créer et enregistrer","blue"],"d12-archiver":["03 · Domaine 1 · 1.2 · Archives et ZIP","blue"],"d12-extraire":["03 · Domaine 1 · 1.2 · Créer et extraire un ZIP","blue"],"d12-sauvegarder":["03 · Domaine 1 · 1.2 · Sauvegarder et versionner","blue"],"d12-synchroniser":["03 · Domaine 1 · 1.2 · Synchronisation et sauvegarde","blue"],"d12-proteger":["03 · Domaine 1 · 1.2 · Droits d’accès","blue"],"d12-pix":["03 · Domaine 1 · 1.2 · Révision avant Pix","blue"],p5:["04 · Domaine 2 · Communication et collaboration","green"],p6:["05 · Domaine 3 · Création de contenu","orange"],p7:["06 · Domaine 4 · Protection et sécurité","red"],p8:["07 · Domaine 5 · Environnement numérique","violet"],fin:["Fin du cours","violet"]};
  const partOf=[];let last="garde";slides.forEach(s=>{if(PARTS[s.id])last=s.id;partOf.push(last)});
  let cur=0;
  function setCur(i){cur=i;count.textContent=(i+1)+" / "+N;prog.style.width=((i+1)/N*100)+"%";
    const p=PARTS[partOf[i]];wtext.textContent=p[0];where.className="where "+p[1]}
  function go(i){i=Math.max(0,Math.min(N-1,i));slides[i].scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});setCur(i)}
  function goToHash(hash){const target=document.getElementById(decodeURIComponent(hash.replace(/^#/,"")));const i=slides.indexOf(target);if(i>=0)go(i)}
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>=.5)setCur(slides.indexOf(e.target))})},{threshold:[.5]});
  slides.forEach(s=>io.observe(s));setCur(0);
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
    const target=document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1))),i=slides.indexOf(target);
    if(i<0)return;e.preventDefault();
    const hash="#"+encodeURIComponent(target.id);
    if(location.hash!==hash)history.pushState(null,"",hash);
    go(i)}));
  addEventListener("popstate",()=>goToHash(location.hash));
  document.getElementById("up").onclick=()=>go(cur-1);
  document.getElementById("down").onclick=()=>go(cur+1);
  document.addEventListener("keydown",e=>{
    if(e.target.closest("input,textarea,select"))return;
    if(["ArrowDown","PageDown"].includes(e.key)||(e.key===" "&&!e.target.closest("button,a"))){e.preventDefault();go(cur+1)}
    else if(["ArrowUp","PageUp"].includes(e.key)){e.preventDefault();go(cur-1)}
    else if(e.key==="Home"){e.preventDefault();go(0)}else if(e.key==="End"){e.preventDefault();go(N-1)}
    else if(e.key==="f"||e.key==="F"){toggleFs()}});
  function toggleFs(){try{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen().catch(()=>{})}catch(e){}}
  document.getElementById("fs").onclick=toggleFs;
  if(!document.documentElement.requestFullscreen)document.getElementById("fs").hidden=true;


  // Numi, la mascotte du cours (dessin original)
  const NUMI='<svg viewBox="0 0 120 130" aria-hidden="true"><ellipse cx="60" cy="124" rx="28" ry="4.5" fill="#242424" opacity=".08"/><g class="nb"><line x1="60" y1="24" x2="60" y2="10" stroke="#242424" stroke-width="3" stroke-linecap="round"/><circle class="ant" cx="60" cy="9" r="6" fill="#6A3BD8"/><path class="arm" d="M98 78 q16 -4 15 -22" stroke="#FFC400" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M22 80 q-12 6 -10 18" stroke="#FFC400" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M60 22 C96 22 106 50 106 72 C106 100 87 116 60 116 C33 116 14 100 14 72 C14 50 24 22 60 22 Z" fill="#FFC400"/><ellipse cx="40" cy="42" rx="11" ry="6" fill="#fff" opacity=".45" transform="rotate(-30 40 42)"/><g class="eyes"><ellipse cx="46" cy="66" rx="6" ry="8" fill="#242424"/><ellipse cx="74" cy="66" rx="6" ry="8" fill="#242424"/><circle cx="48" cy="62.5" r="2.2" fill="#fff"/><circle cx="76" cy="62.5" r="2.2" fill="#fff"/></g><circle cx="35" cy="80" r="6" fill="#FF7FA6" opacity=".5"/><circle cx="85" cy="80" r="6" fill="#FF7FA6" opacity=".5"/><path d="M52 82 Q60 90 68 82" stroke="#242424" stroke-width="3" fill="none" stroke-linecap="round"/></g></svg>';
  document.querySelectorAll(".numi").forEach(el=>el.innerHTML=NUMI);

  // Apparition douce : chaque élément arrive l'un après l'autre
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!reduce){document.documentElement.classList.add("anim");
    slides.forEach(sl=>{const inner=sl.querySelector(".inner");if(inner)[...inner.children].forEach((c,k)=>c.style.setProperty("--i",k))})}
  const seen=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("on")}),{threshold:.35});
  slides.forEach(sl=>seen.observe(sl));


  // Compteurs qui montent (8, 32, 512) quand la slide apparaît
  if(!reduce){document.querySelectorAll("[data-count]").forEach(el=>{el.textContent="0"});
    const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);
      const el=e.target,end=+el.dataset.count,t0=performance.now(),d=1200;
      (function tick(t){const p=Math.min(1,(t-t0)/d),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=v;if(p<1)requestAnimationFrame(tick)})(t0)}),{threshold:.6});
    document.querySelectorAll("[data-count]").forEach(el=>cio.observe(el))}
  else{document.querySelectorAll("animate,animateMotion").forEach(a=>a.remove())}

  // Chaque slide tient dans un écran : on réduit doucement la taille si besoin
  function fit(s){const inner=s.querySelector(".inner");if(!inner)return;inner.style.setProperty("--fit",1);
    const cs=getComputedStyle(s);const avail=s.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
    let f=1;while(inner.scrollHeight>avail&&f>0.62){f-=0.03;inner.style.setProperty("--fit",f.toFixed(2))}}
  function fitAll(){slides.forEach(fit)}
  fitAll();addEventListener("resize",()=>{clearTimeout(fitAll.t);fitAll.t=setTimeout(fitAll,120)});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitAll);

  // Quiz : touche une réponse
  document.querySelectorAll(".quiz").forEach(q=>{const ans=+q.dataset.answer;
    q.querySelectorAll(".opt").forEach(o=>o.addEventListener("click",()=>{
      if(q.dataset.done)return;q.dataset.done="1";const ok=+o.dataset.k===ans;
      q.querySelectorAll(".opt").forEach(x=>{x.setAttribute("aria-disabled","true");if(+x.dataset.k===ans)x.classList.add("good")});
      if(!ok)o.classList.add("bad");
      const r=document.createElement("div");r.className="reveal";r.setAttribute("role","status");
      r.innerHTML='<span class="numi">'+NUMI+'</span><div><b></b><span class="w"></span></div>';r.querySelector("b").textContent=ok?q.dataset.ok:q.dataset.ko;r.querySelector(".w").textContent=q.dataset.why;
      q.appendChild(r);fit(q.closest(".slide"))}))});

  // Mots : touche pour voir la définition
  const def=document.getElementById("def");
  document.querySelectorAll(".word").forEach(w=>w.addEventListener("click",()=>{
    document.querySelectorAll(".word").forEach(x=>x.setAttribute("aria-pressed",x===w?"true":"false"));
    def.innerHTML="<b></b> : <span></span>";def.querySelector("b").textContent=w.textContent;def.querySelector("span").textContent=w.dataset.def;fit(w.closest(".slide"))}));
  document.querySelectorAll(".word").forEach(w=>w.setAttribute("aria-pressed","false"));

  // ===== 5 mots par domaine : touche une carte pour voir la définition =====
  document.querySelectorAll(".fc").forEach(c=>c.addEventListener("click",()=>{
    c.setAttribute("aria-expanded",c.getAttribute("aria-expanded")==="true"?"false":"true");fit(c.closest(".slide"))}));
  document.querySelectorAll(".showall").forEach(b=>b.addEventListener("click",()=>{
    const s=b.closest(".slide"),cs=[...s.querySelectorAll(".fc")],open=cs.every(c=>c.getAttribute("aria-expanded")==="true");
    cs.forEach(c=>c.setAttribute("aria-expanded",open?"false":"true"));b.textContent=open?"Tout afficher":"Tout cacher";fit(s)}));

  // ===== Domaines, compétences et mots-clés (servent au jeu et au classement) =====
  const DOMS={1:["Informations et données","blue"],2:["Communication et collaboration","green"],3:["Création de contenu","orange"],4:["Protection et sécurité","red"],5:["Environnement numérique","violet"]};
  const COMPS={"1.1":"Mener une recherche et une veille d'information","1.2":"Gérer des données","1.3":"Traiter des données",
    "2.1":"Interagir","2.2":"Partager et publier","2.3":"Collaborer","2.4":"S'insérer dans le monde numérique",
    "3.1":"Développer des documents textuels","3.2":"Développer des documents multimédias","3.3":"Adapter les documents à leur finalité","3.4":"Programmer",
    "4.1":"Sécuriser l'environnement numérique","4.2":"Protéger les données personnelles et la vie privée","4.3":"Protéger la santé, le bien-être et l'environnement",
    "5.1":"Résoudre des problèmes techniques","5.2":"Construire un environnement numérique"};
  // Chaque mot-clé est un début de mot ("recherch" trouve recherche, rechercher…). "|3" = poids plus fort.
  const KW={
    "1.1":"recherch|2,moteur,google,bing,qwant,source|2,fiable|2,fiabilit|2,verifi,veille|2,alerte,rss,fake news|3,infox|3,rumeur,wikipedia,article,info|2,vrai|2,croire",
    "1.2":"fichier|2,dossier|2,ranger|2,rangement|2,classer,nommer,renomm|2,sauvegard|2,cloud,drive,onedrive,cle usb,retrouver,perdu,extension,arborescence|3,zip,compress",
    "1.3":"tableur|3,excel|3,calc,sheets|2,tableau,cellule|2,formule|2,moyenne|2,somme,calcul|2,trier|2,tri,filtr|2,graphique,donnee,csv|2,colonne,pourcentage",
    "2.1":"mail|2,email|2,e-mail|2,courriel|3,message,messagerie|2,piece jointe|3,destinataire|2,cci|2,repondre,envoyer|2,whatsapp,visio,zoom,teams,discord,forum,chat,poli,netiquette|3,ecrire a",
    "2.2":"partag|2,publi|2,poster,post,reseau social|3,reseaux sociaux|3,instagram,tiktok,facebook,youtube,snapchat,citer|2,lien,story",
    "2.3":"collabor|3,a plusieurs|3,ensemble,groupe,equipe,co-edit|3,coedit|3,document partage|3,commentaire,agenda,calendrier,sondage,google docs|3,en meme temps|2",
    "2.4":"identite numerique|4,e-reputation|4,reputation|3,recruteur|3,profil,mon nom|3,cv en ligne|3,linkedin|2,trace|2,image de moi",
    "3.1":"word|2,writer|2,traitement de texte|3,texte,rapport|2,mise en forme|3,titre,style|2,sommaire|3,table des matieres|3,police,paragraphe,marge,numerot,en-tete|2,pied de page|2,lettre,cv",
    "3.2":"diaporama|3,powerpoint|3,presentation,image,photo,retouch|2,video|2,montage|3,monter|2,son,audio|2,podcast|3,multimedia|3,dessin,affiche|2,canva",
    "3.3":"format|2,pdf|2,export|2,convertir|2,droit d auteur|4,licence|3,creative commons|4,droit a l image|4,plagi|3,copier-coller,taille du fichier|2,le droit|3,droit de|3,trouvee sur internet|2",
    "3.4":"programm|3,code,coder|3,algorithm|3,python|3,scratch|3,boucle|2,variable|2,html|2,javascript|3,instruction",
    "4.1":"virus|3,antivirus|3,malware|3,malveillant|3,rancon|3,phishing|4,hameconnage|4,arnaque|3,faux mail|3,faux sms|3,faux site|3,faux message|3,pirat|3,hack|3,mise a jour|2,mises a jour|2,securis|2,pare-feu|3,spam|2,sms,clique,lien suspect|3",
    "4.2":"mot de passe|4,mots de passe|4,mdp|3,donnees personnelles|4,vie privee|4,confidentialit|3,cookie|3,rgpd|4,geolocalis|3,localisation|2,double authentification|4,2fa|3,compte|2,code bancaire|3,banque|2,webcam,proteger mon,identifiant|2",
    "4.3":"harcel|4,cyberharcel|4,temps d ecran|4,heures par jour|3,sante|3,sommeil|3,addiction|3,accro|3,bien-etre|3,fatigue|2,posture|2,yeux|2,ecolog|3,energie|2,pollu|3,sobriete|3,recycl|3,carbone|3,environnement|2,grave",
    "5.1":"panne|3,bug|3,plante|2,bloque|2,lent|2,ne marche|3,ne fonctionne|3,marche plus|3,fonctionne plus|3,s allume|3,redemarr|3,reinitialis|2,wifi|2,wi-fi|2,connexion|2,imprim|2,ecran noir|3,batterie|2,souris,clavier,bluetooth|2,probleme|2,que faire,reparer|3,depann|3",
    "5.2":"install|3,desinstall|3,logiciel|2,application,appli,systeme d exploitation|4,windows|2,macos|2,linux|2,android|2,pilote|3,driver|3,parametr|2,configur|3,peripherique|3,memoire|2,stockage|2,espace disque|3,materiel|3,navigateur,raccourci|2,environnement numerique|4,personnalis|2,ordinateur"
  };
  const norm=s=>" "+s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[’'`]/g," ").replace(/[^a-z0-9+-]+/g," ").trim()+" ";
  const KWL=[];Object.entries(KW).forEach(([c,l])=>l.split(",").forEach(x=>{const [p,w]=x.split("|");KWL.push({c,p:norm(p).trimEnd(),w:+(w||1),label:p})}));
  function classify(q){const t=norm(q),comp={},dom={1:0,2:0,3:0,4:0,5:0},hits={1:[],2:[],3:[],4:[],5:[]};
    const ow=q.replace(/[’'`]/g," ").split(/[^A-Za-zÀ-ÿ0-9+-]+/).filter(Boolean),nw=ow.map(w=>norm(w).trim());
    const lab=k=>{const pw=k.p.trim(),n=pw.split(" ").length;for(let i=0;i<nw.length;i++){if(nw.slice(i,i+n).join(" ").startsWith(pw))return ow.slice(i,i+n).join(" ").toLowerCase()}return k.label};
    KWL.forEach(k=>{if(t.includes(k.p)){comp[k.c]=(comp[k.c]||0)+k.w;const d=k.c[0];dom[d]+=k.w;const L=lab(k);if(!hits[d].includes(L))hits[d].push(L)}});
    const order=Object.keys(dom).sort((a,b)=>dom[b]-dom[a]);const best=order[0];if(!dom[best])return null;
    const bc=Object.keys(comp).filter(c=>c[0]===best).sort((a,b)=>comp[b]-comp[a])[0];
    return {d:+best,c:bc,hits:hits[best],second:dom[order[1]]&&dom[order[1]]>=dom[best]*.75?+order[1]:0}}

  // ===== Le jeu du tri =====
  const BASE=[
    ["Je cherche des infos pour un exposé : comment savoir si un site est fiable ?","1.1","Chercher une information et vérifier qu'elle est fiable."],
    ["Je veux calculer la moyenne de mes notes dans un tableur.","1.3","Calculer, trier ou filtrer dans un tableur, c'est traiter des données."],
    ["J'ai 200 fichiers « Document1 » sur mon bureau. Comment m'y retrouver ?","1.2","Ranger, nommer et sauvegarder ses fichiers, c'est gérer des données."],
    ["Comment écrire un mail poli à mon professeur, avec une pièce jointe ?","2.1","Écrire le bon message, au bon endroit, avec le bon ton : interagir."],
    ["On doit rédiger un exposé à 4, sur le même document, en même temps.","2.3","Travailler à plusieurs sur un document en ligne : collaborer."],
    ["Qu'est-ce qu'un recruteur trouve s'il tape mon nom sur Internet ?","2.4","Ton identité numérique et ton e-réputation."],
    ["Je veux publier une photo de mon groupe d'amis sur Instagram.","2.2","Publier en public ou en privé, et respecter les autres : partager et publier."],
    ["Comment créer un sommaire automatique dans mon rapport ?","3.1","Titres, styles et sommaire : développer des documents textuels."],
    ["Je veux monter une petite vidéo pour présenter mon projet.","3.2","Image, son, vidéo : développer des documents multimédias."],
    ["J'ai le droit de mettre une image trouvée sur Internet dans mon exposé ?","3.3","Droit d'auteur et droit à l'image : adapter les documents à leur finalité."],
    ["Je reçois un SMS de « ma banque » qui me demande mon code.","4.1","C'est du phishing : savoir repérer une arnaque, c'est sécuriser son environnement."],
    ["Comment créer un mot de passe solide pour mes comptes ?","4.2","Protéger ses comptes et ses données personnelles."],
    ["Je passe 7 heures par jour sur mon téléphone, c'est grave ?","4.3","Temps d'écran et bien-être : protéger sa santé."],
    ["Mon imprimante n'imprime plus rien. Que faire ?","5.1","Avoir les bons réflexes face à une panne : résoudre des problèmes techniques."],
    ["Comment installer et configurer un nouveau logiciel ?","5.2","Installer et paramétrer ses outils : construire son environnement numérique."]
  ];
  let extra=[];try{localStorage.removeItem("pix-tri-extra")}catch(e){}
  const gq=document.getElementById("gq"),gpick=document.getElementById("gpick"),gfb=document.getElementById("gfb"),gnext=document.getElementById("gnext"),
        gpos=document.getElementById("gpos"),gscore=document.getElementById("gscore"),gslide=document.getElementById("tri");
  let deck=[],gi=0,score=0,answered=false;
  const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  function startGame(){deck=shuffle([...BASE,...extra]);gi=0;score=0;showQ()}
  function showQ(){answered=false;gfb.innerHTML="";gnext.hidden=true;
    gpick.querySelectorAll(".dbtn").forEach(b=>{b.className="dbtn "+DOMS[b.dataset.d][1];b.removeAttribute("aria-disabled")});
    if(gi>=deck.length){gpick.hidden=true;gq.textContent="Terminé ! Tu as "+score+" bonne"+(score>1?"s":"")+" réponse"+(score>1?"s":"")+" sur "+deck.length+".";
      gpos.textContent="Fin du jeu";gnext.textContent="Rejouer";gnext.hidden=false;fit(gslide);return}
    gpick.hidden=false;gq.textContent=deck[gi][0];gpos.textContent="Question "+(gi+1)+" sur "+deck.length;
    gscore.innerHTML="Score : <b>"+score+"</b>";fit(gslide)}
  gpick.querySelectorAll(".dbtn").forEach(b=>b.addEventListener("click",()=>{
    if(answered)return;answered=true;const q=deck[gi],good=+q[1][0],ok=+b.dataset.d===good;if(ok)score++;
    gpick.querySelectorAll(".dbtn").forEach(x=>{x.setAttribute("aria-disabled","true");const d=+x.dataset.d;
      if(d===good)x.classList.add("good");else if(x===b)x.classList.add("bad");else x.classList.add("dim")});
    const r=document.createElement("div");r.className="reveal";r.setAttribute("role","status");
    r.innerHTML='<span class="numi">'+NUMI+'</span><div><b></b><span class="w"></span></div>';
    r.querySelector("b").textContent=(ok?"Bien vu ! ":"Pas tout à fait. ")+"Domaine "+good+" · compétence "+q[1]+" ("+COMPS[q[1]]+")";
    r.querySelector(".w").textContent=q[2];gfb.appendChild(r);
    gscore.innerHTML="Score : <b>"+score+"</b>";gnext.textContent=gi+1<deck.length?"Question suivante":"Voir mon score";gnext.hidden=false;fit(gslide)}));
  gnext.addEventListener("click",()=>{if(gi>=deck.length){startGame();return}gi++;showQ()});
  startGame();

  // ===== Écris une question : classement automatique =====
  const askf=document.getElementById("askf"),askq=document.getElementById("askq"),askr=document.getElementById("askr"),added=document.getElementById("added"),aslide=document.getElementById("classe");
  function showAdded(){added.textContent=extra.length?extra.length+" question"+(extra.length>1?"s":"")+" ajoutée"+(extra.length>1?"s":"")+" au jeu du tri.":""}
  if(askf){showAdded();
  function render(q,res,pickD){
    const d=pickD||(res?res.d:0);askr.innerHTML="";const box=document.createElement("div");box.className="res "+(d?DOMS[d][1]:"");
    if(d){const fromKw=res&&res.d===d;
      box.innerHTML='<div class="dn"><span class="num">'+d+'</span><span>Domaine '+d+' · '+DOMS[d][0]+'</span></div>';
      const p=document.createElement("p");
      p.innerHTML=fromKw?"Compétence probable : <b>"+res.c+"</b> · "+COMPS[res.c]+".":"Domaine choisi par toi.";box.appendChild(p);
      if(fromKw&&res.hits.length){const t=document.createElement("div");t.className="tags";
        res.hits.forEach(h=>{const s=document.createElement("span");s.className="tag";s.textContent=h;t.appendChild(s)});
        const l=document.createElement("p");l.className="small";l.textContent="Mots-clés repérés :";box.appendChild(l);box.appendChild(t)}
      if(fromKw&&res.second&&!pickD){const s=document.createElement("p");s.className="small";s.textContent="J'hésite aussi avec le domaine "+res.second+" · "+DOMS[res.second][0]+".";box.appendChild(s)}
    }else{box.innerHTML='<p>Je ne trouve pas de mot-clé connu dans ta question. Choisis toi-même le domaine :</p>'}
    const fx=document.createElement("div");fx.className="fix";fx.innerHTML="<span>"+(d?"Pas d'accord ? Choisis :":"Domaine :")+"</span>";
    [1,2,3,4,5].forEach(n=>{const b=document.createElement("button");b.type="button";b.textContent=n;b.title=DOMS[n][0];b.className=DOMS[n][1];
      b.style.cssText="background:var(--b);color:var(--c)";if(n===d){b.setAttribute("aria-pressed","true");b.style.cssText="background:var(--c);color:#fff"}
      b.addEventListener("click",()=>render(q,res,n));fx.appendChild(b)});box.appendChild(fx);
    if(d){const add=document.createElement("button");add.type="button";add.className="pill main";add.textContent="Ajouter au jeu du tri";
      add.addEventListener("click",()=>{const c=(res&&res.d===d)?res.c:Object.keys(COMPS).find(k=>k[0]==String(d));
        extra.push([q,c,"Question ajoutée en classe : domaine "+d+" · "+DOMS[d][0]+"."]);
        add.textContent="Ajoutée ✓";add.disabled=true;add.style.opacity=".6";showAdded();
        if(gi<deck.length){deck.push(extra[extra.length-1]);gpos.textContent="Question "+(gi+1)+" sur "+deck.length}});
      const row=document.createElement("div");row.className="row";row.appendChild(add);box.appendChild(row)}
    askr.appendChild(box);fit(aslide)}
  askf.addEventListener("submit",e=>{e.preventDefault();const q=askq.value.trim();if(!q){askq.focus();return}render(q,classify(q))})}

  // Typo française : espace insécable avant ? ! : ; »
  const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while((n=tw.nextNode())){if(n.parentElement.closest("script,style"))continue;const t=n.nodeValue,u=t.replace(/ ([?!:;»])/g," $1").replace(/« /g,"« ");if(u!==t)n.nodeValue=u}

  if(location.hash){const el=document.querySelector(location.hash);if(el){const i=slides.indexOf(el);if(i>=0)go(i)}}
  document.getElementById("deck").setAttribute("aria-busy","false");
}

loadSections().then(initializeCourse).catch(showLoadError);

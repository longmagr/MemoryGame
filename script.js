window.addEventListener('load', () => {
  const board = document.querySelector(".game-board");
  const modal = document.getElementById('intro-modal');
  const diffButtons = document.querySelectorAll('.diff-btn');
  const countdownEl = document.getElementById('countdown');
  const snowContainer = document.querySelector('.snow');

  const allImages = [
    "https://i.postimg.cc/Jzd0PPwB/IMG20251123101952.jpg",
    "https://i.postimg.cc/dV0D2gxg/IMG20251123101531.jpg",
    "https://i.postimg.cc/DwzmrRMD/IMG20251123101601.jpg",
    "https://i.postimg.cc/SNdJzmDn/IMG20251123101438.jpg",
    "https://i.postimg.cc/jSjCHB1r/IMG20251123101713.jpg",
    "https://i.postimg.cc/Nj0L6ZnY/IMG20251123101613.jpg",
    "https://i.postimg.cc/rySdM14f/IMG20251121112938.jpg",
    "https://i.postimg.cc/CKB1tkYv/IMG20251123102134.jpg",
    "https://i.postimg.cc/9fRMSZVb/IMG20251123102116.jpg",
    "https://i.postimg.cc/FKMRQzs6/IMG20251123102224.jpg"
  ];

  let flippedCards = [];
  let matchedPairs = 0;
  let gameStarted = false;
  let countdownInterval = null;
  let selectedPairs = 6;
  let currentImageSet = [];

  function createSnowflakes(num=36){
    snowContainer.innerHTML='';
    for(let i=0;i<num;i++){
      const flake=document.createElement('div');
      flake.className='flake';
      const left=Math.random()*100;
      const size=4+Math.random()*18;
      const delay=Math.random()*6;
      const duration=6+Math.random()*10;
      const xDrift=(Math.random()-0.5)*30;
      flake.style.left=`${left}%`;
      flake.style.width=`${size}px`;
      flake.style.height=`${size}px`;
      flake.style.opacity=0.7+Math.random()*0.3;
      flake.style.animationDuration=`${duration}s`;
      flake.style.animationDelay=`${delay}s`;
      flake.style.transform=`translateX(${xDrift}px)`;
      snowContainer.appendChild(flake);
    }
  }
  createSnowflakes(36);

  function shuffle(arr){
    const a=arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  function createCards(numPairs){
    const imgs = shuffle(allImages).slice(0,numPairs);
    currentImageSet = imgs.slice();
    const cardsArray = shuffle([...imgs,...imgs]);
    board.innerHTML='';

    if(numPairs<=4) board.style.gridTemplateColumns='repeat(4,1fr)';
    else if(numPairs<=6) board.style.gridTemplateColumns='repeat(4,1fr)';
    else board.style.gridTemplateColumns='repeat(5,1fr)';

    cardsArray.forEach(img=>{
      const card=document.createElement('div');
      card.classList.add("card","flipped");
      card.dataset.img=img;
      card.innerHTML=`
        <div class="card-inner">
          <div class="card-front"></div>
          <div class="card-back" style="background-image: url('${img}')"></div>
        </div>
      `;
      board.appendChild(card);
      card.addEventListener("click", ()=>{ if(gameStarted) flipCard(card); });
    });
  }

  diffButtons.forEach(btn=>{
    btn.addEventListener('click',()=>{
      selectedPairs=parseInt(btn.dataset.pairs,10);
      modal.style.display='none';
      matchedPairs=0; flippedCards=[]; gameStarted=false;
      createCards(selectedPairs);
      startCountdown();
    });
  });

  document.getElementById("restart-btn").addEventListener("click",()=>{
    clearInterval(countdownInterval);
    countdownEl.innerHTML="";
    countdownEl.style.opacity=0;
    matchedPairs=0; flippedCards=[]; gameStarted=false;
    board.innerHTML='';
    modal.style.display='flex';
  });

function startCountdown() {
    let countdown = 5;
    countdownEl.style.opacity = 1;
    positionCountdownCenter();
    countdownEl.innerHTML = `<span class="bounce-clock">⏰</span> ${countdown}…`;

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      countdown--;
      countdownEl.innerHTML = `<span class="bounce-clock">⏰</span> ${countdown}…`;
      const clock = countdownEl.querySelector(".bounce-clock");
      if (countdown <= 3 && clock) clock.classList.add("bounce-fast");
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        countdownEl.innerHTML = "";
        countdownEl.style.opacity = 0;
        if (!gameStarted) flipAllCardsDown();
      }
    }, 1000);
  }

  function positionCountdownCenter() {
    countdownEl.style.left = "50%";
    countdownEl.style.top = "10px";
    countdownEl.style.transform = "translateX(-50%)";
  }

  function flipAllCardsDown(){ document.querySelectorAll(".card").forEach(c=>c.classList.remove("flipped")); gameStarted=true; }
  function flipCard(card){ if(card.classList.contains("flipped")||flippedCards.length===2) return; card.classList.add("flipped"); flippedCards.push(card); if(flippedCards.length===2) setTimeout(checkMatch,800); }

  function checkMatch(){
    const [card1,card2]=flippedCards;
    if(!card1||!card2){flippedCards=[];return;}
    if(card1.dataset.img===card2.dataset.img){
      matchedPairs++;
      card1.classList.add("matched"); card2.classList.add("matched");
      showZoomHeart(card1.dataset.img);
      if(matchedPairs===selectedPairs) showWinSequence();
      flippedCards=[];
    } else {
      flippedCards.forEach(c=>{ c.classList.add("shake"); setTimeout(()=>{c.classList.remove("shake"); c.classList.remove("flipped");},600); });
      flippedCards=[];
    }
  }

  function showZoomHeart(imgUrl){
    const zoomCard=document.createElement("div"); zoomCard.classList.add("zoom-center");
    const zoomImg=document.createElement("img"); zoomImg.src=imgUrl; zoomCard.appendChild(zoomImg);
    document.body.appendChild(zoomCard);
    board.style.pointerEvents='none';
    setTimeout(()=>{zoomCard.remove(); board.style.pointerEvents='auto';},3000);

    const heart=document.createElement("div"); heart.classList.add("heart"); heart.innerHTML="💖";
    document.body.appendChild(heart); setTimeout(()=>heart.remove(),1300);
  }

 function showWinSequence() {
  const matchedCards = document.querySelectorAll(".matched");
  // πρώτα ξεκινάει το win-dance
  matchedCards.forEach(c => c.classList.add("win-dance"));

  // περιμένουμε να τελειώσει το πρώτο animation της πρώτης κάρτας
  matchedCards[0].addEventListener("animationend", () => {
    matchedCards.forEach(c => {
      c.classList.remove("win-dance");
      c.style.transform = 'scale(1)';
    });

    // δείχνουμε το μήνυμα νίκης
    showWinMessage();

    // μετά από 2 δευτ, εμφανίζουμε το intro modal
    setTimeout(() => {
      matchedPairs = 0;
      flippedCards = [];
      gameStarted = false;
      board.innerHTML = '';
      modal.style.display = 'flex';
    }, 3000);

  }, { once: true });
}

function showWinMessage() {
  const msg = document.createElement("div");
  msg.textContent = " ⭐✨🏆 Μπράβο ! ";
  msg.style.position = "fixed";
  msg.style.top = "50%";
  msg.style.left = "50%";
  msg.style.transform = "translate(-50%, -50%) scale(0)";
  msg.style.fontSize = "2rem";
  msg.style.fontWeight = "bold";
  msg.style.color = "#e91e63";
  msg.style.zIndex = 15000;
  msg.style.textAlign = "center";
  msg.style.transition = "transform 0.5s ease, opacity 0.5s ease";
  document.body.appendChild(msg);

  // μικρό delay για να παίξει η scale animation
  setTimeout(() => {
    msg.style.transform = "translate(-50%, -50%) scale(1.3)";
    msg.style.opacity = "1";
  }, 50);

  // σβήσιμο μετά από 2 δευτερόλεπτα
  setTimeout(() => {
    msg.style.transform = "translate(-50%, -50%) scale(0)";
    msg.style.opacity = "0";
    setTimeout(() => msg.remove(), 500);
  }, 2000);
}


  modal.style.display='flex';
});

// Social modal - single clean module
(function() {
  const heartBtn = document.getElementById("social-heart");
  const socialModal = document.getElementById("social-card-modal");
  const socialCard = document.querySelector(".social-card");
  const closeBtn = document.getElementById("close-social");
  const linksContainer = document.getElementById("social-links-container");

  // Εδώ προσθέτεις/αφαιρείς links με απλό τρόπο.
  // Μπορείς να αλλάξεις icon (url ή emoji), name, url.
  const socialLinks = [ 
     { name: "longmagr", icon: "https://i.postimg.cc/7hS7wS3S/f2.png", url: "https://facebook.com/LongMagr",color: "blue", weight: "bold",column: "left"},
    { name: "@longmagr", icon: "https://i.postimg.cc/x8LHnLvv/in1.png", url: "https://instagram.com/longmagr",color: "black", weight: "bold",column: "right" },
   { name: "@longmagr", icon: "https://i.postimg.cc/m2XdqsrZ/tiki.png", url: "https://www.tiktok.com/@longmagr",color: "black",column: "left"},
   { name: "Taplink", icon: "🌍", url: "https://taplink.cc/longma",color: "blue", weight: "bold",column: "right"},
      {name:"Μαχάωνος 4, Καλαμάτα",color: "black", icon: "🏠" , font: "Comic Sans MS",url: "https://www.google.com/maps/place//@37.0410012,22.1168228,20.5z?entry=ttu&g_ep=EgoyMDI1MTIwMi4wIKXMDSoASAFQAw%3D%3D",}
  ];

  // Δημιουργία DOM items
  function renderLinks() {
    linksContainer.innerHTML = "";
    socialLinks.forEach(link => {
      const item = document.createElement("div");
      item.className = "social-item";
item.style.gridColumn = link.column === "right" ? "2" : "1";

      // Αν icon είναι URL τότε βάζουμε <img>, αλλιώς κείμενο (π.χ. emoji)
      let iconEl;
      if (link.icon && (link.icon.startsWith("http://") || link.icon.startsWith("https://"))) {
        iconEl = document.createElement("img");
        iconEl.className = "social-icon";
        iconEl.src = link.icon;
        iconEl.alt = link.name;
      } else {
        iconEl = document.createElement("span");
        iconEl.className = "social-icon";
        iconEl.textContent = link.icon || "";
      }

      const text = document.createElement(link.url && link.url !== "#" ? "a" : "span");
      text.className = "social-text";
      if (link.url && link.url !== "#") {
        text.href = link.url;
        text.target = "_blank";
        text.rel = "noopener noreferrer";
      text.style.color = link.color || "";
text.style.fontWeight = link.weight || "";
}
      text.textContent = link.name;

      item.appendChild(iconEl);
      item.appendChild(text);
      linksContainer.appendChild(item);
   item.style.justifyContent =
  link.align === "right" ? "flex-end" :
  link.align === "center" ? "center" :
  "flex-start";
 item.style.gridColumn = link.column === "right" ? "2" : "1";
});
  }

  // Άνοιγμα modal (φιλικό animation)
  function openCard() {
    socialModal.style.display = "flex";
    // μικρό delay για να παίξει transition
    setTimeout(() => socialCard.classList.add("show"), 50);
    socialModal.setAttribute("aria-hidden", "false");
    // focus management
    closeBtn.focus();
  }

  // Κλείσιμο modal
  function closeCard() {
    socialCard.classList.remove("show");
    socialModal.setAttribute("aria-hidden", "true");
    setTimeout(() => { socialModal.style.display = "none"; }, 600);
    heartBtn.focus();
  }

  // Events
  heartBtn.addEventListener("click", openCard);
  closeBtn.addEventListener("click", closeCard);

  socialModal.addEventListener("click", (e) => {
    if (e.target === socialModal) closeCard();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && socialModal.style.display === "flex") closeCard();
  });

  // initial render
  renderLinks();
})();

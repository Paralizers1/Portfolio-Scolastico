(function(){
function handleHashSelection() {
  const hash = window.location.hash.substring(1); 
  let foundMatch = false;


  const labels = document.querySelectorAll('label[for^="tab"]');
  

  if (hash) {
    for (const label of labels) {
      if (label.innerText.toLowerCase().trim() === hash) {
        const tabElement = document.getElementById(label.getAttribute('for'));
        
        if (tabElement) {
          tabElement.click();
          if (tabElement.type === 'radio' || tabElement.type === 'checkbox') {
            tabElement.checked = true;
          }
          tabElement.scrollIntoView({ behavior: 'smooth' });
          foundMatch = true;
          break;
        }
      }
    }
  }

  // Se non ha trovato corrispondenze e ci sono elementi, clicca il primo
  if (!foundMatch && labels.length > 0) {
    const firstTabElement = document.getElementById(labels[0].getAttribute('for'));
    if (firstTabElement) {
      firstTabElement.click();
      if (firstTabElement.type === 'radio' || firstTabElement.type === 'checkbox') {
        firstTabElement.checked = true;
      }
      firstTabElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}


document.addEventListener('DOMContentLoaded', handleHashSelection);
window.addEventListener('popstate', handleHashSelection);

document.addEventListener('DOMContentLoaded',function(){
const elementi = document.querySelectorAll('.cerchio-bordo');
const durata = 3000; // Durata totale animazione in ms
const stepTime = 10; // Intervallo tra frame in ms

// Funzione per animare un cerchio
function animaCerchio(el) {
  // Resetta lo stato precedente (se c'era un'animazione in corso)
  if (el.intervalId) {
    clearInterval(el.intervalId);
  }

  const stili = getComputedStyle(el);
  const finale = parseInt(stili.getPropertyValue("--finale").trim());
  let progress = 0;
  const steps = durata / stepTime;
  const incremento = finale / steps;

  el.intervalId = setInterval(() => {
    progress += incremento;
    el.style.setProperty('--percentuale', `${progress.toFixed(2)}%`);

    if (progress >= finale) {
      clearInterval(el.intervalId);
      el.dataset.animato = "true"; // Marca come completato
    }
  }, stepTime);
}

// Configurazione dell'IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;

    // Se l'elemento è entrato nel viewport e non è già stato animato
    if (entry.isIntersecting) {
      if (!el.dataset.animato || el.dataset.animato === "false") {
        animaCerchio(el);
      }
    } else {
      // Quando esce dal viewport, resetta per permettere una nuova animazione
      el.dataset.animato = "false";
    }
  });
}, {
  threshold: 0.1 // Attiva quando almeno il 10% dell'elemento è visibile
});

// Inizializza l'observer per ogni cerchio
elementi.forEach(el => {
  el.style.setProperty('--percentuale', '0%'); // Resetta grafica iniziale
  observer.observe(el);
});


const slideContainer = document.querySelector(".slide");
const slider = document.querySelector(".slider");
const sections = slider.querySelectorAll("section");
const tabs = document.querySelectorAll('input[name="tab"]');

let currentIndex = 0; // Memorizza l'indice corrente

function getTrueHeight(section) {
  const clone = section.cloneNode(true);
  
  clone.style.position = 'absolute';
  clone.style.visibility = 'hidden';
  clone.style.display = 'block';
  clone.style.transform = 'none';
  clone.style.opacity = '1';
  clone.style.height = 'auto';
  
  document.body.appendChild(clone);
  const height = clone.scrollHeight;
  document.body.removeChild(clone);
  
  return height;
}

function updateHeight(index) {
  currentIndex = index; // Aggiorna l'indice corrente
  const height = getTrueHeight(sections[index]);
  slideContainer.style.height = `${height}px`;
}

// Inizializza l'altezza al caricamento e quando cambia tab
window.addEventListener('load', () => updateHeight(0));

tabs.forEach((tab, index) => {
  tab.addEventListener('change', () => {
    if (tab.checked) {
      const label = document.querySelector(`label[for="${tab.id}"]`);
      if (label?.innerText) {
        location.hash = label.innerText.toLowerCase();
      }
      setTimeout(() => updateHeight(index), 200);
    }
  });
});

// Osserva il ridimensionamento della finestra e ricalcola l'altezza
const resizeObserver = new ResizeObserver(() => {
  updateHeight(currentIndex); // Ricalcola in base all'indice corrente
});

// Osserva il contenitore principale per cambi di dimensioni
resizeObserver.observe(slideContainer);

// (Opzionale) Osserva anche il corpo della pagina per sicurezza
resizeObserver.observe(document.body);
},true)})();
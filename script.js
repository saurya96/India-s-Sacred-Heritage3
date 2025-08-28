AOS.init();

const temples = [
  { name: "Brihadeeswarar Temple", img: "brihadeeswarar.jpg", era: "Chola", desc: "A UNESCO site in Tamil Nadu." },
  { name: "Sanchi Stupa", img: "sanchi.jpg", era: "Maurya", desc: "Oldest stone structure in India." },
  { name: "Khajuraho", img: "khajuraho.jpg", era: "Chandela", desc: "Famous for nagara-style architecture." }
];

// Night Mode Toggle
function toggleNightMode() {
  document.body.classList.toggle("night-mode");
}



 function scrollToExplore() {
    const exploreSection = document.getElementById("gallerySection"); // section ka ID
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: "smooth" });
    }
  }

// Sidebar Toggle
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.style.width = (sidebar.style.width === "250px") ? "0" : "250px";
}

// Close sidebar when clicking a sidebar link
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#sidebar a").forEach(link => {
    link.addEventListener("click", () => {
      toggleSidebar();
    });
  });
});

// Fetch temples and monuments in India using Wikipedia API
const topics = [
  "Temples and Monuments in India",
  "Famous Indian Forts",
  "Ancient Indian Architecture"
];

const templeCardsContainer = document.getElementById("templeCards");

topics.forEach((topic) => {
  fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(topic)}`)
    .then((response) => response.json())
    .then((data) => {
      const results = data.query.search;
      results.forEach((item) => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
          <div class="card shadow h-100">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text">${item.snippet}...</p>
              <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}" target="_blank" class="btn btn-primary">Read more</a>
            </div>
          </div>
        `;
        card.querySelector(".card").style.backgroundColor = "#CAFFBF";
        templeCardsContainer.appendChild(card);
      });
    })
    .catch((error) => {
      console.error(`Error fetching data for topic "${topic}":`, error);
    });
});

const timelineData = {
  maurya: [
    {
      name: "Sanchi Stupa",
      // image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Sanchi_Stupa_2007_k1.jpg",
      year: "3rd century BCE",
      description: "Commissioned by Emperor Ashoka, oldest Buddhist stupa including stone gateways."
    },
    {
      name: "Barabar Caves",
      //  image: "https://upload.wikimedia.org/wikipedia/commons/1/10/Lomas_Rishi_Cave_-_Barabar_Hills.jpg",
      year: "3rd century BCE",
      description: "Earliest surviving rock-cut caves with Ashokan inscriptions in Bihar."
    }
  ],
  gupta: [
    {
      name: "Dashavatara Temple",
      // image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Dashavatara_Temple_Deogarh.jpg",
      year: "5th century CE",
      description: "One of India’s earliest Hindu stone temples, Vishnu carvings."
    },
    {
      name: "Ajanta Caves (paintings)",
      //  image: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Ajanta_Cave_1.jpg",
      year: "5th century CE",
      description: "Famous murals and cave shrines flourished under Gupta rule."
    }
  ],
  chola: [
    {
      name: "Brihadeeswarar Temple",
      //  image: "https://upload.wikimedia.org/wikipedia/commons/4/40/Thanjavur_Brihadeeswarar_Temple.jpg",
      year: "1010 CE",
      description: "Built by Raja Raja Chola I, iconic Dravidian architecture."
    },
    {
      name: "Airavatesvara Temple",
      // image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Airavatesvara_Temple_Darasuram.jpg",
      year: "12th century CE",
      description: "Stone-chariot shrine, part of Great Living Chola Temples."
    }
  ],
  mughal: [
    {
      name: "Taj Mahal",
      //  image: "https://upload.wikimedia.org/wikipedia/commons/d/da/Taj-Mahal.jpg",
      year: "1632 CE",
      description: "White marble mausoleum built by Shah Jahan, icon of Mughal art."
    },
    {
      name: "Red Fort",
      // image: "https://upload.wikimedia.org/wikipedia/commons/1/10/Red_Fort.jpg",
      year: "1639 CE",
      description: "Built by Shah Jahan in Delhi, main residence of Mughal emperors."
    }
  ]
};

document.querySelectorAll(".period-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const period = btn.getAttribute("data-period");
    const monuments = timelineData[period] || [];
    const container = document.getElementById("timelineContent");
    container.innerHTML = monuments.map(m => `
      <div class="card mb-3 shadow-sm">
        
        <div class="card-body">
          <h5 class="card-title">${m.name}</h5>
          <h6 class="text-muted">${m.year}</h6>
          <p class="card-text">${m.description}</p>
        </div>
      </div>`).join("");
    container.scrollIntoView({ behavior: "smooth" });
  });
});

// Initialize Leaflet Map
const map = L.map('leafletMap').setView([20.5937, 78.9629], 5);
const indiaBounds = L.latLngBounds([6.5546, 68.1114], [35.6745, 97.3956]);
map.setMaxBounds(indiaBounds.pad(0.1));
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const geocoder = L.Control.Geocoder.nominatim();
const resultsLayer = L.layerGroup().addTo(map);

function showResult(result) {
  resultsLayer.clearLayers();
  const latlng = result.center;
  L.marker(latlng)
    .addTo(resultsLayer)
    .bindPopup(`<b>${result.name || 'Result'}</b>`)
    .openPopup();
  map.setView(latlng, 12, { animate: true });
}

function searchIndia(query) {
  const q = (query || '').trim();
  if (!q) return;
  geocoder.geocode(q, (results) => {
    if (!results || results.length === 0) {
      alert('No results found. Try another name (e.g., "Konark Sun Temple").');
      return;
    }
    const inIndia = results.filter(r => indiaBounds.contains(r.center));
    const chosen = inIndia[0] || results[0];
    showResult(chosen);
  });
}

document.getElementById('searchBtn').addEventListener('click', () => searchIndia(document.getElementById('searchInput').value));
document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchIndia(e.target.value);
});

[
  { name: "Taj Mahal", coords: [27.1751, 78.0421], desc: "Mughal mausoleum in Agra (UNESCO)." },
  { name: "Brihadeeswarar Temple", coords: [10.7828, 79.1316], desc: "Chola dynasty, Thanjavur (UNESCO)." },
  { name: "Sanchi Stupa", coords: [23.4793, 77.7395], desc: "Buddhist monument, Madhya Pradesh (UNESCO)." }
].forEach(s => {
  L.marker(s.coords).addTo(map).bindPopup(`<b>${s.name}</b><br>${s.desc}`);
});

// Gallery "See More"
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("seeMoreBtn");
  const extraImages = document.querySelectorAll(".extra-image");

  btn.addEventListener("click", () => {
    const isHidden = extraImages[0].classList.contains("hidden");
    extraImages.forEach(img => {
      img.classList.toggle("hidden", !isHidden);
    });
    btn.innerText = isHidden ? "See Less..." : "See More...";
  });
});


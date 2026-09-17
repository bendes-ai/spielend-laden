// Spielend laden – MVP Frontend (Demo-Daten)
// Lädt Ladepunkte + POIs, berechnet Luftliniendistanzen client-seitig (Haversine)
// und zeigt Kombinationen im wählbaren Radius auf einer Leaflet-Karte.

const CATEGORY_LABELS = {
  Spielplatz: "🛷 Spielplatz",
  Biergarten: "🍺 Biergarten",
  Restaurant: "🍽️ Restaurant",
  Cafe: "☕ Café",
  Einkauf: "🛒 Einkaufen",
  WC: "🚹 WC",
  Park: "🌳 Park",
  Freizeit: "🎡 Freizeit"
};

const map = L.map("map").setView([49.62, 10.95], 11);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap-Mitwirkende",
  maxZoom: 19
}).addTo(map);

const stationLayer = L.layerGroup().addTo(map);
const poiLayer = L.layerGroup().addTo(map);
const radiusLayer = L.layerGroup().addTo(map);

let stations = [];
let pois = [];
let activeCategories = new Set(Object.keys(CATEGORY_LABELS));
let radiusM = 500;
let onlyMatches = true;

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function computeMatches(station) {
  return pois
    .filter((p) => activeCategories.has(p.category))
    .map((p) => ({
      poi: p,
      distance: haversine(station.latitude, station.longitude, p.latitude, p.longitude)
    }))
    .filter((m) => m.distance <= radiusM)
    .sort((a, b) => a.distance - b.distance);
}

function chargingIcon() {
  return L.divIcon({
    className: "",
    html: '<div style="background:#0b6e4f;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 0 3px rgba(0,0,0,0.5);">⚡</div>',
    iconSize: [28, 28]
  });
}

function poiIcon(category) {
  const emoji = (CATEGORY_LABELS[category] || "").split(" ")[0] || "📍";
  return L.divIcon({
    className: "",
    html: `<div style="background:#fff;border:2px solid #0b6e4f;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:12px;">${emoji}</div>`,
    iconSize: [22, 22]
  });
}

function renderCategoryFilters() {
  const container = document.getElementById("categoryFilters");
  container.innerHTML = "";
  Object.entries(CATEGORY_LABELS).forEach(([key, label]) => {
    const id = `cat-${key}`;
    const wrapper = document.createElement("label");
    wrapper.innerHTML = `<input type="checkbox" id="${id}" checked> ${label}`;
    container.appendChild(wrapper);
    wrapper.querySelector("input").addEventListener("change", (e) => {
      if (e.target.checked) activeCategories.add(key);
      else activeCategories.delete(key);
      render();
    });
  });
}

function renderStationList(matchesByStation) {
  const listEl = document.getElementById("stationList");
  listEl.innerHTML = "";
  stations
    .filter((s) => !onlyMatches || matchesByStation.get(s.charging_station_id).length > 0)
    .forEach((s) => {
      const matches = matchesByStation.get(s.charging_station_id);
      const counts = {};
      matches.forEach((m) => {
        counts[m.poi.category] = (counts[m.poi.category] || 0) + 1;
      });
      const card = document.createElement("div");
      card.className = "station-card";
      card.innerHTML = `
        <h3>${s.name}</h3>
        <div class="meta">${s.address || ""}, ${s.postcode || ""} ${s.town || ""}<br>
          ${s.operator || "Betreiber unbekannt"} · ${s.max_power_kw ?? "?"} kW · ${s.num_connections ?? "?"} Anschlüsse</div>
        <div class="badges">
          ${Object.entries(counts)
            .map(([cat, n]) => `<span class="badge">${CATEGORY_LABELS[cat] || cat}: ${n}</span>`)
            .join("") || '<span class="badge">Keine POIs im Radius</span>'}
        </div>`;
      card.addEventListener("click", () => {
        map.setView([s.latitude, s.longitude], 16);
      });
      listEl.appendChild(card);
    });
}

function render() {
  stationLayer.clearLayers();
  poiLayer.clearLayers();
  radiusLayer.clearLayers();

  const matchesByStation = new Map();

  stations.forEach((s) => {
    const matches = computeMatches(s);
    matchesByStation.set(s.charging_station_id, matches);

    if (onlyMatches && matches.length === 0) return;

    const marker = L.marker([s.latitude, s.longitude], { icon: chargingIcon() }).addTo(stationLayer);
    marker.bindPopup(
      `<strong>${s.name}</strong><br>${s.address || ""}, ${s.town || ""}<br>` +
      `${s.max_power_kw ?? "?"} kW · ${s.connector_types || ""}<br>` +
      `<em>${matches.length} POIs im ${radiusM} m Radius</em>`
    );

    L.circle([s.latitude, s.longitude], {
      radius: radiusM,
      color: "#0b6e4f",
      weight: 1,
      fillOpacity: 0.05
    }).addTo(radiusLayer);

    matches.forEach((m) => {
      const p = m.poi;
      const pm = L.marker([p.latitude, p.longitude], { icon: poiIcon(p.category) }).addTo(poiLayer);
      pm.bindPopup(`<strong>${p.name}</strong><br>${CATEGORY_LABELS[p.category] || p.category}<br>${Math.round(m.distance)} m entfernt`);
    });
  });

  renderStationList(matchesByStation);
}

async function init() {
  const [csRes, poiRes] = await Promise.all([
    fetch("data/charging_stations.json"),
    fetch("data/pois.json")
  ]);
  stations = await csRes.json();
  pois = await poiRes.json();

  renderCategoryFilters();

  const radiusInput = document.getElementById("radius");
  const radiusValue = document.getElementById("radiusValue");
  radiusInput.addEventListener("input", (e) => {
    radiusM = Number(e.target.value);
    radiusValue.textContent = radiusM;
    render();
  });

  document.getElementById("onlyMatches").addEventListener("change", (e) => {
    onlyMatches = e.target.checked;
    render();
  });

  render();
}

init();

import { visualizations, type Visualization } from "./catalog";

function createVisualizationCard(
  visualization: Visualization,
  index: number,
): HTMLAnchorElement {
  const card = document.createElement("a");
  card.className = "visualization-card";
  card.href = visualization.url;
  card.dataset.visualizationId = visualization.id;
  card.style.setProperty("--card-accent", visualization.accent);

  const preview = document.createElement("div");
  preview.className = "card-preview";

  const image = document.createElement("img");
  image.src = visualization.preview;
  image.alt = "";
  image.width = 960;
  image.height = 540;
  image.decoding = "async";
  image.loading = index < 2 ? "eager" : "lazy";
  if (index < 2) image.fetchPriority = "high";
  preview.append(image);

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h2");
  title.textContent = visualization.title;

  const description = document.createElement("p");
  description.textContent = visualization.description;

  const cta = document.createElement("span");
  cta.className = "card-cta";
  cta.innerHTML = `
    <span>Open visualization</span>
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 5l5 5-5 5" />
    </svg>
  `;

  body.append(title, description, cta);
  card.append(preview, body);
  return card;
}

function setupAboutDisclosure(): void {
  const toggle = document.querySelector<HTMLButtonElement>("#about-toggle");
  const panel = document.querySelector<HTMLElement>("#about-panel");
  const disclosure = document.querySelector<HTMLElement>(".about-disclosure");
  if (!toggle || !panel || !disclosure) {
    throw new Error("About disclosure was not rendered.");
  }

  const setExpanded = (expanded: boolean): void => {
    toggle.setAttribute("aria-expanded", String(expanded));
    panel.hidden = !expanded;
  };

  toggle.addEventListener("click", () => {
    setExpanded(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("click", (event) => {
    if (event.target instanceof Node && !disclosure.contains(event.target)) {
      setExpanded(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setExpanded(false);
      toggle.focus();
    }
  });
}

export function renderApp(): void {
  const root = document.querySelector<HTMLDivElement>("#app");
  if (!root) throw new Error("Missing #app mount point.");

  root.innerHTML = `
    <div class="site-background" aria-hidden="true"></div>
    <header class="site-header">
      <a class="brand" href="#top" aria-label="Scientific Visualizations home">
        <img src="./rayleighlord-logo.png" alt="" width="42" height="42" />
        <span class="brand-copy">
          <strong>Scientific Visualizations</strong>
          <span>Interactive explorations</span>
        </span>
      </a>
    </header>

    <main id="top">
      <section class="academic-intro" aria-labelledby="page-title">
        <h1 id="page-title">Scientific Visualizations</h1>
      </section>

      <section class="collection" aria-label="Interactive scientific visualizations">
        <div id="visualization-grid" class="visualization-grid" tabindex="-1"></div>
      </section>
    </main>

    <footer class="site-footer">
      <a class="footer-brand" href="#top" aria-label="Scientific Visualizations home">
        <img src="./rayleighlord-logo.png" alt="" width="32" height="32" />
        <span>Scientific Visualizations</span>
      </a>
      <div class="about-disclosure">
        <button
          id="about-toggle"
          class="about-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="about-panel"
        >
          About
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </button>
        <p id="about-panel" class="about-panel" hidden>
          These resources were developed by
          <a href="https://github.com/rayleighlord">Javier González Monge</a>.
        </p>
      </div>
      <a class="back-to-top" href="#top">Return to top <span aria-hidden="true">↑</span></a>
    </footer>
  `;

  const grid = document.querySelector<HTMLDivElement>("#visualization-grid");
  if (!grid) throw new Error("Visualization grid was not rendered.");
  visualizations.forEach((visualization, index) =>
    grid.append(createVisualizationCard(visualization, index)),
  );

  setupAboutDisclosure();
}

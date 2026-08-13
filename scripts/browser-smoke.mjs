import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const expectedVisualizations = [
  ["hydrogen-atom", "https://rayleighlord.github.io/HydrogenAtomSpectrum/"],
  ["harmonic-oscillator", "https://rayleighlord.github.io/HarmonicOscillator/"],
  ["double-slit", "https://rayleighlord.github.io/DoubleSlit/"],
  ["square-membrane-modes", "https://rayleighlord.github.io/SquarePlateModes/"],
  ["circular-membrane-modes", "https://rayleighlord.github.io/CircularMembraneModes/"],
  ["oscillating-membranes", "https://rayleighlord.github.io/OscillatingMembranes/"],
  ["acoustic-duct-modes", "https://rayleighlord.github.io/AcousticDuctModes/"],
  ["heat-equation", "https://rayleighlord.github.io/HeatEquation/"],
  ["2d-ising-model", "https://rayleighlord.github.io/2DIsingModel/"],
  ["earth-geoid", "https://rayleighlord.github.io/EarthGeoidRepresentation/"],
  ["oscillators", "https://rayleighlord.github.io/Oscillators/"],
  ["image-compression-svd", "https://rayleighlord.github.io/ImageCompressionSVD/"],
];

const host = "127.0.0.1";
const port = Number(process.env.BROWSER_SMOKE_PORT ?? 30_000 + (process.pid % 20_000));
const repositoryPath = "/ScientificVisualizations/";
const baseUrl = `http://${host}:${port}${repositoryPath}`;
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const artifactDir = new URL("../output/playwright/", import.meta.url);
const viteBin = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));
const requestedChromePath = process.env.CHROME_PATH;
const systemChromePath = "/usr/bin/google-chrome";
const executablePath = requestedChromePath ??
  (existsSync(systemChromePath) ? systemChromePath : undefined);

await mkdir(artifactDir, { recursive: true });

const preview = spawn(
  process.execPath,
  [viteBin, "preview", "--base", repositoryPath, "--host", host, "--port", `${port}`, "--strictPort"],
  { cwd: projectRoot, stdio: ["ignore", "inherit", "inherit"] },
);

let browser;

try {
  await waitForServer(baseUrl, preview);
  browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const browserErrors = [];
  const requestErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("requestfailed", (request) => {
    requestErrors.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      requestErrors.push(`${response.status()} ${response.request().method()} ${response.url()}`);
    }
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await assertCatalogAndAssets(page);
  await assertAcademicStructure(page);
  await assertAboutDisclosure(page);
  await assertResponsiveGrid(page);
  await assertReducedMotion(page);

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.screenshot({
    path: fileURLToPath(new URL("browser-smoke.png", artifactDir)),
    fullPage: true,
  });

  assert.deepEqual(browserErrors, [], `Browser errors:\n${browserErrors.join("\n")}`);
  assert.deepEqual(requestErrors, [], `Request errors:\n${requestErrors.join("\n")}`);
  await context.close();
  console.log("Browser smoke checks passed.");
} finally {
  await browser?.close();
  preview.kill("SIGTERM");
  await waitForExit(preview);
}

async function assertCatalogAndAssets(page) {
  assert.match(await page.title(), /scientific visualizations/i);
  assert.equal(await page.locator("#theme-toggle").count(), 0);

  const cards = page.locator(
    "#visualization-grid a.visualization-card[data-visualization-id]",
  );
  assert.equal(await cards.count(), expectedVisualizations.length);
  assert.deepEqual(
    await cards.evaluateAll((nodes) => nodes.map((node) => node.dataset.visualizationId)),
    expectedVisualizations.map(([id]) => id),
  );

  let totalPreviewBytes = 0;
  for (const [index, [id, url]] of expectedVisualizations.entries()) {
    const card = cards.nth(index);
    assert.equal(await card.getAttribute("href"), url);
    assert.equal(await card.getAttribute("target"), null);

    const image = card.locator("img");
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((node) => {
      if (node.complete && node.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve, reject) => {
        node.addEventListener("load", resolve, { once: true });
        node.addEventListener("error", reject, { once: true });
      });
    });
    const details = await image.evaluate((node) => ({
      complete: node.complete,
      naturalWidth: node.naturalWidth,
      naturalHeight: node.naturalHeight,
      alt: node.getAttribute("alt"),
      source: node.currentSrc || node.src,
    }));
    assert.equal(details.complete, true);
    assert.equal(details.naturalWidth, 960);
    assert.equal(details.naturalHeight, 540);
    assert.equal(details.alt, "");
    assert.match(new URL(details.source).pathname, new RegExp(`/previews/${id}\\.webp$`));

    totalPreviewBytes += await page.evaluate(async (source) => {
      const response = await fetch(source);
      return (await response.arrayBuffer()).byteLength;
    }, details.source);
  }
  assert.ok(totalPreviewBytes < 1_200_000, `Preview payload is too large: ${totalPreviewBytes} bytes.`);
}

async function assertAcademicStructure(page) {
  assert.equal(await page.locator("h1").innerText(), "Scientific Visualizations");
  assert.equal(await page.locator(".eyebrow").count(), 0);
  assert.equal(await page.locator(".visualization-card h2").count(), expectedVisualizations.length);
  assert.equal(await page.locator(".card-meta, .card-formula").count(), 0);
  assert.equal(
    (await page.locator(".about-panel").innerText()).replace(/\s+/g, " ").trim(),
    "These resources were developed by Javier González Monge.",
  );
  assert.equal(await page.locator('meta[name="color-scheme"]').getAttribute("content"), "light");

  for (const selector of [".brand img", ".footer-brand img"]) {
    const logo = page.locator(selector);
    const details = await logo.evaluate((node) => ({
      complete: node.complete,
      naturalWidth: node.naturalWidth,
      naturalHeight: node.naturalHeight,
      source: node.currentSrc || node.src,
    }));
    assert.equal(details.complete, true);
    assert.equal(details.naturalWidth, 256);
    assert.equal(details.naturalHeight, 256);
    assert.match(new URL(details.source).pathname, /\/rayleighlord-logo\.png$/);
  }
}

async function assertAboutDisclosure(page) {
  const toggle = page.locator("#about-toggle");
  const panel = page.locator("#about-panel");
  assert.equal(await panel.isHidden(), true);
  await toggle.click();
  assert.equal(await toggle.getAttribute("aria-expanded"), "true");
  assert.equal(await panel.isVisible(), true);
  await page.keyboard.press("Escape");
  assert.equal(await panel.isHidden(), true);
  assert.equal(await toggle.evaluate((node) => node === document.activeElement), true);

  for (const width of [900, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await toggle.click();
    const box = await panel.boundingBox();
    assert.ok(box, `About panel must be measurable at ${width}px.`);
    assert.ok(box.x >= 0, `About panel leaves the left edge at ${width}px.`);
    assert.ok(box.x + box.width <= width, `About panel leaves the right edge at ${width}px.`);
    await page.keyboard.press("Escape");
  }
}

async function assertResponsiveGrid(page) {
  const viewports = [[1440, 3], [1320, 3], [1021, 3], [1020, 2], [900, 2], [700, 1], [320, 1]];

  for (const [width, expectedColumns] of viewports) {
    await page.setViewportSize({ width, height: 900 });
    const columns = await page.locator(".visualization-grid").evaluate((node) =>
      getComputedStyle(node).gridTemplateColumns.trim().split(/\s+/).length,
    );
    assert.equal(columns, expectedColumns, `${width}px viewport has the wrong column count.`);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    assert.ok(overflow <= 0, `${width}px viewport overflows horizontally by ${overflow}px.`);
  }
}

async function assertReducedMotion(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const transition = await page
    .locator(".visualization-card")
    .first()
    .evaluate((node) => getComputedStyle(node).transitionDuration);
  assert.equal(transition, "0s");
}

async function waitForServer(url, child) {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Preview server exited with code ${child.exitCode}.`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for ${url}.`);
}

async function waitForExit(child) {
  if (child.exitCode !== null) return;
  await new Promise((resolve) => child.once("exit", resolve));
}

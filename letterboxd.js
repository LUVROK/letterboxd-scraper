const fs = require("fs");
const fetch = require("node-fetch");
const { parse } = require("node-html-parser");
const axios = require("axios");

const OUTPUT_FILE = "result.json";

if (process.argv.length < 3) {
  console.error("Error: Please provide a username.");
  process.exit(1);
}

class MessageQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.queue.length) {
      const { titlePush, messages } = this.queue.shift();

      try {
        let jsonData = [];
        try {
          const data = await fs.readFileSync(titlePush, "utf8");
          jsonData = JSON.parse(data);
        } catch (readError) {
          if (readError.code !== "ENOENT") {
            throw readError;
          }
        }

        jsonData = jsonData.concat(messages);
        await fs.writeFileSync(titlePush, JSON.stringify(jsonData));
      } catch (err) {
        console.error("Error processing message:", err);
      }
    }

    this.isProcessing = false;
  }

  pushMessage(titlePush, messages) {
    this.queue.push({ titlePush, messages });
    this.processQueue();
  }
}

async function pushMessage(titlePush, messages) {
  const messageQueue = new MessageQueue();
  messageQueue.pushMessage(titlePush, messages);
}

const USERNAME = process.argv[2];
const URL = `https://letterboxd.com/${USERNAME}/films/page/`;

async function getRenderedPage(url) {
  const rendertronUrl = "http://167.99.72.39:8860/render"; // Замените на URL вашего экземпляра Rendertron
  const targetUrl = encodeURIComponent(url);

  try {
    const response = await axios.get(`${rendertronUrl}/${targetUrl}`);
    return response.data; // Возвращает отрендеренный HTML
  } catch (error) {
    console.error("Ошибка при запросе к Rendertron:", error);
    return null;
  }
}

async function fetchPage(pageNumber) {
  // const response = await fetch(URL + `${pageNumber}/`);
  // const text = await response.text();
  // console.log(text);

  //http://167.99.72.39:8860

  // const response = await axios.get(URL + `${pageNumber}/`);
  // const text = response.data;

  const text = await getRenderedPage(URL + `${pageNumber}/`);
  // console.log(text);

  return parse(text);
}

async function getTotalPages(root) {
  const pagination = root.querySelector(".paginate-pages");
  if (!pagination) return 1;

  const lastPageLink = pagination.querySelectorAll("li a").pop();
  return lastPageLink ? parseInt(lastPageLink.innerText.trim(), 10) : 1;
}

async function scrapeFilms() {
  const root = await fetchPage(1);
  const totalPages = await getTotalPages(root);
  const films = [];

  for (let i = 1; i <= totalPages; i++) {
    const pageRoot = await fetchPage(i);

    console.log("page -- " + i);

    const filmEntries = pageRoot.querySelectorAll(".poster-container");

    filmEntries.forEach((entry) => {
      const $metadata = entry.querySelector("div");

      const filmTitle = $metadata.getAttribute("data-film-name");
      let year = $metadata.getAttribute("data-film-release-year");

      if (year) year = Number(year);

      let element = entry.querySelector("span.rating.-tiny.-darker");

      let rating = null;
      if (element) {
        let className = element.classNames;

        let matches = className.match(/rated-(\d+)/);
        rating = matches ? Number((Number(matches[1]) / 2).toFixed(1)) : null;
      }

      console.log({ filmTitle, year, rating });

      films.push({ filmTitle, year, rating });
    });
  }

  return films;
}

scrapeFilms()
  .then((films) => {
    const updated_at = new Date().toISOString().split("T")[0];
    const outputData = {
      updated_at,
      count: films.length,
      films,
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2));

    console.log(`Total films: ${films.length}`);
  })
  .catch((error) => {
    // console.error("Error scraping films:", error);
  });

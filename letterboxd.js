const fs = require("fs");
const fetch = require("node-fetch");
const { parse } = require("node-html-parser");
const axios = require("axios");
require("dotenv").config();

const OUTPUT_FILE = "result.json";

let USERNAME = process.argv[2] || "";
let URL = `https://letterboxd.com/${USERNAME}/films/page/`;

async function getRenderedPage(url) {
  const rendertronUrl = `http://${process.env.URL_RENDERTRON}/render`;
  const targetUrl = encodeURIComponent(url);

  try {
    const response = await axios.get(`${rendertronUrl}/${targetUrl}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при запросе к Rendertron:", error);
    return null;
  }
}

async function fetchPage(pageNumber) {
  URL = `https://letterboxd.com/${USERNAME}/films/page/`;
  console.log(URL + `${pageNumber}/`);
  const text = await getRenderedPage(URL + `${pageNumber}/`);
  return parse(text);
}

async function getTotalPages(root) {
  const pagination = root.querySelector(".paginate-pages");
  if (!pagination) return 1;

  const lastPageLink = pagination.querySelectorAll("li a").pop();
  return lastPageLink ? parseInt(lastPageLink.innerText.trim(), 10) : 1;
}

async function scrapeFilms(_USERNAME) {
  if (_USERNAME) USERNAME = _USERNAME;

  const root = await fetchPage(1),
    totalPages = await getTotalPages(root),
    films = [];

  for (let i = 1; i <= totalPages; i++) {
    const pageRoot = await fetchPage(i),
      filmEntries = pageRoot.querySelectorAll(".poster-container");

    filmEntries.forEach((entry) => {
      const $metadata = entry.querySelector("div"),
        filmTitle = $metadata.getAttribute("data-film-name");

      let year = $metadata.getAttribute("data-film-release-year"),
        element = entry.querySelector("span.rating.-tiny.-darker"),
        rating = null;

      if (year) year = Number(year);
      if (element) {
        let className = element.classNames;
        let matches = className.match(/rated-(\d+)/);
        rating = matches ? Number((Number(matches[1]) / 2).toFixed(1)) : null;
      }

      // console.log({ filmTitle, year, rating });
      films.push({ filmTitle, year, rating });
    });
  }

  return films;
}

// scrapeFilms()
//   .then((films) => {
//     const updated_at = new Date().toISOString().split("T")[0];
//     const outputData = {
//       updated_at,
//       count: films.length,
//       films,
//     };

//     fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2));
//     console.log(`Total films: ${films.length}`);
//   })
//   .catch((error) => {
//     console.error("Error scraping films:", error);
//   });

module.exports = { scrapeFilms };

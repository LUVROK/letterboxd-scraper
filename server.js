const path = require("path");
const fs = require("fs").promises;
const express = require("express");
const { scrapeFilms } = require("./letterboxd.js");

const app = express();
const port = 8861;

app.use(express.json());

app.post("/scrape_films", async (req, res) => {
  const username = req.body.username;

  console.log("I GET POST");

  scrapeFilms(username)
    .then((films) => {
      const updated_at = new Date().toISOString().split("T")[0];
      const outputData = {
        updated_at,
        count: films.length,
        films,
      };

      res.json(JSON.stringify(outputData, null, 2));
    })
    .catch((error) => {
      console.error("Error scraping films:", error);
      res.status(500).send(error);
    });
});

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

server.setTimeout(120000);

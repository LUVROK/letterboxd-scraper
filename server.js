const path = require("path");
const fs = require("fs").promises;
const express = require("express");
const { scrapeFilms } = require("./letterboxd.js");
const https = require("https");

const app = express();
const port = 8861;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const options = {
  key: fs.readFileSync("../key.pem"),
  cert: fs.readFileSync("../cert.pem"),
};

app.post("/scrape_films", async (req, res) => {
  const username = req.body.username;

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

server.setTimeout(12 * 60 * 1000);

https
  .createServer(options, (req, res) => {
    res.writeHead(200);
    res.end(`Сервер запущен на https://localhost:${port}`);
  })
  .listen(port);

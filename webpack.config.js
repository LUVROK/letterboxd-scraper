const path = require("path");

module.exports = {
  target: "node", // Указывает, что сборка предназначена для Node.js
  entry: "./letterboxd.js", // Точка входа вашего приложения
  output: {
    path: path.resolve(__dirname, "dist"), // Путь для выходного файла
    filename: "letterboxd.js", // Имя выходного файла
  },
};

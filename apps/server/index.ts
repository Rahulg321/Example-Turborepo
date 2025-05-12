import express from "express";

const app = express();

app.get("/", (req, res) => {
  setTimeout(() => {
    res.send("Hello World after a long task!");
  }, 5000);
});

app.get("/api/v1/users", (req, res) => {
  res.json({ users: [] });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

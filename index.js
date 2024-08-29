const Express = require("./lib/Express");

const app = new Express();
const port = 3000;

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server health is Wealth",
    user: {
      name: "Nazmul Hossain",
      email: "nazmulhossain@gmail.com",
      country: "Bangladesh",
    },
  });
});

app.post("/user", (req, res) => {
  console.log(req.query);

  res.status(200).json({ success: true, body: req.body });
});
app.get("/user", (req, res) => {
  console.log(req.query);

  res.status(200).json({ success: true, body: req.body });
});
app.get("/user1", (req, res) => {
  console.log(req.query);

  res.status(201).json({ success: true, body: req.body });
});
app.get("/user2", (req, res) => {
  console.log(req.query);

  res.status(202).json({ success: true, body: req.body });
});
app.get("/user3", (req, res) => {
  console.log(req.query);

  res.status(203).json({ success: true, body: req.body });
});

app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}`)
);

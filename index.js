const Express = require("./lib/Express");

const app = new Express();
const port = 3000;

app.get(
  "/health",

  (req, res, next) => {
    req.body.checking = "checking......";

    // next();
  },

  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server health is Wealth",
      checking: req.body?.checking,
      user: {
        name: "Nazmul Hossain",
        email: "nazmulhossain@gmail.com",
        country: "Bangladesh",
      },
    });
  }
);

app.post("/user", (req, res) => {
  console.log(req.query);

  res.status(200).json({ success: true, body: req.body });
});

app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}`)
);

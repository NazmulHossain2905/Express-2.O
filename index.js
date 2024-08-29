const morgan = require("morgan");
const cors = require("cors");
const Express = require("./lib/Express");

const app = new Express();
const port = 3000;

app.use(cors());
app.use(morgan("dev"));

app.get(
  "/health",

  (req, res, next) => {
    req.body.checking = "checking......";

    next();
  },

  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server health is Wealth",
      checking: req.body?.checking,
      method: req.method,
      path: req.path,
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

  res.status(201).json({
    success: true,
    body: req.body,
    method: req.method,
    path: req.path,
  });
});

app.delete("/user", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Delete successfully",
    method: req.method,
    path: req.path,
  });
});

app.put("/user", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Update successfully",
    method: req.method,
    path: req.path,
  });
});

app.patch("/user", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Update successfully",
    method: req.method,
    path: req.path,
  });
});

app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}`)
);

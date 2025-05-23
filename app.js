// import important modules to for storing and reading files
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const bodyParser = require("body-parser");
const path = require("path");

// import files to read
const adminauth = require("./middleware/adminmdw");

// MongoDB connection
mongoose
  .connect("mongodb+srv://skillc:P1BhjZet7jjtiAm5@cluster0.frn3up5.mongodb.net/SkillCircleSignUp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const app = express();
const port = 3000;

// Middlewares
app.use(
  session({
    secret: "skillsecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/admin", adminauth, (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin/admin.html"));
});

app.get("/", (req, res) => {
  res.redirect("/frontend/loginn.html"); // Assuming your login page is served at /login
});

// Routes
const users = require("./routes/users");
app.use("/", users);

const skillRouter = require("./routes/skillroute");
app.use("/", skillRouter);

const adminRouter = require("./routes/adminroute");
app.use("/", adminRouter);

const loginSignupRouter = require("./routes/login-signup");
app.use("/", loginSignupRouter);

const updateProfile = require("./routes/userinfo");
app.use("/", updateProfile);

const userPoints = require("./routes/userpoints");
app.use("/", userPoints);

const questRouter = require("./routes/questsroute");
app.use("/", questRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

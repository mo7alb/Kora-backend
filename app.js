const express = require("express");

const app = express();

app.get("/", (req, res) => {
   res.send("working fine");
});

// import routes
const authRoutes = require("./routes/authenticate")
const matchesRoute = require("./routes/matches");

// use imported routes
app.use("/api/auth", authRoutes)
app.use("/api/matches", matchesRoute);


const port = 3000;
app.listen(port, () => console.log(`app running on http://localhost:${port}`));

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const routes = require("./Routes/apiRoutes");
// const teamRoutes = require("./Routes/teamRoutes");
// const playerRoutes = require("./Routes/playerRoutes");
// const userRoutes = require("./Routes/userRoutes");
// const profileRoutes = require("./Routes/profileRoute");
// const postRoutes = require("./Routes/postRoutes");
dotenv.config();
require("./db");
const app = express();


app.use(cors());
app.use(express.json());

// app.use(userRoutes);
// app.use(profileRoutes);
// app.use(postRoutes);
// app.use(teamRoutes);
// app.use(playerRoutes);

app.use(routes);

if(process.env.NODE_ENV ==='production'){
    console.log("hello");
    app.use(express.static('client/build'));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client","build","index.html"))
    })
}

app.use((error, req, res, next) => {
    if (error.message.includes("user validation failed"))
      error.message = error.message.slice(error.message.indexOf(":"));
  
    // console.log(error.message);
    return res.status(error.statusCode || 500).send({
      message: error.message,
    });
  });


const PORT = process.env.PORT || 1234



app.listen(PORT,()=>{
    console.log(path.resolve(__dirname,"F.E","build","index.html"));

    console.log("Server is running at port " + PORT);
});
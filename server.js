const dotenv = require("dotenv");
const mongoose  = require("mongoose");
const app = require("./app");

dotenv.config({ path: "./config.env" });


const DB=process.env.DATABASE;
mongoose.connect(DB,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useFindAndModify:false
}).then(con=>{
    console.log(con.connections)
    console.log('db connected')
})

const PORT = 8080;
app.listen(process.env.PORT || PORT, () => {
  console.log("App running on port", PORT);
});

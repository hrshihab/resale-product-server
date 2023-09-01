const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5002;

// middlewares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0zgm21v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try {
    const categoryName = client.db("resaleProduct").collection("categoryName");

    const products = client.db("resaleProduct").collection("products");

    const users = client.db("resaleProduct").collection("users");

    const bookings = client.db("resaleProduct").collection("bookings");


   
     // users send to db
     app.post("/api/users", async (req, res) => {
      try {
        const user = req.body;
      // console.log(user);
      const result = await users.insertOne(user);
      res.status(200).json({success: true, data: result})
      } 
      catch (error) {
        res.status(401).json({success: false, message: "something went wrong"})
      }
    });

          // category name 
      app.get('/api/categoryname',async(req, res)=>{
        try {
        
        const result = await categoryName.find().toArray()
        res.status(200).json({success: true, data: result})
        } 
        catch (error) {
          res.status(401).json({success: false, message: "something went wrong"})
        }
        

      })

      // load data individually 
      app.get("/api/categoryname/:id",async(req, res)=>{
        try {
          const id = req.params.id
          console.log(id)
          const query = {_id :new ObjectId(id)}
          const result = await products.findOne(query)
          console.log("result",result)
          res.status(200).json({success: true, data: result})
        } 
        catch (error) {
          res.status(401).json({success: false, message: "something went wrong"})
        }
      })

      // load category by category name
      app.get("/api/category/:category",async(req, res)=>{
        try {
          const category = req.params.category;
          // console.log("category",category)
          const query = {category_name : category}
          // console.log("query",query)
          const result = await products.find(query).toArray()
          res.status(200).json(result)
        } catch (error) {
          res.status(401).json({success: false, message: "something went wrong"})
        }

      })


// post a booking data 
    app.post("/api/bookingsProduct",async(req, res)=>{
      try {
        const body = req.body
      console.log(body)
      const result = await bookings.insertOne(body)
      res.status(200).json({success: true, data: result})
      } 
      catch (error) {
        res.status(401).json({success: false, message: "something went wrong"})
      }

    })

  } 
  catch (error) {
    console.log(error)
  }
}
run().catch(console.log)

// app.all("*", (req, res) => {
//   res.send("NO route found.");
// });


app.get("/", (req, res) => {
    res.send("resale product is running");
  });
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
  
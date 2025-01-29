import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import imageFilePath from "./public/images.json" assert { type: "json" };

const app = express();
const port = 3000;
const apiUrl = "https://v2.jokeapi.dev/joke/"


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", {content: "Welcome, don't take the jokes personal. the jokes are not meant to offend anyone!!!"})
});

app.post("/submit", async (req, res) =>{
    // Route to handle form submission
    const categoryType = req.body.categoryType; // "any" or "custom"
    const categories = req.body.categories; // Array of selected categories or undefined if none
    const language = req.body.language; 
    console.log(imageFilePath.images)
    const image = Math.floor(Math.random() * imageFilePath.images.length)
    var theImage = imageFilePath.images[image]
    console.log(theImage)
    let categ;

    if (categoryType === "Any" && language != "en") {
        try{
            const result = await axios.get(apiUrl + categoryType, {params:{lang:language}})
            const file = result.data
            console.log(file)
            res.render("next.ejs", {content:file.setup, singlePart:file.joke, response:file.delivery, theImg:theImage})
        }catch (error){
            console.log(error.response.data);
            res.status(500).send("Internal Server Error");
        }

    }else if (categoryType === "Any"){
        try{
            const result = await axios.get(apiUrl + categoryType)
            const file = result.data
            console.log(file)
            res.render("next.ejs", {content:file.setup, singlePart:file.joke, response:file.delivery, theImg:theImage})
        }catch (error){
            console.log(error.response.data);
            res.status(500).send("Internal Server Error");
        }

    } else if (categoryType === "custom") { 
      // Check if categories were selected and checking other languages except english
      
        if (Array.isArray(categories)  && language != "en") {
            const joined = categories.join(",");
            try{
                const result = await axios.get(apiUrl + joined, {params:{lang:language}})
                const file = result.data
                console.log(file)
                res.render("next.ejs", {content:file.setup, singlePart:file.joke, response:file.delivery, theImg:theImage})
            }catch (error){
                console.log(error.response.data);
                res.status(500).send("Internal Server Error");
            }

        }else if (Array.isArray(categories)) {
            const joined = categories.join(",");
            console.log(apiUrl+joined)
            try{
                const result = await axios.get(apiUrl + joined)
                const file = result.data
                console.log(file)
                res.render("next.ejs", {content:file.setup, singlePart:file.joke, response:file.delivery, theImg:theImage})
            }catch (error){
                console.log(error.response.data);
                res.status(500).send("Internal Server Error");
            }

        } else {
            const result = "No categories were selected. choose any(for all) or custom(and select atleast one category";
            res.render("index.ejs", {content:result})
      }
    }
});


app.listen(port, () =>{
    console.log(`server is running on port http://localhost:${port}`)
});

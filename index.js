import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

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
    console.log(images)
    const image = Math.floor(Math.random() * images.length)
    var theImage = images[image]
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

const images = [
    "https://media.tenor.com/vE6ad61i_o8AAAAM/bryce-young-carolina-panthers.gif",
    "https://media.tenor.com/QaGZ50VlEPEAAAAM/think-about-it-use-your-brain.gif",
    "https://media1.tenor.com/m/zKlwR2tlcgoAAAAd/billy-porter.gif",
    "https://media1.tenor.com/m/D9qDYwwlJC0AAAAC/pop-corn.gif",
    "https://media1.tenor.com/m/CCGMr0RCQjYAAAAd/baby-toddler.gif",
    "https://media1.tenor.com/m/GMwhj3Fuc14AAAAd/tongue.gif",
    "https://media1.tenor.com/m/Wv7iUFEZ150AAAAd/animaechan-stick-out-tongue.gif",
    "https://media1.tenor.com/m/5ODvKXB5-wkAAAAd/60fps-knee-slapper.gif",
    "https://media1.tenor.com/m/yEG23sxXIVQAAAAd/shrek-shrek-meme.gif",
    "https://media1.tenor.com/m/apebvBi9oQsAAAAd/who-knows-shrug.gif",
    "https://media1.tenor.com/m/2g1Cg2TGgUkAAAAd/laughing-hysterically-cracking-up.gif",
    "https://media1.tenor.com/m/XwBn9yVnYD8AAAAd/kto-kounotori.gif",
    "https://media1.tenor.com/m/PK8lZFjir8gAAAAd/ohhh-burn.gif"
  ]
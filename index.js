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

app.post("/submit", async (req, res) => {
    // Route to handle form submission
    const categoryType = req.body.categoryType; // "any" or "custom"
    let categories = req.body.categories; // Can be a string (single selection) or an array (multiple selections)
    const language = req.body.language;
    const image = Math.floor(Math.random() * images.length);
    var theImage = images[image];

    // Ensure categories is always an array
    if (!Array.isArray(categories) && categories) {
        categories = [categories]; // Convert single selection to array
    }

    console.log(categories);

    if (categoryType === "Any" && language !== "en") {
        try {
            const result = await axios.get(apiUrl + categoryType, { params: { lang: language } });
            const file = result.data;
            console.log(file);
            res.render("next.ejs", {
                content: file.setup,
                singlePart: file.joke,
                response: file.delivery,
                theImg: theImage
            });
        } catch (error) {
            console.log(error.response?.data || error.message);
            res.status(500).send("Internal Server Error");
        }
    } else if (categoryType === "Any") {
        try {
            const result = await axios.get(apiUrl + categoryType);
            const file = result.data;
            res.render("next.ejs", {
                content: file.setup,
                singlePart: file.joke,
                response: file.delivery,
                theImg: theImage
            });
        } catch (error) {
            console.log(error.response?.data || error.message);
            res.status(500).send("Internal Server Error");
        }
    } else if (categoryType === "custom") {
        // Ensure categories is an array before proceeding
        if (categories.length > 0 && language !== "en") {
            const joined = categories.join(",");
            try {
                const result = await axios.get(apiUrl + joined, { params: { lang: language } });
                const file = result.data;
                console.log(file);
                res.render("next.ejs", {
                    content: file.setup,
                    singlePart: file.joke,
                    response: file.delivery,
                    theImg: theImage
                });
            } catch (error) {
                console.log(error.response?.data || error.message);
                res.status(500).send("Internal Server Error");
            }
        } else if (categories.length > 0) {
            const joined = categories.join(",");
            console.log(apiUrl + joined);
            try {
                const result = await axios.get(apiUrl + joined);
                const file = result.data;
                res.render("next.ejs", {
                    content: file.setup,
                    singlePart: file.joke,
                    response: file.delivery,
                    theImg: theImage
                });
            } catch (error) {
                console.log(error.response?.data || error.message);
                res.status(500).send("Internal Server Error");
            }
        } else {
            const result = "No categories were selected. Choose 'Any' for all or 'Custom' and select at least one category.";
            res.render("index.ejs", { content: result });
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
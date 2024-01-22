import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render("index.ejs");
});

app.post('/', async (req,res) => {
    
    const city = req.body.city;

    if(city==""){
        res.render("index.ejs");
    }

    try {

        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`);
        const result = response.data;

        result.sys.sunrise = convertTime(result.timezone,result.sys.sunrise);
        result.sys.sunset = convertTime(result.timezone,result.sys.sunset);
        result.visibility = Math.round(result.visibility/1000);
        result.wind.speed = Math.round(result.wind.speed * 3.6);
        result.main.temp = Math.round(result.main.temp);
        result.weather[0].icon = `https://openweathermap.org/img/w/${result.weather[0].icon}.png`;
        res.render("index.ejs", { data: result });

      } catch (error) {

        console.error("Failed to make request:", error.message);

        res.render("index.ejs", {
          error: error.message,
        });

      }

    
});

app.listen(port,()=>{
    console.log("Server running on port " + port);
})

function convertTime(timezone,time){
    var timezone = timezone;
    var changeInTimezone = timezone + 60;     // +60 , so that time conversion is proper 
    var unix_timestamp = time + changeInTimezone;
    var date = new Date(unix_timestamp * 1000);
    const humanReadableTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
    return humanReadableTime;
}




const key = "ecb21357dfe22365c126d859ba84b5d0";

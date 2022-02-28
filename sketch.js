//Mahinya Mkwawa
//DAT513 Data Driven Design
//Project Name: Weather Data Visualisation

//Variables for this Project
let WorldMap;
var temp; // Temperature from JSON data.
var cityname;
var condition; // Weather condition from JSON data
var timezone; // seconds from UTC from JSON data
var currentWeather;  // Current weather JSON
var historyWeather;  // Historical weather JSON

var currentTown;

let snowflakes = []; // array to hold snowflake objects

let towns = ["London,GB", "Plymouth,GB", "Tokyo,JP", "Mumbai,IN", "Los Angeles,US", "Buenos Aires,AR", "Sydney,AU", "Cairo,EG",]; //Town Array

let avgData = []; // array of history data

// Rain Variables 
var drops, opac = 259;

//Variable for Counter
var counter=0;

var firsttime = true;

var citylatitude = 51.5085;  // London latitude
var citylongitude = -0.1257;  // London longitude

 // Making a map and tiles
 //initialize the map and set its view to London geographical coordinates
 const mymap = L.map('posMap').setView([citylatitude, citylongitude], 13);  
 const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';  // load tiles of the globe
 const tiles = L.tileLayer(tileUrl);  // set tiles
 tiles.addTo(mymap);  // add tile to the map

 const marker = L.marker([0, 0]).addTo(mymap);  // add marker to the map

 getPos();  // get position and set views to the chosen geographical coordinates

 var x1 = 300; var y1= 375; var x2 = 300; var y2= 320; var x3 = 356; var y3 = 350;  // coordinates for right arrow

 var x4 = 200; var y4= 375; var x5 = 200; var y5= 320; var x6 = 144; var y6 = 350;  // coordinates for left arrow


 function rightArrow(){

  if (counter >= towns.length-1){  // make sure the counter does not exceed the maximum array size
    counter = towns.length-1;
}

// Adds 1 to 'counter' when Right Arrow is pressed.
  counter = counter + 1;
  if (counter >= 0 && counter < towns.length){  // make sure the counter is within the array of towns bondary
      loadCurrent(towns[counter]);  // load current weather data for this town
      loadHistory(towns[counter]); // load history weather data for this town
  }

 }

 function leftArrow(){

  if (counter < 0){
    counter = 0;
}
  console.log(counter);
  // Subracts 1 from 'counter' when Left Arrow is pressed.
      counter = counter - 1;
      if (counter >= 0 && counter < towns.length){
          loadCurrent(towns[counter]); // load current weather data for this town
          loadHistory(towns[counter]); // load history weather data for this town
      }

 }

//Function for Key pressed
function keyPressed() {
  
  if(keyCode == RIGHT_ARROW) { 

    rightArrow();
  }
  
if(keyCode== LEFT_ARROW) {

  leftArrow();
}
}
  

  
function preload() {
  //WorldMap = loadImage('WorldMap.png');
  Haze=loadImage("HazeNew.png");
  Mist=loadImage("mistNew2.png");
  Smoke=loadImage("smokeNew.png");
  //Arrows=loadImage("arrows.png");
  RainSound=loadSound('Rain.wav');
}

// function to load history of weather data
function loadHistory(town){
  var url = "https://history.openweathermap.org/data/2.5/history/city?q="+town+"&units=metric&appid=9afaed76a94fa9da9e2a4b9a5c232163";
   loadJSON(url,historyLoaded);
   currentTown = town;
   
}


//Functions to load current weather data
function loadCurrent(town) { // Loads weather json data for this town
  var url = "https://api.openweathermap.org/data/2.5/weather?q="+town+"&units=metric&appid=9afaed76a94fa9da9e2a4b9a5c232163";
  loadJSON(url,weatherLoaded);  //load current weather from JSON string
}
 

function historyLoaded(list) {
  historyWeather = list;
  var size =  historyWeather.list.length;  // size of history data
  var sum=0;  //sum to calculate average
  var averageTemp = 0;  //average temperature
  
  for (i=0;i<size;i++){   //loop to go over the history data and compute average
    sum=sum+historyWeather.list[i].main.temp;  // sum hourly history temperature 
  }
  averageTemp = round(sum/size);  // compute average
  
  var index = avgData.findIndex(x => x.label==currentTown); // check if current town exists in the array
  
  if (index == -1){  // town does not exist in the array, so add it
  avgData.push({y: averageTemp, label: currentTown});  // add average 24 hours temp
  }
  plotBarChart();  // plot bar chart for average tempetature in the last 24 hours
}

function weatherLoaded(data) {
  currentWeather = data;
}

//fill array with drop locations for Rain

//create first drops for Rain
makeDrops();
function makeDrops() {
  drops = [];
  for(var i=0;i<60;i++) {
    drops.push(Math.floor(Math.random()*(201)+100));
    drops.push(Math.floor(Math.random()*(31)+180));
  }
}


//draw rain function
function drawRain() {

  //play rain sound

  if (firsttime){  // play rain sound for the first time

    RainSound.play();
    firsttime =false;
  }
  //drops evaporate
  opac-=2;
  for(var j=0;j<drops.length;j+=2) {
    fill(114,198,255,opac);
    ellipse(drops[j],drops[j+1],7);
  }
  
    noStroke();
    fill(169,169,169);
    ellipse(220,150,150,50);
	  ellipse(170,175,150,50);
	  ellipse(270,175,150,50);
	  ellipse(250,185,150,50);
  
  for(var l=1;l<drops.length;l+=2) {
    drops[l]+=random(0.5,3);
  }
  
  //drops evaporate, trigger more rain
  if(opac<=0) {
    opac=259;
    makeDrops();
  }
}


function setup() {
  var canvas = createCanvas(500, 400);
  canvas.parent('weathercondition');
  loadCurrent(towns[0]); // load current weather for the default town (London)
  loadHistory(towns[0]); // load current weather history for the default town (London)
}

//function to show position of the current city on the map
function getPos() {
  
    marker.setLatLng([citylatitude, citylongitude]);
    mymap.setView([citylatitude, citylongitude], 2);
    
 
}
//Function to Plot Chart
function plotBarChart(){

  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    
    title:{
      text:"Average Temperature (Last 24 hours)" //Edit Graph title
    },
    axisX:{
      interval: 1
    },
    axisY2:{
      interlacedColor: "rgba(1,77,101,.2)",
      gridColor: "rgba(1,77,101,.1)",
      title: "Temperature °C"        // Add in metrics °c
    },
    data: [{
      type: "bar",
      name: "",
      axisYType: "secondary",
      dataPoints: avgData       //Import Data
    }]
  });
  chart.render();

}

function draw(){
  background(220,220,220);


  if (currentWeather){
    temp = currentWeather.main.temp;
    drawWeatherTemp();
    
    citylatitude = currentWeather.coord.lat;  // latitude of the current city from the currentWeather
    citylongitude = currentWeather.coord.lon;  //longitude of the current city from the currentWeather
    
    condition = currentWeather.weather[0].main;  // get weather condition of the current city from currentWeather
    drawWeatherCondition();  
    
    if (condition == "Clouds"){
      RainSound.stop();  //stop rain sound if playing
      firsttime=true;
      drawCloud();
    }
    if (condition == "Rain"){
      drawRain();      
    }
    
    if (condition == "Snow"){
      RainSound.stop();  //stop rain sound if playing
      firsttime=true;
      createSnowFlakes();
    }
    
    if(condition =="Clear"){
      RainSound.stop();  //stop rain sound if playing
      firsttime=true;
      drawSun();
    }
    if(condition =="Haze"){
      RainSound.stop();  //stop rain sound if playing
      firsttime=true;
     drawHaze();
    }
    if(condition =="Mist"){
      RainSound.stop();  //stop rain sound if playing
      firsttime=true;
      drawMist();
     }
     if(condition =="Smoke"){
      RainSound.stop();  //stop rain sound if playing
      firsttime=true;
      drawSmoke();
     }

    cityname = currentWeather.name;
    drawLocation();
    
    getPos(); // show position on the map at the current city by using coordinates

    drawArrows();
  }
}
 
  
  
 //Function for Location Name
function drawLocation(){
  fill(105,105,105);
  textSize(32);
  textFont('monospace');
  text(cityname, width/3, 73);
}
   

  //Function for WeatherCondition
  function drawWeatherCondition(){
  fill(105,105,110);
  textSize(25);
  text(condition, 155, 248);
  
  }  
  
  //Function for WeatherTemp
  function drawWeatherTemp(){
  fill(105,105,110);
  textSize(28);
  text(round(temp)+'°c', 255, 250);
  }
  
  //Function for Drawing Clouds
  function drawCloud(xpos, ypos,size){
  noStroke();
	fill(169,169,169);
	ellipse(220,150,150,50);
	ellipse(170,175,150,50);
	ellipse(270,175,150,50);
	ellipse(250,185,150,50);
  }
  
  //Function for Sun Clear Sky
  function drawSun(xpos, ypos,size){
    noStroke();
    fill(255,91,70)
    ellipse(230, height/2.5, 105, 105);
  }
  
  //Function for Haze
  function drawHaze(){
  image(Haze,width/3,95,120,120);

}
  //Function for Mist
  function drawMist(){
    image(Mist,width/3,95,120,120);

  }
  //Function for Smoke
  function drawSmoke(){
  image(Smoke,width/3,95,120,120);
  }
  

  function mouseClicked(){

    if (mouseX >= x1 && mouseX <=x3 && mouseY <= y1 && mouseY >= y2 ){  //check if mouse is clicked within a triangle
      rightArrow();
    }

    if (mouseX <= x4 && mouseX >=x6 && mouseY <= y4 && mouseY >= y5 ){  //check if mouse is clicked within a triangle
      leftArrow();
    }

  }
  

  // Function for arrows
  function drawArrows(){
    
    triangle(x1,y1,x2,y2,x3,y3);

    triangle(x4,y4,x5,y5,x6,y6);
  }

  function createSnowFlakes(){
  let t = frameCount / 60; // update time

  // create a random number of snowflakes each frame
  for (let i = 0; i < random(1); i++) {
    snowflakes.push(new drawsnowflake()); // append snowflake object
  }

  // loop through snowflakes with a for..of loop
  for (let flake of snowflakes) {
    flake.update(t); // update snowflake position
    flake.display(); // draw snowflake
  }
}

// snowflake class
function drawsnowflake() {
  // initialize coordinates
  this.posX = 0;
  this.posY = (-50, 200);
  this.initialangle = random(0, 2 * PI);
  this.size = random(5, 5);
  fill(169,169,169);
	ellipse(200,150,150,50);
	ellipse(150,175,150,50);
	ellipse(250,175,150,50);
	ellipse(220,185,150,50);
  fill(255,255,255);
  noStroke();

  // radius of snowflake spiral
  // chosen so the snowflakes are uniformly spread out in area
  this.radius = sqrt(random(pow(width / 1, 1.5)));

  this.update = function(time) {
    // x position follows a circle
    let w = 0.6; // angular speed
    let angle = w * time + this.initialangle;
    this.posX = width / 3.5 + this.radius * sin(angle);

    // different size snowflakes fall at slightly different y speeds
    this.posY += pow(this.size, 0.3);

    // delete snowflake if past end of screen
    if (this.posY > height) {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index, 1);
    }
  };

  this.display = function() {
    ellipse(this.posX, this.posY, this.size);
  };
  
  }




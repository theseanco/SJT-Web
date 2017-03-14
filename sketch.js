//This version adds long-envelope sounds to each permutation, using sine waves

//visual and audio implementation of the Steinhaus-Johnson-Trotter algorithm. Inspired by a terminal sketch I did in late 2016

//steinhaus-johnson-trotter implementation by nodash (https://github.com/nodash/steinhaus-johnson-trotter)

//things for sound
var osc, envelope, fft;
var note = 0;

//Array of permutations
var numArray = [1,2,3,4,5,6]

// this uses the steinhaus johnson trotter code in the libraries folder
var generate = permute(numArray);

//time delay for generation of notes
var timeDelay = 0.5;

//number of generations to display during sketch
var gen = 20;

//an array to hold arrays of SJT objects (each index on the array being a row)
var rings = [[]];

//number of rows we are on
var permNum = 0;

//time to wait between each sound
var waitTime = 1450;

//number of blocks out of the permutations displayed
var numDisplayed = 0;

//time delay after sequence is finished (multiplied by waitTime)
var scaleDelay = 0;

// an array to hold permutations
var permutations = [];

function setup() {
    //limit frame rate because it doesn't need to be so large
    frameRate(20);
    //set up timer for triggering onsets
    lastTime1 = millis();
    lastTime2 = millis();
    //check SJT is working
    //console.log(generate());
    createCanvas(windowWidth,windowHeight);
    //draw background
    background(0);
    //new array to
    rings[permNum] = new Array();
    //first instance of the array is pre-generation - generated permutations are always n+1
    permutations = numArray;
    //Sine Oscillator
    osc = new p5.SinOsc();
    //new envelope
    envelope = new p5.Env();
    //set ADSR envelope
    envelope.setADSR(0.1, 2, 0.5, 5);
    //set envelope level
    envelope.setRange(1,0.01);
    //start sound
    osc.start();
    }     

function draw() {

    background(20);
    /* TODO: 
     * In here, there needs to be the following:
     *
     * - BellRing objects done in permutation colours
     * - Sounds corresponding to the permutation number are played in accordance with the BellRing objects
     * - The BellRing objects are released from memory after they get to the top of the screen (or aren't)
     */

    //display all of the available 'rings'
    for(var i=0; i<rings.length; i++){
        for( var j=0; j<rings[i].length; j++){
            rings[i][j].display();
        }
    }

    //if we have waited for the row of sounds to elapse
    if( millis() - lastTime1 > (waitTime*(numArray.length+1+scaleDelay)) ) {
        for(var i=0; i<rings.length; i++){
            for( var j=0; j<rings[i].length; j++){
                rings[i][j].move();
            }
        }
        lastTime1 = millis();
        //add another permutation
        //create new row
        permNum++;
        numDisplayed = 0;
        //rolls-over the number of generations present in the array to save on memory. If accessing other generations is needed, remove this if statement
        if ( permNum > gen ) {
            permNum = 0;
        }
        // add a new row!
        rings[permNum] = new Array();
        //reset the number displayed, much easier to do it here in case of any fine-grained timing conflicts
        numDisplayed = 0;
        //generate new permutation
        permutations = generate();
    }

    //if we have waited for one sound to elapse
    if ( millis() - lastTime2 > waitTime ) {
        //create block using the numDisplayed 
        if (numDisplayed < numArray.length) {
            rings[permNum][numDisplayed] = new Ring((numDisplayed*windowWidth)/numArray.length,windowHeight-(windowHeight/gen),windowWidth/numArray.length,windowHeight/gen,permutations[numDisplayed]*(255/numArray.length),100,100,0);
            //DING!
            console.log("ding!");
            //sound goes here
            osc.freq(permutations[numDisplayed]*60);
            envelope.play(osc,0,0.1);
        };
        //reset time delay for the drawing of blocks
        lastTime2 = millis();
        //iterate the amount of blocks we have displayed
        numDisplayed++;
        //reset the counter. This can be done better
    }
    
}

//SJT Onset, a 'Ring' (bell) that takes x, y, width, legnth, r, g, b, fadeTime
// drawn from this https://p5js.org/examples/objects-objects.html
// the ring.move() moves the shape up its own height
// TODO: add milis to this to control fade time.
function Ring(x,y,w,h,hue,sat,bri,fade){

    this.x = x;
    this.y = y;
    this.fade = fade;

    this.move = function() {
       this.y = this.y-h;
    };

    // display the square
    this.display = function() {
        this.fade += 10;
        //change color mode to HSB
        colorMode(HSB)
        //no outlines because it doesn't look as good as i thought it would
        noStroke();
        fill(hue,sat,bri,this.fade);
        rect(this.x,this.y,w,h);
    };
}   

/* NOW DEFUNCT
// a function which creates a row of SJTs
// this should also take the permutations as arguments
// takes a row number
function SJTRow(){
    //a for loop to make a row of SJT squares
    //SJT squares start with a negative color value so that they fade in from black
    rings[permNum] = new Array();
    for(var i=0; i<numArray.length+1; i++){ 
        rings[permNum][i] = new Ring((i*windowWidth)/numArray.length,windowHeight-(windowHeight/gen),windowWidth/numArray.length,windowHeight/gen,random(21,255),random(21,200),random(21,200),-(i*50));
    }
}
*/

/*
//the correct for loop to generate x sections of the screen

    for(var i=0; i<numArray.length+1; i=i+1){
        fill(color(random(0,255),random(0,255),random(0,255)));
        // this is a mess, but the key is that the rectangles are set across by the number of elements involved in the permutation, and up/down by an arbitrary number
        rect((i-1)*windowWidth/(numArray.length),windowHeight-(windowHeight/gen),windowWidth/(numArray.length),windowHeight/gen);
    }
 
*/

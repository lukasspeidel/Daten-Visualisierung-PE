let stageHeight;
let stageWidth;
let renderer;
let toggleviewcheck;
let toggleViewButton = $('#toggleViewButton');

const RADIUS_MIN = 1;
const RADIUS_MAX = 20;

const gdpMax = gmynd.dataMax(countryData, "GDP");
const overallEnergyMax = gmynd.dataMax(countryData, "primary_energy_consumption");
const fossilFuelEnergyMax = gmynd.dataMax(countryData, "fossil_fuel_consumption");
const renewableEnergyMax = gmynd.dataMax(countryData, "renewables_consumption");
const lowCarbonEnergyMax = gmynd.dataMax(countryData, "low_carbon_consumption");

const gdpMin = gmynd.dataMin(countryData, "GDP");
const overallEnergyMin = gmynd.dataMin(countryData, "primary_energy_consumption");
const fossilFuelEnergyMin = gmynd.dataMin(countryData, "fossil_fuel_consumption");
const renewableEnergyMin = gmynd.dataMin(countryData, "renewables_consumption");
const lowCarbonEnergyMin = gmynd.dataMin(countryData, "low_carbon_consumption");



$(function () {
    renderer = $('#renderer');
    stageHeight = renderer.innerHeight();
    stageWidth = renderer.innerWidth();

    prepareData();
    
    calculatePositions();

    drawMap();

    toggleViewButton.click(toggleView);

    const max = Math.max(fossilFuelEnergyMax, renewableEnergyMax, lowCarbonEnergyMax)

    for (let i = 0; i < countryData.length; i++) {
        const chart = createChart(3, {}, [
            {
                height: (countryData[i].fossil_fuel_consumption / max) * 400,
                backgroundColor: 'red'
            },
            { 
                height: (countryData[i].renewables_consumption / max) * 400,
                backgroundColor: 'green'
            },
            {
                height: (countryData[i].low_carbon_consumption / max) * 400,
                backgroundColor: 'blue'
            }
        ])
        $(".charts").append(chart);
    }
});

/* Funktion um Daten vorzubereiten Merge und delete */
function prepareData() {
     /* Maxima werden ermittelt */
     console.log("Gdp Max:" + gdpMax);
     console.log("Energy Max:" + overallEnergyMax);
     console.log("Fossil Fuel Max:" + fossilFuelEnergyMax);
     console.log("Renewable Energy Max:" + renewableEnergyMax);
     console.log("Low Carbon Max:" + lowCarbonEnergyMax);
 
     console.log("Gdp Min:" + gdpMin);
     console.log("Energy Min:" + overallEnergyMin);
     console.log("Fossil Fuel Min:" + fossilFuelEnergyMin);
     console.log("Renewable Energy Min:" + renewableEnergyMin);
     console.log("Low Carbon Min:" + lowCarbonEnergyMin);

    gmynd.sortData(countryData, "-GDP");
}   

    // Takes three radiuses and returns the position of the centers of the three circles 
	// as an object with keys x1, y1, x2, y2, x3, y3
	// The center between the circles is at x:0, y:0

function calculatePositions(r1, r2, r3) {
    let d = r1 + r2;
    
    // intersection position
    let xi = ((r1+r3)**2 - (r2+r3)**2 + d**2) / (2 * d);
    let yi = Math.sqrt((r1+r3)**2 - xi**2);
    
    let px = r1 * xi / (r1 + r3);
    let py = r1 * -yi / (r1 + r3);
    let vx = -py;
    let vy = px;
    
    // mid point of the three circles
    let mx = r1;
    let my = py + vy * (r1 - px) / vx;
    
    return {x1: -mx, y1: -my, x2: r2, y2: -my, x3:xi-mx, y3:-yi-my};
}

/* function test() {
    circlePositions = calculatePositions(r1, r2, r3);
    console.log(circlePositions);

    let fossilCircle = $('<div></div>');
    fossilCircle.addClass('fossilCircle');
    fossilCircle.css({
        'height': r1 * 2, 
        'width': r1 * 2, 
        'left': circlePositions.x1+testCords,
        'top': circlePositions.y1+testCords,
    });	
    fossilCircle.appendTo(renderer);

    let renewableCircle = $('<div></div>');
    renewableCircle.addClass('renewableCircle');
    renewableCircle.css({
        'height': r2 * 2, 
        'width': r2 * 2, 
        'background-color': 'green',
        'left': circlePositions.x2+testCords,
        'top': circlePositions.y2+testCords,
    });	
    renewableCircle.appendTo(renderer);

    let lowCarbonCircle = $('<div></div>');
    lowCarbonCircle.addClass('lowCarbonCircle');
    lowCarbonCircle.css({
        'height': r3 * 2, 
        'width': r3 * 2, 
        'background-color': 'yellow',
        'left': circlePositions.x3+testCords,
        'top': circlePositions.y3+testCords,
    });	
    lowCarbonCircle.appendTo(renderer); 
}   */ 


 function drawMap() {
    toggleViewcheck = 'map'

    countryData.forEach(iso_code => {
     //Längen- und Breitengrad werden in x- und y-Position umgerechnet
        let x = gmynd.map(iso_code.longitude, -180, 180, 0, stageWidth);
        let y = gmynd.map(iso_code.latitude, -90, 90, stageHeight, 0);
        
        
        //Radien für Kreise mappen
        let r1 = gmynd.map(iso_code.fossil_fuel_consumption, fossilFuelEnergyMin, fossilFuelEnergyMax, RADIUS_MIN, RADIUS_MAX);
        let r2 = gmynd.map(iso_code.renewables_consumption, renewableEnergyMin, renewableEnergyMax, RADIUS_MIN, RADIUS_MAX/7.1);
        let r3 = gmynd.map(iso_code.low_carbon_consumption, lowCarbonEnergyMin, lowCarbonEnergyMax, RADIUS_MIN, RADIUS_MAX/6.15);
        console.log(iso_code.country, r1, r2, r3);


        const circlePositions = calculatePositions(r1, r2, r3);


        let fossilCircle = $('<div></div>');
        fossilCircle.addClass('fossilCircle');
        fossilCircle.css({
            'height': Math.round(r1*2), 
            'width': Math.round(r1*2), 
            'border-radius': '50%',
            'position': 'absolute',
            'left': circlePositions.x1+x,
            'top': circlePositions.y1+y,
        });	
        fossilCircle.attr('data-value',  Math.round(r1*2))
        fossilCircle.appendTo(renderer);
        fossilCircle.on("click", function () {
            console.log(this);

            $(".clicked").removeClass("clicked");

            $(this).addClass("clicked");

            $("#clickLabel").html(iso_code.country+
                '<br> Fossil Fuel Consumption: '+
                iso_code.fossil_fuel_consumption+
                '<br> Renewable Energy Consumption: '+
                iso_code.renewables_consumption+
                '<br> Low Carbon Consumption:'+
                iso_code.low_carbon_consumption );
        });

        let renewableCircle = $('<div></div>');
        renewableCircle.addClass('renewableCircle');
        renewableCircle.css({
            'height': Math.round(r2*2), 
            'width': Math.round(r2*2), 
            'border-radius': '50%',
            'position': 'absolute',
            'left': circlePositions.x2+x,
            'top': circlePositions.y2+y,
        });	
        renewableCircle.attr('data-value',  Math.round(r2*2))
        renewableCircle.appendTo(renderer);
        renewableCircle.on("click", function () {
            console.log(this);

            $(".clicked").removeClass("clicked");

            $(this).addClass("clicked");

            $("#clickLabel").html(iso_code.country+
                '<br> Fossil Fuel Consumption: '+
                iso_code.fossil_fuel_consumption+
                '<br> Renewable Energy Consumption: '+
                iso_code.renewables_consumption+
                '<br> Low Carbon Consumption:'+
                iso_code.low_carbon_consumption );
        });

        let lowCarbonCircle = $('<div></div>');
        lowCarbonCircle.addClass('lowCarbonCircle');
        lowCarbonCircle.css({
            'height': Math.round(r3*2), 
            'width': Math.round(r3*2), 
            'border-radius': '50%',
            'position': 'absolute',
            'left': circlePositions.x3+x,
            'top': circlePositions.y3+y,
        });	
        lowCarbonCircle.attr('data-value',  Math.round(r3*2))
        lowCarbonCircle.appendTo(renderer);
        lowCarbonCircle.on("click", function () {
            console.log(this);

            $(".clicked").removeClass("clicked");

            $(this).addClass("clicked");

            $("#clickLabel").html(iso_code.country+
                '<br> Fossil Fuel Consumption: '+
                iso_code.fossil_fuel_consumption+
                '<br> Renewable Energy Consumption: '+
                iso_code.renewables_consumption+
                '<br> Low Carbon Consumption:'+
                iso_code.low_carbon_consumption );
        });
    });
} 
 
function drawBarChart() {
    toggleViewCheck = 'bar';

    //Daten sortieren nach Gdp
    const compareByValue = (a, b) => b.value - a.value;

    sortedByGdp = countryData.sort(compareByValue)

    console.log(sortedByGdp);



    /* Breite und Kontinent mit max Anz. der an Ländern */
    const barWidth = 30;


    console.log(cumulatedByContinent);
}
// [80, 45, 23]
function createChart(count, parentCSS, arrChildCSS) {
    toggleViewCheck = 'chart';
    const chart = $('<div class="chart"></div>');
    chart.css(parentCSS);

    for (let i = 0; i < count; i++) {
        const child = $('<div class="bar"></div>');
        child.css(arrChildCSS[i]);
        chart.append(child);
    }

    return chart;
}

function toggleView() {

    /* Stage leeren */
    renderer.empty();

    /*  Wenn vorher die Map aktiv war, die Funktion für das BarChart aufrufen.
        Wenn vorher das BarChart aktiv war, die Funktion für die Map aufrufen. */
    if (toggleViewCheck == 'map') {
        createChart();
    } else {
        drawMap();
    }
}
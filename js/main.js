let stageHeight;
let stageWidth;
let renderer;

const RADIUS_MIN = 1;
const RADIUS_MAX = 20;


const FRAME_WIDTH_MAX = 2* RADIUS_MAX ;
const FRAME_HEIGHT_MAX = 2 * RADIUS_MAX;

$(function () {
    renderer = $('#renderer');
    stageHeight = renderer.innerHeight();
    stageWidth = renderer.innerWidth();

    prepareData();
    
    calculatePositions();

    drawMap();

    //test();

});

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

    countryData.forEach(iso_code => {
     //Längen- und Breitengrad werden in x- und y-Position umgerechnet
        let x = gmynd.map(iso_code.longitude, -180, 180, 0, stageWidth);
        let y = gmynd.map(iso_code.latitude, -90, 90, stageHeight, 0);
        
        
        //Radien für Kreise mappen
        let r1 = gmynd.map(iso_code.fossil_fuel_consumption, fossilFuelEnergyMin, fossilFuelEnergyMax, RADIUS_MIN, RADIUS_MAX);
        let r2 = gmynd.map(iso_code.renewables_consumption, renewableEnergyMin, renewableEnergyMax, RADIUS_MIN, RADIUS_MAX/7.1);
        let r3 = gmynd.map(iso_code.low_carbon_consumption, lowCarbonEnergyMin, lowCarbonEnergyMax, RADIUS_MIN, RADIUS_MAX/6.15);
        console.log(iso_code.country, r1, r2, r3);

/*         let frame = $('<div></div>');

        frame.addClass('frame')
        frame.css({
            'height': FRAME_HEIGHT_MAX,
            'width': FRAME_WIDTH_MAX,

            'position': 'absolute',
            'left': x,
            'top': y,
        });
        frame.attr('data-country', iso_code.country);
        renderer.append(frame);
         */
        const circlePositions = calculatePositions(r1, r2, r3);


        let fossilCircle = $('<div></div>');
        fossilCircle.addClass('fossilCircle');
        fossilCircle.css({
            'height': Math.round(r1*2), 
            'width': Math.round(r1*2), 
            'background-color': 'red',
            'border-radius': '50%',
            'position': 'absolute',
            'left': circlePositions.x1+x,
            'top': circlePositions.y1+y,
        });	
        fossilCircle.attr('data-value',  Math.round(r1*2))
        fossilCircle.appendTo(renderer);

        fossilCircle.click(() => {

            $(".clicked").removeClass("clicked");

            fossilCircle.addClass("clicked");

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
    });
} 
 
function drawBarChart() {
    toggleViewCheck = 'bar';

    /* Breite und Kontinent mit max Anz. der an Ländern */
    const barWidth = 100;
    const countryData = gmynd.dataMax(cumulatedByContinent, 'count')

    console.log(cumulatedByContinent);

    /* Schleife durch die Kontinente, X-Position */
    /*  Schreibweise: ES6, Destrukturierende Zuweisung / destructuring assignment 
        Arraywerte und Objekteigenschaften können einfach Variablen zugeordnet werden. */

    // Um hier auch direkt einen Index zu erhalten, kann man cumulatedData mit .entries() "konvertieren", zu einem array iterator. (hatte wir davor noch nicht kennengelernt).
    for (let [indexContinents, continentData] of cumulatedByContinent.entries()) {
        // X-Position für Bar und Label erstellen
        // 0 * 50 * 2 = 0
        // 1 * 50 * 2 = 100
        // 2 * 50 * 2 = 200
        // ...
        const xPos = indexContinents * barWidth * 2;

        let bar = $('<div></div>');
        bar.addClass('bar');

        // Berechnung der Höhe (3-Satz)
        let barHeight = stageHeight / continentCountryMax * continentData.count
        const yPos = stageHeight - barHeight;

        bar.css({
            'height': barHeight,
            'width': barWidth,
            'left': xPos,
            'top': yPos,
        })

        $('#renderer').append(bar);


        // Label für einen Kontinent generieren
        let label = $("<div></div>");
        label.text(continentData.continent);

        $('#renderer').append(label);

        label.width(barWidth);

        label.css({
            'left': xPos,
            'top': stageHeight - label.height() - 10,
            'position': 'absolute',
            'color': 'black',
            'z-index': 1000,
            'text-align': 'center'
        })

    }
}


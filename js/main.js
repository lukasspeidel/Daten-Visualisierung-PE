let stageHeight;
let stageWidth;
let renderer;

const RADIUS_MIN = 1;
const RADIUS_MAX = 50;
const FRAME_OFFSET_X = 0;

const SVG_VIEWBOX_WIDTH = 200;
const SVG_VIEWBOX_HEIGHT = 250;

const FRAME_WIDTH_MAX = 4 * RADIUS_MAX + FRAME_OFFSET_X;

$(function () {
    renderer = $('#renderer');
    stageHeight = renderer.innerHeight();
    stageWidth = renderer.innerWidth();

    prepareData();

    drawMap();

    
/*     const svg1 = createSVG(10, 10, 5, 100, 125, calculatePositions(10, 10, 5), {c1: 'red', c2: 'green', c3: 'blue'});
    const svg2 = createSVG(50, 50, 50, 100, 125, calculatePositions(50, 50, 50), {c1: 'red', c2: 'green', c3: 'blue'});
    
    const frame1 = $(`<div class='frame' style='top: 80%; left: 50%; width: ${FRAME_WIDTH_MAX}px'></div>`);
    const frame2 = $(`<div class='frame' style='top: 30%; left: 50%; width: ${FRAME_WIDTH_MAX}px'></div>`);
    frame1.append(svg1);
    frame2.append(svg2);

    renderer.append(frame1, frame2); */
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

    //Radien Kreise 
    countryData.forEach(iso_code => {
           
           const r1 = gmynd.map(iso_code.fossil_fuel_consumption, fossilFuelEnergyMin, fossilFuelEnergyMax, 1, 200);
           const r2 = gmynd.map(iso_code.renewables_consumption, renewableEnergyMin, renewableEnergyMax, 1, 100);
           const r3 = gmynd.map(iso_code.low_carbon_consumption, lowCarbonEnergyMin, lowCarbonEnergyMax, 1, 100);
    })

}
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

function drawMap() {

    countryData.forEach(iso_code => {
     //Längen- und Breitengrad werden in x- und y-Position umgerechnet
        const x = gmynd.map(iso_code.longitude, -180, 180, 0, stageWidth);
        const y = gmynd.map(iso_code.latitude, -90, 90, stageHeight, 0);
        
        //Radien für Kreise mappen
        const rFossil = gmynd.map(iso_code.fossil_fuel_consumption, fossilFuelEnergyMin, fossilFuelEnergyMax, 1, 200);
        const rRenewables = gmynd.map(iso_code.renewables_consumption, renewableEnergyMin, renewableEnergyMax, 1, 100);
        const rLowCarbon = gmynd.map(iso_code.low_carbon_consumption, lowCarbonEnergyMin, lowCarbonEnergyMax, 1, 100);

        let frame = $('<div></div>');

        frame.addClass('frame')
        
        frame.css({
            'height': 100,
            'width': FRAME_WIDTH_MAX,
            'background-color': 'white',
            'position': 'absolute',
            'left': x,
            'top': y,
        });
        renderer.append(frame);
        //Kreise werden erstellt
/*         let dotFossil = $('<div></div>');

        dotFossil.addClass('dotFossil')

        dotFossil.css({
            'height': rFossil,
            'width': rFossil,
            'background-color': 'red',
            'position': 'absolute',
            'left': x,
            'top': y,
            'border-radius': '50%'
        });
        renderer.append(dotFossil);

        
        let dotRenewable = $('<div></div>');

        dotRenewable.addClass('dotRenewable')

       dotRenewable.css({
            'height': rRenewables,
            'width': rRenewables,
            'background-color': 'white',
            'position': 'absolute',
            'left': x,
            'top': y,
            'border-radius': '50%'
        });
        renderer.append(dotRenewable);


        let dotLowCarbon = $('<div></div>');

        dotLowCarbon.addClass('dotLowCarbon')

        dotLowCarbon.css({
            'height': rLowCarbon,
            'width': rLowCarbon,
            'background-color': 'green',
            'position': 'absolute',
            'left': x,
            'top': y,
            'border-radius': '50%'
        });
        renderer.append(dotLowCarbon);

        let circleGdp = $('<div></div>');

        circleGdp.addClass('circleGdp')

        circleGdp.css({
            'height': r,
            'width': r,
            'outline': '1px solid black',
            'position': 'absolute',
            'left': x,
            'top': y,
            'border-radius': '50%'
        });
        renderer.append(dotRenewable); */

    });
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

function createSVG(r1, r2, r3, cx, cy, positions, colors) {
    const {x1, y1, x2, y2, x3, y3} = positions;
    const {c1, c2, c3} = colors;

    const svg = $(`
        <svg viewBox="0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}">
            <circle cx="${cx + x1}" cy="${cy + y1}" r="${r1}" fill="${c1}" />	
            <circle cx="${cx + x2}" cy="${cy + y2}" r="${r2}" fill="${c2}" />
            <circle cx="${cx + x3}" cy="${cy + y3}" r="${r3}" fill="${c3}" />
            <circle class='midpoint' cx="${cx}" cy="${cy}" r="${2}"/>
        </svg>
    `)

    return svg;
}
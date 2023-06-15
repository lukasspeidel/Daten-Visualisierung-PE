let stageHeight;
let stageWidth;
let renderer;
r = 15;


$(function () {
    renderer = $('#renderer');
    stageHeight = renderer.innerHeight();
    stageWidth = renderer.innerWidth();

    prepareData();

    drawMap();
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

        let dotFossil = $('<div></div>');

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
        renderer.append(dotRenewable);

    });
}
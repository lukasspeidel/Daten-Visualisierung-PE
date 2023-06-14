let stageHeight;
let stageWidth;
let renderer;
r = 10;


$(function () {
    renderer = $('#renderer');
    stageHeight = renderer.innerHeight();
    stageWidth = renderer.innerWidth();

    prepareData();

    drawDots();
});

/* Funktion um Daten vorzubereiten Merge und delete */
function prepareData() {
let mergedCountryData = gmynd.mergeData(countryData, countryPosition, "iso_code", "alpha3Code");
console.log(mergedCountryData);
}

function drawDots() {


    /* Maxima werden ermittelt */
    const gdpMax = gmynd.dataMax(countryData, "gdp");
    const energyMax = gmynd.dataMax(countryData, "primary_energy_consumption");
    const fossilFuelEnergyMax = gmynd.dataMax(countryData, "fossil_fuel_consumption");
    const renewableEnergyMax = gmynd.dataMax(countryData, "renewable_energy_consumption");
    const lowCarbonEnergyMax = gmynd.dataMax(countryData, "low_carbon_energy_consumption");
    
    console.log("Gdp Max:" + gdpMax);
    console.log("Energy Max:" + energyMax);
    console.log("Fossil Fuel Max:" + fossilFuelEnergyMax);
    console.log("Renewable Energy Max:" + renewableEnergyMax);
    console.log("Low Carbon Max:" + lowCarbonEnergyMax);

    /* Iteration durch alle Datensätze, um den Radius (Bevälkerungsdichte) und
    die x- und y-Position für jedes Land zu ermitteln. */
    mergedCountryDatacountryData.forEach(country => {



        //Längen- und Breitengrad werden in x- und y-Position umgerechnet
        const x = gmynd.map(iso_code.longitude, -180, 180, 0, stageWidth);
        const y = gmynd.map(iso_code.latitude, -90, 90, stageHeight, 0);

        let dotFossil = $('<div></div>');

        dotFossil.addClass('dotFossil')

        dotFossil.css({
            'height': r,
            'width': r,
            'background-color': 'white',
            'position': 'absolute',
            'left': x,
            'top': y,
            'border-radius': '50%'
        });
        renderer.append(dotFossil);

        
        let dotRenewable = $('<div></div>');

        dotRenewable.addClass('dotRenewable')

       dotRenewable.css({
            'height': r,
            'width': r,
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
            'height': r,
            'width': r,
            'background-color': 'white',
            'position': 'absolute',
            'left': x,
            'top': y,
            'border-radius': '50%'
        });
        renderer.append(dotLowCarbon);

    });
}
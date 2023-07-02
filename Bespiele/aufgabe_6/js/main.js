let stage;
let stageHeight;
let stageWidth;
let groupedByContinent, cumulatedByContinent;
let toggleViewButton = $('#toggleViewButton');
let toggleViewCheck;

// Farb-Array für die Einwohnerzahl-Codierung
const colors = ["255, 0, 0", "0, 255, 0", "0, 0, 255"];

$(function () {
    stage = $('#renderer')
    stageHeight = stage.innerHeight();
    stageWidth = stage.innerWidth();
    prepareData();
    drawMap();

    toggleViewButton.click(toggleView);
});

function prepareData() {
    // positionData.forEach(posCountry => {
    //     populationData.forEach(popCountry => {
    //         if (posCountry.alpha3Code === popCountry.alpha3Code) {
    //             posCountry.population = popCountry.population;
    //         }
    //     });
    // });

    // Position, Population und Kontinentdaten mergen
    data = gmynd.mergeData(positionData, populationData, "alpha3Code");
    data = gmynd.mergeData(data, continentData, "alpha3Code", "iso3");

    // Unwichtige Eigenschafte löschen
    gmynd.deletePropsInData(data, ["iso3", "iso2", "number"]);

    let calculations = [
        {
            value: 'population',
            method: 'Sum',
            title: 'totalPopulation'
        },
        {
            value: 'population',
            method: 'Average'
        },
        {
            value: 'population',
            method: 'Min'
        },
        {
            value: 'population',
            method: 'Max'
        }
    ];

    /* Beispiel für das Kumulieren */
    cumulatedByContinent = gmynd.cumulateData(data, ["continent"], calculations);
    console.log(cumulatedByContinent);

    groupedByContinent = gmynd.groupData(data, "continent");

    /* Beispiel für das Filtern */
    let europeanCountries = gmynd.findAllByValue(data, "continent", "Europe");
    console.log(europeanCountries);
}

function drawMap() {
    toggleViewCheck = 'map';

    const populationMax = gmynd.dataMax(data, "population");
    data.forEach(country => {
        const area = gmynd.map(country.population, 0, populationMax, 5, 1000);

        /*  A = πr^2 
            r = sqrt(A/π) */
        const r = gmynd.circleRadius(area) * 2;

        const x = gmynd.map(country.longitude, -180, 180, 0, stageWidth);
        const y = gmynd.map(country.latitude, -90, 90, stageHeight, 0);

        let dot = $('<div></div>');
        dot.addClass("dot");

        dot.css({
            'height': r,
            'width': r,
            'left': x,
            'top': y,
            'background-color': 'rgb(' + getColor(country.population, populationMax) + ')'
        });

        $('#renderer').append(dot);
    });
}

function drawBarChart() {
    toggleViewCheck = 'bar';

    //Daten sortieren nach Gdp
    const compareByValue = (a, b) => b.value - a.value;

    data.sort(compareByValue)
    /* Breite und Kontinent mit max Anz. der an Ländern */
    const barWidth = 30;
    const continentCountryMax = gmynd.dataMax(cumulatedByContinent, 'count')

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

/* Funktion, um die Diagramme zu wechseln */
function toggleView() {

    /* Stage leeren */
    stage.empty();

    /*  Wenn vorher die Map aktiv war, die Funktion für das BarChart aufrufen.
        Wenn vorher das BarChart aktiv war, die Funktion für die Map aufrufen. */
    if (toggleViewCheck == 'map') {
        drawBarChart();
    } else {
        drawMap();
    }
}

function getColor(population, populationMax) {
    if (population < populationMax / 20) {
        return colors[0];
    } else if (population < populationMax / 2) {
        return colors[1];
    } else {
        return colors[2];
    }
}
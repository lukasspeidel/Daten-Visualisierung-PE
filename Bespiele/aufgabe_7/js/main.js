let stage;
let stageHeight;
let stageWidth;
let groupedByContinent;
let toggleViewButton = $('#toggleViewButton');
let isShowingMap;

const colors = ["#2a9d8f", "#e9c46a", "#e76f51"];

$(function () {
    stage = $('#renderer')
    stageHeight = stage.innerHeight();
    stageWidth = stage.innerWidth();

    prepareData();
    createElements();
    drawMap();

    toggleViewButton.click(toggleView);
});

function prepareData() {

    data = gmynd.mergeData(positionData, populationData, "alpha3Code");

    data = gmynd.mergeData(data, continentData, "alpha3Code", "iso3");

    groupedByContinent = gmynd.groupData(data, "continent");

    console.log(groupedByContinent);
}

function createElements() {
    /*  Hier werden die Berechnungen für die Länder (Kreise und Rechtecke gemacht).
        Als Grundgerüst habe ich die zwei Schleifen aus der Funktion drawBarChart 
        genommen.
        Erste Schleife (Kontinente) berechnet die x-Position des Bar-Charts.
        Zweite Schleife (Länder) berechnet die restlichen Parameter für Bar- und Map-Chart.
      */
    let indexContinents = 0;

    // Paramter: Bar-Chart
    const barH = 20;
    const barW = 200;

    // Hilfsvariable: Map
    const populationMax = gmynd.dataMax(data, "population");

    for (let continentName in groupedByContinent) {
        
        // Paramter: Bar-Chart
        let barX = indexContinents * barW * 2;

        /*  Alle Länder eines bestimmten Kontinents in einer Variable speichern,
            um durch diese Länder in der zweite Schleife zu iterieren. */
        let currentCountries = groupedByContinent[continentName];

        /* Iteration durch die Länder des Kontinents */
        currentCountries.forEach((country, j) => {

            /* Virutelles jQuery-Element erstellen und Klasse country hizufügen. */
            let dot = $('<div></div>');
            dot.addClass("country");

            let goodContinent = country.continent.replace(' ','');
            dot.attr('data-continent', goodContinent);
            
            // dot.addClass(goodContinent);

            // Paramter: Bar-Chart
            const barY = stageHeight - j * barH - barH;

            // Parameter: Map
            const area = gmynd.map(country.population, 0, populationMax, 10, 2000);
            const mapD = gmynd.circleRadius(area) * 2;
            const mapX = gmynd.map(country.longitude, -180, 180, 0, stageWidth);
            const mapY = gmynd.map(country.latitude, -90, 90, stageHeight, 0);

            // Hintergrundfarbe für beide Diagramme / Länder
            let color = getColor(country.population, populationMax);

            /*  Dem Land die Parameter als Daten-Objekt zuweisen.
                Somit bekommt jedes Land die nötigen Paramter für
                die Animation. */
            dot.data({
                continent: country.continent,
                barX: barX,
                barY: barY,
                barW: barW,
                barH: barH,
                mapX: mapX,
                mapY: mapY,
                mapH: mapD,
                mapW: mapD,
                color: color
            });

            stage.append(dot);
        });
        indexContinents++;
    }
}

function drawMap() {
    isShowingMap = true;

    /* jQuery-Objekte (Länder) iterieren (each-Schleife) */
    $('.country').each(function () {

        /*  Für das jeweile Land an der aktuellen Position in der Schleife (each-Schleife) 
            das Daten-Objekt auslesen und in einer Variable speichern. */
        let dotData = $(this).data();

        /* Hintergrundfarbe als Style setzen. Kann nicht animiert werden. */
        $(this).css({
            'background-color': dotData.color
        });

        /*  Ohne Animation: setzen von CSS-Style,
        $(this).css({
            'height': dotData.mapH,
            'width': dotData.mapW,
            'left': dotData.mapX,
            'top': dotData.mapY,
            'border-radius': '50%'
        }, 300);*/
        
        /* Mit Animation:
        Parameter mit den aktuellen werden zu den neuen Werte anmieren. */
        $(this).animate({
            'height': dotData.mapH,
            'width': dotData.mapW,
            'left': dotData.mapX,
            'top': dotData.mapY,
            /* Kreis: deshalb Border-Radius 50% */
            'border-radius': '50%'
        }, 1000);
    });
}

function drawBarChart() {
    isShowingMap = false;

    /* Gleich siehe drawMap-Funktion */
    $('.country').each(function () {
        let dotData = $(this).data();

        $(this).animate({
            'height': dotData.barH,
            'width': dotData.barW,
            'left': dotData.barX,
            'top': dotData.barY,
            /* Reckteck: Deshalb Border-Radius 0 */
            'border-radius': 0,
        }, 1000);
        
    });
}

function toggleView() {

    $("#clickLabel").removeClass("active");

    /* Stage leeren, wird nicht ausgeführt, da wir immer die selben Elemente nutzen */
    // stage.empty();

    if (isShowingMap) {
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
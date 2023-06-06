let stageHeight;
let stageWidth;
let renderer;

$(function () {
    renderer = $('#renderer');
    stageHeight = renderer.innerHeight();
    stageWidth = renderer.innerWidth();

    /* Funktion, um die Daten der Einwohnerzahl und der geografischen 
    Eigenschaften vorzubereiten. */
    prepareData();
    drawMap();
});

function prepareData() {

    /* Iteration durch die alle Datensätzen, Länder mit ihren Längen- und Breitengraden) */
    positionData.forEach(posCountry => {
        /* Iteration durch alle Datensätze, Länder mit der Bevölkerungszahl */
        populationData.forEach(popCountry => {
            /* Wenn der Ländercode übereinstimmt, wird die Eigenschaft 
            Bevölkerungszahl zu dem entsprechenden Land hinzugefügt. */
            if (posCountry.alpha3Code === popCountry.alpha3Code) {
                posCountry.population = popCountry.population;
            }
        });
    });
    console.log(positionData);
}

function drawMap() {
    /* Ausgabe wieviel Länder auf der Map zu sehen sind. */
    let countryCount = positionData.length;
    console.log(countryCount + " Länder im Datensatz");

    /* Land mit der größten Bevölkerungszahl wird ermittelt. */
    const populationMax = gmynd.dataMax(positionData, "population");
    console.log("population max: " + populationMax);

    /* Iteration durch alle Datensätze, um den Radius (Bevälkerungsdichte) und
    die x- und y-Position für jedes Land zu ermitteln. */
    positionData.forEach(country => {
        // Map rechnete eine Skala/Wertebereich auf die/den andere um.
        /* let mappedValue = gmynd.map(
        1. Der Wert, der umgerechnet werden soll
        2. Anfangswert des aktuellen Wertebereichs
        3. Endwert des aktuellen WB
        4. Anfangswert des neuen WB
        5. Endwert des neuen WB
        )*/

        /* Radius für Einwohnerzahl: Map 0 bis max Einwohnerzahl auf 2 bis 20 px */
        const r = gmynd.map(country.population, 0, populationMax, 2, 20);

        /* x-Position für longitude: Map -180 bis 180 auf 0 bis Breite */
        const x = gmynd.map(country.longitude, -180, 180, 0, stageWidth);

        /* y-Position für latitude. & Lat.: Map 90 bis -90 auf 0 bis Breite */
        const y = gmynd.map(country.latitude, 90, -90, 0, stageHeight);


        let dot = $('<div></div>');

        dot.addClass('dot')

        dot.css({
            'height': r,
            'width': r,
            'background-color': 'white',
            'position': 'absolute',
            'left': x,
            'top': y,
            'border-radius': '50%'
        });
        renderer.append(dot);
    });
}
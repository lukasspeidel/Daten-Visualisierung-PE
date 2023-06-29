let stageHeight;
let stageWidth;


$(function () {
    stageHeight = $('#renderer').innerHeight();
    stageWidth = $('#renderer').innerWidth();
    prepareData();
    drawMap();
});

function prepareData() {
    positionData.forEach(posCountry => {
        populationData.forEach(popCountry => {
            if (posCountry.alpha3Code === popCountry.alpha3Code) {
                posCountry.population = popCountry.population;
            }
        });
    });
}

function drawMap() {
    const populationMax = gmynd.dataMax(positionData, "population");
    positionData.forEach(country => {

        const area = gmynd.map(country.population, 0, populationMax, 5, 1000);
        const r = gmynd.circleRadius(area)

        const x = gmynd.map(country.longitude, -180, 180, 0, stageWidth);
        const y = gmynd.map(country.latitude, -90, 90, stageHeight, 0);

        let dot = $('<div></div>');
        dot.addClass("dot");

        /* Aufgabe #1: 3 Farben für Länder vergeben
        ============================================
            1. Farbe, Länder kleiner als %5 (Einwohnerzahl) vom größten Land
            2. Farbe, Länder zwischen %5 und 50% (Einwohnerzahl) vom größten Land
            3. Farbe, Länder größer, gleich 50% (Einwohnerzahl) vom größten Land
        */

        dot.css({
            'height': r,
            'width': r,
            'left': x,
            'top': y
        });

        /*  Click-Event für jedes Land individuell defnieren, da jedes Element einen individuellen Text hat.

            Wenn der Click-Event nur allgemeine Änderungen wie z. B. Styling auslösen soll, könnte man als 
            Selektor auch einmalig $('.country).click() verwenden. */
        dot.click(() => {
            /*  Alle Elemente mit der Klasse "clicked" werden selektiert und von diesen die Klasse "clicked" entfernt,
                somit wird der "click state / style" auf allen Elementen entfernt. */
            $(".clicked").removeClass("clicked");

            /*  Dem geklickten Element die Klasse "clicked" hinzufügen. */
            dot.addClass("clicked");

            /*  Dem geklickten Element den Text "Ländername: Einwohnerzahl" hinterlegen. */
            $("#clickLabel").text(country.country + ": " + country.population);
        });

        /*  Mouse-Event, wenn der Mauszeiger auf einen Kreis bewegt wird.
            Für jedes Land individuell defnieren, da jedes Element einen individuellen Text hat. */
        dot.mouseover(() => {
            /*  Dem gehoverten Element die Klasse "hover" hinzufügen. */
            dot.addClass("hover");

            /*  Dem gehoverten Element den Text "Ländernamen" hinterlegen. */
            $("#hoverLabel").text(country.country);
        });

        /* Mouse-Event, wenn der Mauszeiger einen Kreis verlässt */
        dot.mouseout(() => {
            /*  Dem gehoverten Element die Klasse "hover" entfernen. */
            dot.removeClass("hover");

            /*  Dem gehoverten Element den Text "Ländernamen" löschen. */
            $("#hoverLabel").text("");
        })

        $('#renderer').append(dot);
    });
}

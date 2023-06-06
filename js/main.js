let stageHeight;
let stageWidth;
let renderer;
r = 10;


$(function () {
    renderer = $('#renderer');
    stageHeight = renderer.innerHeight();
    stageWidth = renderer.innerWidth();

    /* Funktion, um die Daten der Einwohnerzahl und der geografischen 
    Eigenschaften vorzubereiten. */

    drawDots();
});


function drawDots() {


    /* Land mit der größten Bevölkerungszahl wird ermittelt. */
    const gdpMax = gmynd.dataMax(countryData, "energy_per_gdp");
    const energyMax = gmynd.dataMax(countryData, "primary_energy_consumption");
    console.log("Gdp Max:" + gdpMax);
    console.log("Energy Max:" + energyMax);

    /* Iteration durch alle Datensätze, um den Radius (Bevälkerungsdichte) und
    die x- und y-Position für jedes Land zu ermitteln. */
    countryData.forEach(country => {
        // Map rechnete eine Skala/Wertebereich auf die/den andere um.
        /* let mappedValue = gmynd.map(
        1. Der Wert, der umgerechnet werden soll
        2. Anfangswert des aktuellen Wertebereichs
        3. Endwert des aktuellen WB
        4. Anfangswert des neuen WB
        5. Endwert des neuen WB
        )*/



        /* x-Position für GDP */
        const x = gmynd.map(country.energy_per_gdp, 0, gdpMax, 0, stageWidth);

        /* y-Position für consumed energy */
        const y = gmynd.map(country.primary_energy_consumption, energyMax, 0, 0, stageHeight);


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
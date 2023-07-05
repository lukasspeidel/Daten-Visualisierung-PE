let stageHeight;
let stageWidth;
let renderer;
let isRendererOn;
let toggleViewButton;
let charts;
let clickLabel;
let sortcheck;

let btnPortions;

let biofuelMin;
let biofuelMax;
let gasMin;
let gasMax;
let coalMin;
let coalMax;
let oilMin;
let oilMax;
let nuclearMin;
let nuclearMax;
let hydroMin;
let hydroMax;
let solarMin;
let solarMax;
let windMin;
let windMax;

let chartLabel;
let chartLabelHeading, chartLabelParagraphGDP, chartLabelParagraphPop;

let view;
let buttons;

let isAscendingGDP = true;
let isAscendingPop = true;

const RADIUS_MIN = 1;
const RADIUS_MAX = 20;
const BAR_HEIGHT_MAX = 200;

// sh. style.css: --chart-width: calc(var(--bar-width) * 3 + var(--bars-margin-left) * 2);
const CHART_WIDTH = 56;
const CHART_SPACING = 70;
const CHART_PADDING_LEFT = 32;

const gdpMax = gmynd.dataMax(countryData, "GDP");
const overallEnergyMax = gmynd.dataMax(
	countryData,
	"primary_energy_consumption"
);
const fossilFuelEnergyMax = gmynd.dataMax(
	countryData,
	"fossil_fuel_consumption"
);
const renewableEnergyMax = gmynd.dataMax(countryData, "renewables_consumption");
const lowCarbonEnergyMax = gmynd.dataMax(countryData, "low_carbon_consumption");

const gdpMin = gmynd.dataMin(countryData, "GDP");
const overallEnergyMin = gmynd.dataMin(
	countryData,
	"primary_energy_consumption"
);
const fossilFuelEnergyMin = gmynd.dataMin(
	countryData,
	"fossil_fuel_consumption"
);
const renewableEnergyMin = gmynd.dataMin(countryData, "renewables_consumption");
const lowCarbonEnergyMin = gmynd.dataMin(countryData, "low_carbon_consumption");

let isRendererDisplayed;
let toShowClickLabel = false;

const isChartsOff = () => charts.css("display") === "none";
const isClickLabelOff = () => charts.css("display") === "none";

/* Funktion um Daten vorzubereiten Merge und delete */
function prepareData() {
	/* Maxima werden ermittelt */
	console.log("Gdp Min:" + gdpMin);
	console.log("Gdp Max:" + gdpMax);
	console.log("");
	console.log("Energy Min:" + overallEnergyMin);
	console.log("Energy Max:" + overallEnergyMax);
	console.log("");
	console.log("Fossil Fuel Min:" + fossilFuelEnergyMin);
	console.log("Fossil Fuel Max:" + fossilFuelEnergyMax);
	console.log("");
	console.log("Renewable Energy Min:" + renewableEnergyMin);
	console.log("Renewable Energy Max:" + renewableEnergyMax);
	console.log("");
	console.log("Low Carbon Max:" + lowCarbonEnergyMax);
	console.log("Low Carbon Min:" + lowCarbonEnergyMin);

	gmynd.sortData(countryData, "-GDP");
}

// Takes three radiuses and returns the position of the centers of the three circles
// as an object with keys x1, y1, x2, y2, x3, y3
// The center between the circles is at x:0, y:0

function calculatePositions(r1, r2, r3) {
	let d = r1 + r2;

	// intersection position
	let xi = ((r1 + r3) ** 2 - (r2 + r3) ** 2 + d ** 2) / (2 * d);
	let yi = Math.sqrt((r1 + r3) ** 2 - xi ** 2);

	let px = (r1 * xi) / (r1 + r3);
	let py = (r1 * -yi) / (r1 + r3);
	let vx = -py;
	let vy = px;

	// mid point of the three circles
	let mx = r1;
	let my = py + (vy * (r1 - px)) / vx;

	return { x1: -mx, y1: -my, x2: r2, y2: -my, x3: xi - mx, y3: -yi - my };
}

function drawMap() {
	isRendererOn = "map";

	countryData.forEach((iso_code) => {
		//Längen- und Breitengrad werden in x- und y-Position umgerechnet
		let x = gmynd.map(iso_code.longitude, -180, 180, 0, stageWidth);
		let y = gmynd.map(iso_code.latitude, -90, 90, stageHeight, 0);

		//Radien für Kreise mappen
		let r1 = gmynd.map(
			iso_code.fossil_fuel_consumption,
			fossilFuelEnergyMin,
			fossilFuelEnergyMax,
			RADIUS_MIN,
			RADIUS_MAX
		);
		let r2 = gmynd.map(
			iso_code.renewables_consumption,
			renewableEnergyMin,
			renewableEnergyMax,
			RADIUS_MIN,
			RADIUS_MAX / 7.1
		);
		let r3 = gmynd.map(
			iso_code.low_carbon_consumption,
			lowCarbonEnergyMin,
			lowCarbonEnergyMax,
			RADIUS_MIN,
			RADIUS_MAX / 6.15
		);
		// console.log(iso_code.country, r1, r2, r3);

		const circlePositions = calculatePositions(r1, r2, r3);

		let fossilCircle = $('<div class="circle"></div>');
		fossilCircle.addClass("fossilCircle");
		fossilCircle.css({
			height: Math.round(r1 * 2),
			width: Math.round(r1 * 2),
			"border-radius": "50%",
			position: "absolute",
			left: circlePositions.x1 + x,
			top: circlePositions.y1 + y,
		});
		fossilCircle.attr("data-value", Math.round(r1 * 2));
		fossilCircle.appendTo(renderer);
		fossilCircle.on("click", function () {
			console.log(this);

			$(".clicked").removeClass("clicked");

			$(this).addClass("clicked");

			$("#clickLabel").html(
				iso_code.country +
					"<br> Fossil Fuel Consumption: " +
					iso_code.fossil_fuel_consumption +
					"<br> Renewable Energy Consumption: " +
					iso_code.renewables_consumption +
					"<br> Low Carbon Consumption:" +
					iso_code.low_carbon_consumption
			);
		});

		let renewableCircle = $("<div class='circle'></div>");
		renewableCircle.addClass("renewableCircle");
		renewableCircle.css({
			height: Math.round(r2 * 2),
			width: Math.round(r2 * 2),
			"border-radius": "50%",
			position: "absolute",
			left: circlePositions.x2 + x,
			top: circlePositions.y2 + y,
		});
		renewableCircle.attr("data-value", Math.round(r2 * 2));
		renewableCircle.appendTo(renderer);
		renewableCircle.on("click", function () {
			console.log(this);

			$(".clicked").removeClass("clicked");

			$(this).addClass("clicked");

			$("#clickLabel").html(
				iso_code.country +
					"<br> Fossil Fuel Consumption: " +
					iso_code.fossil_fuel_consumption +
					"<br> Renewable Energy Consumption: " +
					iso_code.renewables_consumption +
					"<br> Low Carbon Consumption:" +
					iso_code.low_carbon_consumption
			);
		});

		let lowCarbonCircle = $("<div class='circle'></div>");
		lowCarbonCircle.addClass("lowCarbonCircle");
		lowCarbonCircle.css({
			height: Math.round(r3 * 2),
			width: Math.round(r3 * 2),
			"border-radius": "50%",
			position: "absolute",
			left: circlePositions.x3 + x,
			top: circlePositions.y3 + y,
		});
		lowCarbonCircle.attr("data-value", Math.round(r3 * 2));
		lowCarbonCircle.appendTo(renderer);
		lowCarbonCircle.on("click", function () {
			console.log(this);

			$(".clicked").removeClass("clicked");

			$(this).addClass("clicked");

			$("#clickLabel").html(
				iso_code.country +
					"<br> Fossil Fuel Consumption: " +
					iso_code.fossil_fuel_consumption +
					"<br> Renewable Energy Consumption: " +
					iso_code.renewables_consumption +
					"<br> Low Carbon Consumption:" +
					iso_code.low_carbon_consumption
			);
		});
	});
}

function toggleView() {
	/* Stage leeren */
	// renderer.empty();

	/*  Wenn vorher die Map aktiv war, die Funktion für das BarChart aufrufen.
        Wenn vorher das BarChart aktiv war, die Funktion für die Map aufrufen. */

	if (isRendererDisplayed) {
		view.show();
		renderer.hide();
	} else {
		view.hide();
		renderer.show();
	}

	isRendererDisplayed = !isRendererDisplayed;
}

function sortBars(sortCheck) {
	switch (sortCheck) {
		case "highestGDP":
			return gmynd.sortData(countryData, "GDP");
		case "lowestGDP":
			return gmynd.sortData(countryData, "-GDP");
		case "highestPopulation":
			return gmynd.sortData(countryData, "-population");
		case "lowestPopulation":
			return gmynd.sortData(countryData, "population");
	}
}

function sortChartsBy(attr, order) {
	switch (order) {
		case "ascending":
		case "ASC":
		case "asc": {
			return Array.from(document.querySelectorAll(".chart")).sort(
				(a, b) => +a.dataset[attr] - +b.dataset[attr]
			);
		}
		case "descending":
		case "DSC":
		case "dsc": {
			return Array.from(document.querySelectorAll(".chart")).sort(
				(a, b) => +b.dataset[attr] - +a.dataset[attr]
			);
		}
		default: {
			throw new Error("Invalid order: " + order);
		}
	}
}

$(function () {
	renderer = $("#renderer");
	stageHeight = renderer.innerHeight();
	stageWidth = renderer.innerWidth();

	view = $(".view");
	charts = $(".charts");
	buttons = $(".buttons");

	chartLabel = $(".chartLabel");
	chartLabelHeading = $("#label-h1");
	chartLabelParagraphGDP = $("#label-gdp");
	chartLabelParagraphPop = $("#label-population");

	toggleViewButton = $("#toggleViewButton");
	clickLabel = $("#clickLabel");

	biofuelMin = gmynd.dataMin(countryData, "biofuel_consumption"); // 0
	biofuelMax = gmynd.dataMax(countryData, "biofuel_consumption");

	gasMin = gmynd.dataMin(countryData, "gas_consumption"); // 0
	gasMax = gmynd.dataMax(countryData, "gas_consumption");

	coalMin = gmynd.dataMin(countryData, "coal_consumption"); // 0
	coalMax = gmynd.dataMax(countryData, "coal_consumption");

	oilMin = gmynd.dataMin(countryData, "oil_consumption"); // 0
	oilMax = gmynd.dataMax(countryData, "oil_consumption");

	nuclearMin = gmynd.dataMin(countryData, "nuclear_consumption"); // 0
	nuclearMax = gmynd.dataMax(countryData, "nuclear_consumption");

	hydroMin = gmynd.dataMin(countryData, "hydro_consumption"); // 0
	hydroMax = gmynd.dataMax(countryData, "hydro_consumption");

	solarMin = gmynd.dataMin(countryData, "solar_consumption"); // 0
	solarMax = gmynd.dataMax(countryData, "solar_consumption");

	windMin = gmynd.dataMin(countryData, "wind_consumption"); // 0
	windMax = gmynd.dataMax(countryData, "wind_consumption");

	// ###################################################

	prepareData();

	calculatePositions();

	drawMap();
	createChart();

	toggleViewButton.click(toggleView);

	const max = Math.max(
		fossilFuelEnergyMax,
		renewableEnergyMax,
		lowCarbonEnergyMax
	);

	isRendererDisplayed = true;
	view.hide();

	clickLabel.hide();
	// chartLabel.hide();

	$(".circle").on("mouseenter", function () {
		if (!toShowClickLabel) clickLabel.show();
	});
	$(".circle").on("mouseleave", function () {
		if (!toShowClickLabel) clickLabel.hide();
	});
	$(".circle").on("click", function () {
		toShowClickLabel = !toShowClickLabel;
	});

	btnPortions = $("#btn-portions");
	btnPortions.on("click", function () {
		$(this).toggleClass("selected");

		$(".bars").each(function () {
			let currentBars = $(this);
			currentBars.toggleClass(currentBars.attr("data-value"));
		});
		$(".bar").each(function () {
			let currentBar = $(this);
			currentBar.toggleClass(currentBar.attr("data-value"));
			currentBar.toggleClass("off");
		});
	});

	$("#sort-1").attr("data-order", isAscendingGDP ? "ASC" : "DSC");
	$("#sort-2").attr("data-order", isAscendingPop ? "ASC" : "DSC");

	btnSortings = $(".sorting button");
	btnSortings.on("click", function () {
		const currentButton = $(this);

		$(".sorting .selected").removeClass("selected");
		currentButton.addClass("selected");

		// GDP
		if (currentButton.attr("id") === "sort-1") {
			isAscendingGDP = !isAscendingGDP;
			// charts.addClass("clip-x");

			let order = isAscendingGDP ? "ASC" : "DSC";

			recalculatePositionsOf(
				sortChartsBy(currentButton.attr("data-attr"), order)
			);

			/* setTimeout(() => {
				charts.removeClass("clip-x");
			}, 1000); */

			currentButton.attr("data-order", order);
			charts.scrollLeft(0);
		} else {
			isAscendingPop = !isAscendingPop;
			// charts.addClass("clip-x");

			let order = isAscendingPop ? "ASC" : "DSC";

			recalculatePositionsOf(
				sortChartsBy(currentButton.attr("data-attr"), order)
			);

			/* setTimeout(() => {
				charts.removeClass("clip-x");
			}, 1000); */

			currentButton.attr("data-order", order);
			charts.scrollLeft(0);
		}
	});

	const allCharts = $(".chart");
	allCharts.on("mouseenter", function () {
		chartLabel.addClass("hovered");

		const currentChart = $(this);
		const _labelH1 = currentChart.attr("data-country");
		const _labelParagraphGDP = currentChart.attr("data-gdp");
		const _labelParagraphPop = currentChart.attr("data-population");

		chartLabelHeading.text(_labelH1);
		chartLabelParagraphGDP.text(_labelParagraphGDP);
		chartLabelParagraphPop.text(_labelParagraphPop);

		// chartLabel.show();
	});
	allCharts.on("mouseleave", function () {
		chartLabel.removeClass("hovered");
		// chartLabel.hide();
	});
});

function recalculatePositionsOf(sortedCharts) {
	for (let i = 0; i < sortedCharts.length; i++) {
		const currentChart = $(sortedCharts[i]);

		$(currentChart).css({
			left: CHART_PADDING_LEFT + i * (CHART_WIDTH + CHART_SPACING),
		});
	}
}

// ####################################################################################
function createChart() {
	for (let i = 0; i < countryData.length; i++) {
		let iso_code = countryData[i];

		let valueBioFuel = gmynd.map(
			iso_code.biofuel_consumption,
			0,
			biofuelMax,
			0,
			BAR_HEIGHT_MAX
		);
		let valueGas = gmynd.map(
			iso_code.gas_consumption,
			0,
			gasMax,
			0,
			BAR_HEIGHT_MAX
		);
		let valueCoal = gmynd.map(
			iso_code.coal_consumption,
			0,
			coalMax,
			0,
			BAR_HEIGHT_MAX
		);
		let valueOil = gmynd.map(
			iso_code.oil_consumption,
			0,
			oilMax,
			0,
			BAR_HEIGHT_MAX
		);
		let valueNuclear = gmynd.map(
			iso_code.nuclear_consumption,
			0,
			nuclearMax,
			0,
			BAR_HEIGHT_MAX
		);
		let valueHydro = gmynd.map(
			iso_code.hydro_consumption,
			0,
			hydroMax,
			0,
			BAR_HEIGHT_MAX
		);
		let valueSolar = gmynd.map(
			iso_code.solar_consumption,
			0,
			solarMax,
			0,
			BAR_HEIGHT_MAX
		);
		let valueWind = gmynd.map(
			iso_code.wind_consumption,
			0,
			windMax,
			0,
			BAR_HEIGHT_MAX
		);

		const chart = $(`
			<div class="chart">
				<div id="bars-red" class="bars red" data-value="red">
					<div
						class="bar off"
						style="height: ${valueBioFuel}px"
						data-value="biofuel"
					></div>
					<div
						class="bar off"
						style="height: ${valueGas}px"
						data-value="gas"
					></div>
					<div
						class="bar off"
						style="height: ${valueCoal}px"
						data-value="coal"
					></div>
					<div
						class="bar off"
						style="height: ${valueOil}px"
						data-value="oil"
					></div>
				</div>

				<div id="bars-blue" class="bars blue" data-value="blue">
					<div
						class="bar off"
						style="height: ${valueNuclear}px"
						data-value="nuclear"
					></div>
					<div
						class="bar off"
						style="height: ${valueHydro}px"
						data-value="hydro"
					></div>
				</div>

				<div id="bars-green" class="bars green" data-value="green">
					<div
						class="bar off"
						style="height: ${valueSolar}px"
						data-value="solar"
					></div>
					<div
						class="bar off"
						style="height: ${valueWind}px"
						data-value="wind"
					></div>
				</div>
			</div>`);

		chart.attr("data-iso", iso_code.iso_code);
		chart.attr("data-country", iso_code.country);
		chart.attr("data-gdp", iso_code.GDP);
		chart.attr("data-population", iso_code.population);

		// Extrahiere die momentanen Dimensionen des Chartelements im DOM (also deiner Webseite)
		// const { width, height } = chart[0].getBoundingClientRect();
		chart.css({
			left: CHART_PADDING_LEFT + i * (CHART_WIDTH + CHART_SPACING),
		});
		charts.append(chart);
	}

	recalculatePositionsOf(
		sortChartsBy(
			// GDP
			$(".sorting .selected").attr("data-attr"),
			"DSC"
		)
	);
}

/**
 * Authors: Jerome Champigny & Josselin Muller
 * Company: Media Innovation Group
 * Project: 3D Graph
 *
 * Description: Set of helpers
 */

function isDate(x) {
    var scratch = new Date(x);
    return (scratch.toString() == "NaN" || scratch.toString() == "Invalid Date" || scratch.getFullYear() == "1970") ? false : true;
}

function isInt(x) {
    var y = parseInt(x);
    return (isNaN(y)) ? false : (x == y && x.toString() == y.toString());
}

function isString(x) {
    return typeof(x) == 'string';
}

// Get next 10 power
function getNextPowerOf(power, value)
{
    var k = 1;
    var i = 0;
    while (k < value)
    {
        k *= power;
        ++i;
    }
    return i;
}

// Determine if an object has a specific method / field
function has(obj, methodName)
{
    return (typeof obj[methodName] != "undefined");
}

// Get the log10 of the given value
Math.log10 = function(val) {
    return Math.log(val) / Math.log(10);
}

// Perform two date comparison add return smallest one
function getMinDate(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);

    return getMin(date1, date2);
}

function getMin(value1, value2) {
    return (value1 < value2) ? value1 : value2;
}

function getMinInt(value1, value2) {
    return getMin(parseInt(value1), parseInt(value2));
}

function getMaxInt(value1, value2) {
    return (parseInt(value1) > parseInt(value2)) ? value1 : value2;
}

// Return date delta in days between minDate and date
function getDatesDelta(minDate, date) {
    minDate = new Date(minDate);
    date = new Date(date);

    // get day delta
    return (date - minDate) / (60 * 60 * 24 * 1000);
}

// Generate random hexadecimal value
function getRandomColor(hooverColor) {
    var letters = '0123456789ABCDEF'.split('');
    var color = '0x';

    for (var i = 0; i < 6; i++)
        color += letters[Math.round(Math.random() * 15)];

    return (color == hooverColor) ? getRandomColor() : color;
}

function getGradientColor(min, max, value) {
    var m = max - min;
    var v = value - min;

    var maxColor = 0xFFFFFFFF;
    var minColor = 0xFF000000;

    return (max - v) / max * minColor + (v / max) * maxColor;
}

var colors = new Array();
function getCurveColor(curve) {
    if (Space.getColorsJSON()[curve].color != null)
        return Space.getColorsJSON()[curve].color;

    colors[curve] = getRandomColor(0xc10000);
    return colors[curve];
}

function appendLegendLine (geometries, data) {
    var extracted = new Array();

    if (Space.getNameForAxeIndex("constant", 0) != 0) {
        extracted = Space.getStringsJSON()["constant"];
    } else {
        for (var i = 0, j = 1; i < data.length; ++i) {
            if (data[i]['constant'] == j){
                extracted.push(data[i]['constant']);
                j++;
            }
        }
    }

    if (document.getElementById("legend").getElementsByTagName("ul")[0].childNodes.length == 1) {
        for (var i = 0; i < geometries.length; ++i) {
            var legend = document.createElement("li");

            var div = document.createElement("div");
            div.className = "legend_color_block";
            div.style.backgroundColor = geometries[i].color.replace("0x", "#");
            div.onclick = (function() {
                var current_i = i;
                return function() {
                    changeLegendBlockColor(current_i);
                    Space.hideGeometry(current_i);
                }
            })();

            var span = document.createElement("span");

            if (typeof extracted[i].name != "undefined")
                span.innerHTML = extracted[i].name;
            else
                span.innerHTML = Space.getAxes()['constant'] + " " + extracted[i];

            legend.appendChild(div);
            legend.appendChild(span);

            document.getElementById("legend").getElementsByTagName("ul")[0].appendChild(legend);
        }
    }
    else {
        for(var i = 0; i < document.getElementById("legend").getElementsByTagName("ul")[0].childElementCount; ++i) {
            if (document.getElementsByClassName("legend_color_block")[i].style.backgroundColor == "rgb(255, 255, 255)")
                Space.hideGeometry(i);
        }
    }
}

function changeLegendBlockColor(index) {
    document.getElementsByClassName("legend_color_block")[index].style.backgroundColor =
        (document.getElementsByClassName("legend_color_block")[index].style.backgroundColor == "rgb(255, 255, 255)")
            ? Space.getGeometries()[index].color.replace("0x", "#")
            : "#fff";
}

function displayLegend(type) {
    if (type == "terrain")
        $("#legend").fadeOut('slow', function() {});
    else
        $("#legend").fadeIn('slow', function() {});
}

function Color (red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
}

Color.prototype.toHexString = function () {
    this.rgbToHex();
    return "0x" + this.red + this.green + this.blue;
}
Color.prototype.componentToHex = function (c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
Color.prototype.rgbToHex = function (red, green, blue) {
    this.red = (red != null) ? this.componentToHex(red) : this.componentToHex(this.red);
    this.green = (green != null) ? this.componentToHex(green) : this.componentToHex(this.green);
    this.blue = (blue != null) ? this.componentToHex(blue) : this.componentToHex(this.blue);
}
Color.prototype.hexToRgb = function (hex) {
    var result = /^0x?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        console.error("[Color] bad hex format");
        return 0;
    }

    this.red = parseInt(result[1], 16);
    this.green = parseInt(result[2], 16);
    this.blue = parseInt(result[3], 16);
}

function getColorFromGradientPercentage(startColor, endColor, percentage) {
    var start = new Color(),
        end = new Color(),
        returnColor = new Color();

    start.hexToRgb(startColor);
    end.hexToRgb(endColor);

    returnColor.red = end.red - start.red;
    returnColor.green = end.green - start.green;
    returnColor.blue = end.blue - start.blue;

    returnColor.red = Math.round((returnColor.red * percentage) + start.red);
    returnColor.green = Math.round((returnColor.green * percentage) + start.green);
    returnColor.blue = Math.round((returnColor.blue * percentage) + start.blue);

    returnColor.rgbToHex();

    return returnColor;
}

function getUrlVars() {
    var map = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        map[key] = value;
    });
    return map;
}
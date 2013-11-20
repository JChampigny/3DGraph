/**
 * Authors: Jerome Champigny & Josselin Muller
 * Company: Media Innovation Group
 * Project: 3D Graph
 *
 * Description: Main class (Singleton) that handles all the
 * logic (update / draw),  * as well as the geometries creation
 * and the selection.
 */

THREE.Vector3.prototype.rawData = null;

var Space = (function() {
    var dataJSON = null,
        axes = new Array(),
        grid,
        highData = new Array(),
        min = new Array(),
        zoomableObjects = new Array(),
        geometryType = null,
        currentHighlightIndex = -1,
        currentHighlightData = null,
        displayFPS = (typeof getUrlVars()["fps"] != "undefined" && getUrlVars()["fps"] == 1) ? true : false;

    // Graphics
    var geometries = new Array();

    // Create graph container
    var containerWidth = document.width - 300;
    var container = document.createElement('div');
    container.id = "3dgraph";
    container.style.height = "100%";
    container.style.width = containerWidth + "px";
    container.style.position = "absolute";
    container.style.marginTop = "30px";
    container.style.zIndex = 0;
    document.body.appendChild(container);

    // Create, initialize camera  & et camera angle
    var camera = new GraphCamera();
    camera.create();

    // Initialize needed objects
    var scene = new THREE.Scene(),
        projector = new THREE.Projector();

    scene.add(camera.camera);

    // Initialize lights
    var ambientLight = new THREE.AmbientLight(Math.random() * 0x10);
    scene.add(ambientLight);

    var light = new THREE.DirectionalLight();
    light.position.set(0, 1000, 0);
    light.castShadow = true;
    scene.add(light);

    var light2 = new THREE.SpotLight();
    light2.position.set(8000, 8000, 8000);
    light2.castShadow = true;
    scene.add(light2);

    // Initialize renderer
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    camera.lookAt(scene.position);

    // Set event listener
    renderer.domElement.addEventListener('mousewheel', onDocumentMouseWheel, false);
    renderer.domElement.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);
    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
    renderer.domElement.oncontextmenu = onDocumentContextMenu;

    // Get data
    var communicator = new Communicator();
    communicator.setCallback(getMinMax);

    // FPS
    $(document).ready(function () {
        if (displayFPS) {
            $('#fps-counter').css({"display": "inline"});
        }
    })

    var startTime = Date.now();
    var lastFps = startTime;
    var framesPerSecond = 0;
    var frameCount = 0;
    var lastTime = Date.now();
    var elapsed = 0;
    var totalElapsedTime = 0;

    // Initialize hover div
    $('body').append("<div id='data_hover'></div>");
    var dataHoverDiv = $('#data_hover').css({"position": "absolute",
        "background-color": "white",
        "opacity": "0.6",
        "filter": "alpha(opacity=60)",
        "minwidth": "60px",
        "padding-left": "2px",
        "padding-right": "2px",
        "height": "45px",
        "pointer-events": "none",
        "border": "1px solid black",
        "text-align": "center",
        "left": "0px",
        "top": "0px",
        "display": "none",
        "-webkit-border-radius": "5px",
        "-moz-border-radius": "5px",
        "border-radius": "5px"
    });

    // Global settings
    var settings;
    var allowedTypes = new Array("curve", "barchart", "multibarchart", "terrain");

    ///////////////////
    // Private methods
    function getMinMax (data) {
        dataJSON = data;
        settings = dataJSON["settings"];
        axes = dataJSON['axes'];

        var scaleType = (settings === undefined || settings["scale"] == undefined) ? "linear" : settings["scale"];

        var valConstant, valZ, valY, i;

        // Search min value
        for (i = 0; i < dataJSON['data'].length; ++i) {
            valConstant = (isInt(dataJSON['data'][i].constant) || isDate(dataJSON['data'][i].constant)) ? dataJSON['data'][i].constant : dataJSON['data'][i].constant.id;
            valY = (isInt(dataJSON['data'][i].dataY) || isDate(dataJSON['data'][i].dataY)) ? dataJSON['data'][i].dataY : dataJSON['data'][i].dataY.id;
            valZ = (isInt(dataJSON['data'][i].dataZ) || isDate(dataJSON['data'][i].dataZ)) ? dataJSON['data'][i].dataZ : dataJSON['data'][i].dataZ.id;

            min[0] = !isInt(valConstant) && isDate(valConstant) ?  getMinDate(min[0], valConstant) : getMinInt(min[0], valConstant);
            min[1] = !isInt(valY) && isDate(valY) ? getMinDate(min[1], valY) : getMinInt(min[1], valY);
            min[2] = !isInt(valZ) && isDate(valZ) ? getMinDate(min[2], valZ) : getMinInt(min[2], valZ);
        }

        // Search max value
        for (i = 0; i < dataJSON['data'].length; ++i) {
            valConstant = (isInt(dataJSON['data'][i].constant) || isDate(dataJSON['data'][i].constant)) ? dataJSON['data'][i].constant : dataJSON['data'][i].constant.id;
            valY = (isInt(dataJSON['data'][i].dataY) || isDate(dataJSON['data'][i].dataY)) ? dataJSON['data'][i].dataY : dataJSON['data'][i].dataY.id;
            valZ = (isInt(dataJSON['data'][i].dataZ) || isDate(dataJSON['data'][i].dataZ)) ? dataJSON['data'][i].dataZ : dataJSON['data'][i].dataZ.id;

            highData[0] = !isInt(valConstant) && isDate(valConstant) ?  getMaxInt(highData[0], getDatesDelta(min[0], valConstant)) : getMaxInt(highData[0], valConstant);
            highData[1] = !isInt(valY) && isDate(valY) ?  getMaxInt(highData[1], getDatesDelta(min[1], valY)) : getMaxInt(highData[1], valY);
            highData[2] = !isInt(valZ) && isDate(valZ) ?  getMaxInt(highData[2], getDatesDelta(min[2], valZ)) : getMaxInt(highData[2], valZ);
        }

        if (typeof grid == "undefined") {
            grid = new Grid();
            grid.create(scaleType);

            var tallest = ((grid.x >= grid.y) ? ((grid.x >= grid.z) ? grid.x : grid.z) : grid.y) * 1.3;
            var position = new THREE.Vector3(tallest, tallest, tallest);

            var lookAtPos = new THREE.Vector3(
                (grid.x >= grid.y) ? grid.x * 2 / 3: ((grid.x >= grid.z) ? grid.x * 2 / 3 : 0),
                (grid.y > grid.x) ? grid.y / 2 : ((grid.y > grid.z) ? grid.y / 2 : 0),
                (grid.z >= grid.x) ? grid.z / 3 : ((grid.z >= grid.y) ? grid.z / 3 : 0)
            );

            camera.setPositionAndTarget(position, lookAtPos, true);
        }

        if (settings === undefined || settings["type"] === undefined || allowedTypes.indexOf(settings["type"]) == -1) {
            buildGeometries("barchart");
        }
        else {
            buildGeometries(settings["type"]);
        }

        Space.render();
        lastTime = Date.now();
        Space.animate();
    }

    function extractData(data) {
        var array = new Array();

        if (isInt(data.constant))
            array[0] = data.constant - min[0];
        else if (isDate(data.constant))
            array[0] = getDatesDelta(min[0], data.constant);
        else
            array[0] = data.constant.id - min[0];

        if (isInt(data.dataY))
            array[1] = data.dataY;
        else if (isDate(data.dataY))
            array[1] = getDatesDelta(min[1], data.dataY);
        else
            array[1] = data.dataY.id;

        if (isInt(data.dataZ))
            array[2] = data.dataZ - min[2];
        else if (isDate(data.dataZ))
            array[2] = getDatesDelta(min[2], data.dataZ);
        else
            array[2] = data.dataZ.id - min[2];

        return array;
    }

    function buildGeometries(requestedGeometryType) {

        geometryType = requestedGeometryType;

        var multiplierY = grid.precisionY;
        var multiplierZ = grid.precisionZ;

        var data = null;
        var previousData = null;

        var geo =
            geometryType == "curve"         ? new CurveGeometry() :
            geometryType == "barchart"      ? new BarChartGeometry() :
            geometryType == "multibarchart" ? new MultiBarChartGeometry() :
                                              new TerrainGeometry();

        if (typeof dataJSON['colors'] != "undefined") {
            if (has(geo, "setColors"))
                geo.setColors(dataJSON['colors']);
            else
                geo.color = dataJSON['colors'][0].color;
        }


        var width = new Array(),
            total = 0;

        for (var i = 0, j = 0; i < dataJSON['data'].length; i++, previousData = data) {
            data = extractData(dataJSON['data'][i]);

            // Create new Geo if data is a new data
            if (i > 1 && previousData != 0 && data[0] != previousData[0]) {
                if (geometryType == "terrain" && previousData[2] != highData[2]) {
                    geo.finishLine(previousData, multiplierZ, j);
                }

                ++j;

                if (width == 0) {
                    width.push(geo.geometry.vertices.length);
                    total = geo.geometry.vertices.length;
                } else {
                    width.push(geo.geometry.vertices.length - total);
                    total = geo.geometry.vertices.length;
                }

                if (!geo.isUniqueGeometry()) {
                    geometries.push(geo);
                    geo =
                        geometryType == "curve"         ? new CurveGeometry() :
                        geometryType == "barchart"      ? new BarChartGeometry() :
                        geometryType == "multibarchart" ? new MultiBarChartGeometry() :
                                                          new TerrainGeometry();

                    if (typeof dataJSON['colors'] != "undefined")
                        geo.color = dataJSON['colors'][j].color;
                }
            }

            geo.build(previousData, data, multiplierY, multiplierZ, dataJSON['data'][i], j);
        }

        if (geometryType == "terrain" && previousData[2] != highData[2]) {
            geo.finishLine(previousData, multiplierZ, j);
        }

        width.push(geo.geometry.vertices.length - total);

        geometries.push(geo);

        ++j;

        for (i = 0; i < geometries.length; ++i){
            geometries[i].buildFaces(j, width);
            geometries[i].finalize();

            if (has(geometries[i], "objects"))
            {
                var objs = geometries[i].objects;
                for (var oIndex = 0; oIndex < objs.length; ++oIndex)
                    zoomableObjects.push(objs[oIndex]);
                console.log("ZoomableObjects: " + zoomableObjects.length);
                console.log("Objects: " + objs.length);
            }
            else
                zoomableObjects.push(geometries[i].object);
        }


        if (geometryType != "terrain") {
            appendLegendLine(geometries, dataJSON['data']);
        }

        displayLegend(geometryType);

        if (!grid.init)
        {
            grid.createLines();
            grid.createLegends();
            grid.init = true;
        }

        $("body").removeClass("loading");
    }

    //////////////////
    // Public methods
    return {
        getScene: function() {
            return scene;
        },
        getGrid: function() {
            return grid;
        },
        getRenderer: function() {
            return renderer;
        },
        getCamera: function() {
            return camera;
        },
        getProjector: function() {
            return projector;
        },
        getZoomableObjects: function() {
            return zoomableObjects;
        },
        getMinData: function() {
            return min;
        },
        getHighData: function() {
            return highData;
        },
        getCommunicator: function() {
            return communicator;
        },
        getDataJSON: function() {
            return dataJSON['data'];
        },
        getColorsJSON: function() {
            return dataJSON['colors'];
        },
        getStringsJSON: function() {
            if (typeof dataJSON['strings'] == "undefined")
                return [];

            return dataJSON['strings'];
        },
        getAxes: function() {
            return axes;
        },
        getNameForAxeIndex: function(axe, index) {
            if (axe != "constant" && axe != "dataY" && axe != "dataZ") {
                console.error(axe + " is not a valid axe");
                throw 0;
            }

            if (typeof dataJSON["strings"] == "undefined" || typeof dataJSON["strings"][axe] == "undefined")
                return 0;

            if (dataJSON["strings"][axe].length < index) {
                console.error("index " + index + " is out of bound for " + axe);
                throw 0;
            }

            return dataJSON["strings"][axe][index].name;
        },
        getGeometries: function() {
            return geometries;
        },
        animate: function() {

            var timestamp = Date.now();
            elapsed = timestamp - lastTime;
            lastTime = timestamp;
            totalElapsedTime += elapsed;

            if (displayFPS) {
                // Update FPS if a second or more has passed since last FPS update
                if(timestamp - lastFps >= 500) {
                    framesPerSecond = frameCount;
                    frameCount = 0;
                    lastFps = timestamp;

                    document.getElementById("fps").innerHTML = framesPerSecond;
                }
                ++frameCount;
            }

            if (totalElapsedTime > 300)
            {
                for (var i = 0; i < geometries.length; ++i)
                {
                    if (has(geometries[i], "update"))
                        geometries[i].update(elapsed);
                    else
                    {
                        var geo = geometries[i].geometry;
                        for (var j = 0; j < geo.vertices.length; ++j)
                        {
                            var v = geo.vertices[j];
                            var vDy = v.rawData;

                            if (v.y < vDy)
                            {
                                geo.vertices[j].y += elapsed / 2;
                                geo.verticesNeedUpdate = true;

                                if (geo.vertices[j].y > vDy)
                                    geo.vertices[j].y = vDy;
                            }
                        }
                    }
                }
            }

            Space.render();
            window.requestAnimationFrame(Space.animate, renderer.domElement);
        },
        render: function() {

            camera.update();

            renderer.clear();
            renderer.render(scene, camera.camera);
        },
        highlightPoint: function(intersect) {

            var point = intersect.point;
            var offsetX = Space.getGrid().offset;

            // Barchart & curve Highlight
            if (geometryType == "barchart" || geometryType == "curve")
            {
                var dataSetIndex = Math.floor(Math.round(point.x) / (offsetX * 2));

                if (dataSetIndex != currentHighlightIndex) {
                    for (var i = 0; i < geometries.length; ++i)
                        geometries[i].resetHighlights();
                }

                currentHighlightIndex = dataSetIndex;

                if (dataSetIndex >= 0 && dataSetIndex < geometries.length) {
                    currentHighlightData = geometries[dataSetIndex].highlightPointedData(point);

                    if (currentHighlightData.changed)
                    {
                        var pointedData = currentHighlightData.data;

                        var x = pointedData[0];
                        var y = pointedData[1];
                        var z = pointedData[2];

                        var nX = isInt(x) ? x : isDate(x) ? getDatesDelta(min[0], x) : x;
                        var nY = isInt(y) ? y : isDate(y) ? getDatesDelta(min[1], y) : y;
                        var nZ = isInt(z) ? z : isDate(z) ? getDatesDelta(min[2], z) : z;

                        //Highlight legend
                        if (typeof document.getElementsByClassName("highlight")[0] != "undefined") {
                            document.getElementsByClassName("highlight")[0].className = "";
                        }

                        document.getElementById("legend").getElementsByTagName("li")[dataSetIndex].className = "highlight";

                        grid.lineHover(nX + 1, nY, nZ);

                        this.updateHighlightedDataHover();
                    }
                }
            }

            else if (geometryType == "multibarchart")
            {
                var dataSetIndex = 0;

                if (dataSetIndex != currentHighlightIndex) {
                    for (var i = 0; i < geometries.length; ++i)
                        geometries[i].resetHighlights();
                }

                currentHighlightIndex = dataSetIndex;

                if (dataSetIndex >= 0 && dataSetIndex < geometries.length) {
                    currentHighlightData = geometries[dataSetIndex].highlightPointedData(point);

                    if (currentHighlightData.changed)
                    {
                        var pointedData = currentHighlightData.data;

                        var x = pointedData[0];
                        var y = pointedData[1];
                        var z = pointedData[2];

                        var nX = isInt(x) ? x : isDate(x) ? getDatesDelta(min[0], x) : x;
                        var nY = isInt(y) ? y : isDate(y) ? getDatesDelta(min[1], y) : y;
                        var nZ = isInt(z) ? z : isDate(z) ? getDatesDelta(min[2], z) : z;

                        //Highlight legend
                        if (typeof document.getElementsByClassName("highlight")[0] != "undefined") {
                            document.getElementsByClassName("highlight")[0].className = "";
                        }

                        document.getElementById("legend").getElementsByTagName("li")[dataSetIndex].className = "highlight";

                        grid.lineHover(nX + 1, nY, nZ);

                        this.updateHighlightedDataHover();
                    }
                }
            }

            else
                grid.hideLineHover();
        },
        updateHighlightedDataHover: function() {

            if (currentHighlightData == null || currentHighlightData.hoverPosition3D == null)
                return;

            var jqdiv = $('#3dgraph');
            var vec3D = currentHighlightData.hoverPosition3D.clone();
            var p2DOffset = projector.projectVector(vec3D, Space.getCamera().camera);

            var p2D = { x: ( p2DOffset.x + 1 ) * window.innerWidth / 2 + jqdiv.offset().left,
                        y: ( - p2DOffset.y + 1) * window.innerHeight / 2 + jqdiv.offset().top };

            var currentDataText = new Array(),
                axeString;

            if (typeof currentHighlightData.realData[0] == "undefined") {
                axeString = this.getNameForAxeIndex("constant", currentHighlightIndex);
                currentDataText.push((axeString != 0) ? axeString : currentHighlightData.realData.constant);
                axeString = this.getNameForAxeIndex("dataY", currentHighlightIndex);
                currentDataText.push((axeString != 0) ? axeString : currentHighlightData.realData.dataY);
                axeString = this.getNameForAxeIndex("dataZ", currentHighlightData.indexZ);
                currentDataText.push((axeString != 0) ? axeString : currentHighlightData.realData.dataZ);

                var hoverText = "<strong>" + dataJSON['axes'].constant + ":</strong> " + currentDataText[0] + "<br />"
                              + "<strong>" + dataJSON['axes'].dataY + ":</strong> " + currentDataText[1] + "<br />"
                              + "<strong>" + dataJSON['axes'].dataZ + ":</strong> " + currentDataText[2];

                var divWidth = dataHoverDiv.width();

                dataHoverDiv.html(hoverText);
                dataHoverDiv.css({"display": "block",
                                  "left": (p2D.x - divWidth / 2) + "px",
                                  "top": (p2D.y - 60) + "px"});
            } else {
                dataHoverDiv.css({"display": "none"});
            }
        },
        clearGeometries: function() {
            for (var i = 0; i < geometries.length; ++i){
                geometries[i].resetHighlights();
                geometries[i].remove();
            }
            geometries = new Array();
            zoomableObjects = new Array();

            grid.hideLineHover();
            dataHoverDiv.css({"display": "none"});
            currentHighlightData = null;
        },
        switchGeometryType: function(type) {
            console.log("Switch geometry type to: " + type);
            //$("body").addClass("loading");
            this.clearGeometries();
            buildGeometries(type);
        },
        hideGeometry: function(index) {
            var geo = this.getGeometries()[index];

            geo.resetHighlights();

            if (((grid.hoverLineC.position.x / grid.precisionX) / 2) == index) {
                grid.lineHover(1, 0, 0);
                dataHoverDiv.css({"display": "none"});
                document.getElementById("legend").getElementsByTagName("li")[index].className = "";
                currentHighlightData = null;
            }

            if (geo != null)
                geo.object.visible = (geo.object.visible) ? false : true;

            if (geo.object != null) {
                for (var i = 0; i < geo.object.children.length; ++i)
                    if (typeof geo.object.children[i] != "undefined")
                        geo.object.children[i].visible = (geo.object.children[i].visible) ? false : true;

                // Vertices to 0
                for (var i = 0; i < geo.geometry.vertices.length; ++i) {
                    var v = geo.geometry.vertices[i];
                    v.y = 0;
                }
            }
        }
    }
})();
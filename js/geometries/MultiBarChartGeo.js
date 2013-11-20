/**
 * Authors: Jerome Champigny & Josselin Muller
 * Company: Media Innovation Group
 * Project: 3D Graph
 *
 * Description: MultipleBarChart geometry class
 */

function MultiBarChartGeometry () {
    this.dataSetIndex = 0;
    this.dataJSON = null;
    this.color = getRandomColor(0xc10000);;
    this.colors = null;

    this.multiplierY = null;
    this.multiplierZ = null;

    this.dataMap = new Array();
    this.realDataMap = new Array();

    this.heightMap = new Array();
    this.geometry = null;
    this.geometries = new Array();
    this.objects = new Array();

    this.highlightGeometry = null;
    this.highlightMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFFFF, wireframe: false, wireframeLinewidth: 30, transparent: true, opacity: 0.6});
}

MultiBarChartGeometry.prototype.setColors = function(colors) {
    this.color = colors[0].color;
    this.colors = colors;
}

MultiBarChartGeometry.prototype.isUniqueGeometry = function() {
    return true;
}

MultiBarChartGeometry.prototype.build = function (previousData, data, multiplierY, multiplierZ, dataJSON, dataSetIndex) {

    // Add previous geometry
    if (dataSetIndex != this.dataSetIndex && this.geometry != null)
    {
        this.geometries.push(this.geometry);
        this.geometry = null;
    }

    // Create new geometry
    if (this.geometry == null)
        this.geometry = new THREE.Geometry();

    this.dataSetIndex = dataSetIndex;
    this.dataJSON = dataJSON;

    this.multiplierY = multiplierY;
    this.multiplierZ = multiplierZ;

    if (!(dataSetIndex in this.dataMap))
    {
        this.dataMap[dataSetIndex] = new Array();
        this.realDataMap[dataSetIndex] = new Array();
    }

    var zIndex = data[2];

    this.dataMap[dataSetIndex][zIndex] = data;
    this.realDataMap[dataSetIndex][zIndex] = dataJSON;

    var lastY = (zIndex in this.heightMap ? this.heightMap[zIndex] : 0);
    var lastYHeight = lastY * multiplierY;
    this.heightMap[zIndex] = lastY + parseInt(data[1]);

    var offset = dataSetIndex;

    // Top
    this.addVertex(0, lastYHeight + data[1] * multiplierY, zIndex * multiplierZ, offset);
    this.addVertex(0, lastYHeight + data[1] * multiplierY, (zIndex + 1) * multiplierZ, offset);
    this.addVertex(Space.getGrid().offset, lastYHeight + data[1] * multiplierY, (zIndex + 1) * multiplierZ, offset);
    this.addVertex(Space.getGrid().offset, lastYHeight + data[1] * multiplierY, zIndex * multiplierZ, offset);

    // Bottom
    this.addVertex(0, lastYHeight, zIndex * multiplierZ, offset);
    this.addVertex(0, lastYHeight, (zIndex + 1) * multiplierZ, offset);
    this.addVertex(Space.getGrid().offset, lastYHeight, (zIndex + 1) * multiplierZ, offset);
    this.addVertex(Space.getGrid().offset, lastYHeight, zIndex * multiplierZ, offset);
}

MultiBarChartGeometry.prototype.addVertex = function (x, y, z, offset) {

    var l = this.geometry.vertices.length;
    this.geometry.vertices.push(new THREE.Vector3(x, offset, z));

    var v = this.geometry.vertices[l];
    v.rawData = y;
    return v;
}

MultiBarChartGeometry.prototype.buildFaces = function (nbDataSet, dataWidth) {

    // Add last geometry
    this.geometries.push(this.geometry);

    console.log("Nb geometries: " + this.geometries.length);

    // Build faces
    for (var geoIndex = 0; geoIndex < this.geometries.length; ++geoIndex)
    {
        var geo = this.geometries[geoIndex];
        var nbVertex = 0;

        for (var i = 0; i < geo.vertices.length / 8; ++i)
        {
            geo.faces.push(new THREE.Face4(nbVertex, nbVertex + 1, nbVertex + 2, nbVertex + 3)); // Top
            geo.faces.push(new THREE.Face4(nbVertex + 1, nbVertex, nbVertex + 4, nbVertex + 5)); // Forward
            geo.faces.push(new THREE.Face4(nbVertex, nbVertex + 3, nbVertex + 7, nbVertex + 4)); // Right
            geo.faces.push(new THREE.Face4(nbVertex + 3, nbVertex + 2, nbVertex + 6, nbVertex + 7)); // Backward
            geo.faces.push(new THREE.Face4(nbVertex + 2, nbVertex + 1, nbVertex + 5, nbVertex + 6)); // Left

            for (var x = 0; x < 5; ++x){
                for (var y = 0; y < 4; ++y){
                    geo.faces[i * 5 + x].vertexColors[y] = new THREE.Color(this.colors[geoIndex].color);
                }
            }

            nbVertex += 8;
        }

        geo.computeCentroids();
        geo.computeFaceNormals();
        geo.computeVertexNormals();
    }
}

MultiBarChartGeometry.prototype.finalize = function () {

    // Build objects
    for (var geoIndex = 0; geoIndex < this.geometries.length; ++geoIndex)
    {
        var geo = this.geometries[geoIndex];
        geo.dynamic = true;

        var object = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({vertexColors: THREE.VertexColors}));
        object.dynamic = true;
        object.doubleSided = true;

        // Add to scene
        Space.getScene().add(object);

        this.objects.push(object);
    }
}

MultiBarChartGeometry.prototype.getPointedDataZIndex = function (point) {

    var offsetZ = this.multiplierZ;

    var index = Math.floor(point.z / offsetZ);

    /*if (index >= this.dataMap.length)
        index = this.dataMap.length - 1;
    else if (index > 0)
    {
        if (index in this.dataMap)
        {
            var data = this.dataMap[index];
            var y = Space.getGrid().getYAxisValue(data[1]);

            if (point.y > y)
                --index;
        }
        else
            --index;
    }*/

    return index;

}

MultiBarChartGeometry.prototype.getPointedDataSetIndex = function (point, indexZ) {

    for (var i = 0; i < this.dataMap.length; ++i)
    {
        var data = this.dataMap[i];
        if (!(indexZ in data))
            continue;

        var Y = data[1] * this.multiplierY;
        if (point.y < Y)
            return i;
    }
    return -1;
}

MultiBarChartGeometry.prototype.highlightPointedData = function (point) {

    var indexZ = this.getPointedDataZIndex(point);
    var dataIndex = this.getPointedDataSetIndex(point, indexZ);

    //console.log("IndexZ: " + indexZ);
    console.log("DataSetIndex: " + dataIndex);

    return {data: null, realData: null, hoverPosition3D: null, indexZ:0, changed: false};

    if (!(index in this.dataMap))
        return {data: null, realData: null, hoverPosition3D: null, indexZ:index, changed: false};

    var data = this.dataMap[index];
    var realData = this.realDataMap[index];

    //console.log("PointZ: " + point.z);
    //console.log("Index: " + index);

    // Floating div
    var p3D = new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 + (Space.getGrid().offset + 1) / 2,
        Space.getGrid().getYAxisValue(data[1]),
        data[2] * this.multiplierZ + 1 + this.multiplierZ / 2);

    if (this.highlightGeometry != null)
    {
        // Remove old geometry
        if (this.highlightGeometry.index != index)
        {
            Space.getScene().remove(this.highlightGeometry.object);
        }

        else
            return {data: data, realData: realData, hoverPosition3D: p3D, indexZ:index, changed: false};
    }

    this.highlightGeometry = { index: index, object: null};
    var geometry = new THREE.Geometry();

    //console.log(data);

    // Top
    geometry.vertices.push(new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 - 1, Space.getGrid().getYAxisValue(data[1]) + 1, data[2] * this.multiplierZ - 1));
    geometry.vertices.push(new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 - 1, Space.getGrid().getYAxisValue(data[1]) + 1, (data[2] + 1) * this.multiplierZ + 1));
    geometry.vertices.push(new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 + Space.getGrid().offset + 1, Space.getGrid().getYAxisValue(data[1]) + 1, (data[2] + 1) * this.multiplierZ + 1));
    geometry.vertices.push(new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 + Space.getGrid().offset + 1, Space.getGrid().getYAxisValue(data[1]) + 1, data[2] * this.multiplierZ - 1));

    // Bottom
    geometry.vertices.push(new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 - 1, 0, data[2] * this.multiplierZ - 1));
    geometry.vertices.push(new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 - 1, 0, (data[2] + 1) * this.multiplierZ + 1));
    geometry.vertices.push(new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 + Space.getGrid().offset + 1, 0, (data[2] + 1) * this.multiplierZ + 1));
    geometry.vertices.push(new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 + Space.getGrid().offset + 1, 0, data[2] * this.multiplierZ - 1));

    geometry.faces.push(new THREE.Face4(0, 1, 2, 3)); // Top
    geometry.faces.push(new THREE.Face4(1, 0, 4, 5)); // Forward
    geometry.faces.push(new THREE.Face4(0, 3, 7, 4)); // Right
    geometry.faces.push(new THREE.Face4(3, 2, 6, 7)); // Backward
    geometry.faces.push(new THREE.Face4(2, 1, 5, 6)); // Left

    geometry.computeCentroids();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    this.highlightGeometry.object = new THREE.Mesh(geometry, this.highlightMaterial);
    Space.getScene().add(this.highlightGeometry.object);

    return {data: data, realData: realData, hoverPosition3D: p3D, indexZ:index, changed: true};
}

MultiBarChartGeometry.prototype.resetHighlights = function () {

    if (this.highlightGeometry != null)
    {
        Space.getScene().remove(this.highlightGeometry.object);
        this.highlightGeometry = null;
    }

}

MultiBarChartGeometry.prototype.update = function (elapsed) {

    for (var i = 0; i < this.geometries.length; ++i)
    {
        var geo = this.geometries[i];
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

MultiBarChartGeometry.prototype.remove = function () {

    for (var i = 0; i < this.objects.length; ++i)
    {
        Space.getScene().remove(this.objects[i]);
    }
}
/**
 * Authors: Jerome Champigny & Josselin Muller
 * Company: Media Innovation Group
 * Project: 3D Graph
 *
 * Description: Curve geometry class
 */

function CurveGeometry () {
    this.geometry = new THREE.Geometry();
    this.color = getRandomColor(0xc10000);
    this.name = "";
    this.object = null;
    this.nbVertex = 0;
    this.dataJSON = null;

    this.multiplierY = null;
    this.multiplierZ = null;

    this.dataMap = new Array();
    this.realDataMap = new Array();

    this.highlightGeometry = null;
    this.highlightMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFFFF, wireframe: true, wireframeLinewidth: 30, transparent: true, opacity: 0.6});
}

CurveGeometry.prototype.isUniqueGeometry = function() {
    return false;
}

CurveGeometry.prototype.build = function (previousData, data, multiplierY, multiplierZ, dataJSON, dataSetIndex) {

    this.dataSetIndex = dataSetIndex;
    this.dataJSON = dataJSON;

    this.multiplierY = multiplierY;
    this.multiplierZ = multiplierZ;

    this.dataMap[data[2]] = data;
    this.realDataMap[data[2]] = dataJSON;

    var i = this.geometry.vertices.length;

    if (previousData != null && data[2] - 1 > previousData[2]) {
        for (var k = 1; data[2] != previousData[2] + k; ++k) {

            var customData = new Array();
            customData[0] = dataSetIndex;
            customData[1] = 0;
            customData[2] = previousData[2] + k;

            this.dataMap[customData[2]] = customData;
            this.realDataMap[customData[2]] = customData;

            this.geometry.vertices.push(new THREE.Vector3(
                (this.dataSetIndex * Space.getGrid().offset * 2),
                -10,
                (previousData[2] + k) * multiplierZ
            ));
            this.geometry.vertices.push(new THREE.Vector3(
                (this.dataSetIndex * Space.getGrid().offset * 2),
                0,
                (previousData[2] + k) * multiplierZ
            ));
            this.geometry.vertices[i++].rawData = -1;
            this.geometry.vertices[i++].rawData = 0;
        }
    }

    // Set bottom vertice
    this.geometry.vertices.push(new THREE.Vector3(
        (this.dataSetIndex * Space.getGrid().offset * 2),
        -10,
        data[2] * multiplierZ
    ));

    // Set vertice
    this.geometry.vertices.push(new THREE.Vector3(
        (this.dataSetIndex * Space.getGrid().offset * 2),
        0,
        data[2] * multiplierZ
    ));

    this.geometry.vertices[i++].rawData = -1;
    this.geometry.vertices[i++].rawData = Space.getGrid().getYAxisValue(data[1]);
}

CurveGeometry.prototype.buildFaces = function (nbDataSet, dataWidth) {

    this.buildSymetry();

    var size = this.geometry.vertices.length;
    var mid = size / 2;

    // First side
    for (var j = 0; j < this.geometry.vertices.length / 2 - 2; j += 2)
    {
        this.geometry.faces.push(new THREE.Face4(j, j + 2, j + 3, j + 1));
    }

    // Second side
    for (var j = this.geometry.vertices.length / 2; j < this.geometry.vertices.length - 2; j += 2)
    {
        this.geometry.faces.push(new THREE.Face4(j, j + 1, j + 3, j + 2));
    }

    // Top
    for (var j = 0; j < this.geometry.vertices.length / 2 - 2; j += 2)
    {
        this.geometry.faces.push(new THREE.Face4(j + 1, j + 3, mid + j + 3, mid + j + 1));
    }

    // Sides (extremities)
    this.geometry.faces.push(new THREE.Face4(0, 1, mid + 1, mid));
    this.geometry.faces.push(new THREE.Face4(mid - 2, size - 2, size - 1, mid - 1));

    this.geometry.computeCentroids();
    this.geometry.computeFaceNormals();
}

CurveGeometry.prototype.buildSymetry = function () {
    /**
     * Create second side with <offset>
     * This side is stored after the first one on each geometry from geometries
     */

    // Copy all vertices
    var array = this.geometry.vertices.slice();

    // Create new vertex with offset value

    var size = this.geometry.vertices.length;

    for (var j = 0; j < array.length; ++j) {
        this.geometry.vertices.push(new THREE.Vector3(
            array[j].x + Space.getGrid().offset,
            array[j].y,
            array[j].z
        ));
        this.geometry.vertices[size++].rawData = array[j].rawData;
    }
}

CurveGeometry.prototype.finalize = function () {

    this.geometry.dynamic = true;

    // Create mesh
    this.object = new THREE.Mesh(
        this.geometry,
        new THREE.MeshLambertMaterial({color: this.color})
    );
    this.object.dynamic = true;
    this.object.doubleSided = true;
    this.object.name = "Geometry_" + this.dataSetIndex;

    // Add to scene
    Space.getScene().add(this.object);

}

CurveGeometry.prototype.getPointedData = function (point) {

    var offsetZ = this.multiplierZ;

    var index = Math.floor(point.z / offsetZ);
    var mod = point.z % offsetZ;

    if (mod > (offsetZ / 2))
        ++index;
    //var index = Math.floor((point.z + (offsetZ / 2)) / offsetZ);

    if (index >= this.dataMap.length)
        index = this.dataMap.length - 1;

    return index;

}

CurveGeometry.prototype.highlightPointedData = function (point) {

    var index = this.getPointedData(point);

    if (!(index in this.dataMap))
    {
        return {data: null, realData: null, hoverPosition3D: null, changed: false, indexZ:index};
    }

    var data = this.dataMap[index];
    var realData = this.realDataMap[index];

    //console.log("[PointZ: " + point.z + "] | [Index: " + index + "]");

    // Floating div
    var p3D = new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 + (Space.getGrid().offset + 1) / 2,
        Space.getGrid().getYAxisValue(data[1]),
        data[2] * this.multiplierZ);

    if (this.highlightGeometry != null)
    {
        // Remove old geometry
        if (this.highlightGeometry.index != index)
        {
            Space.getScene().remove(this.highlightGeometry.object);
        }

        else
            return {data: data, realData: realData, hoverPosition3D: p3D, changed: false, indexZ:index};
    }

    this.highlightGeometry = { index: index, object: null};
    var geometry = new THREE.Geometry();

    // Top
    geometry.vertices.push(new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 - 1, Space.getGrid().getYAxisValue(data[1]) + 5, data[2] * this.multiplierZ - 2));
    geometry.vertices.push(new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 - 1, Space.getGrid().getYAxisValue(data[1]) + 5, data[2] * this.multiplierZ + 2));
    geometry.vertices.push(new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 + Space.getGrid().offset + 1, Space.getGrid().getYAxisValue(data[1]) + 5, data[2] * this.multiplierZ + 2));
    geometry.vertices.push(new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 + Space.getGrid().offset + 1, Space.getGrid().getYAxisValue(data[1]) + 5, data[2] * this.multiplierZ - 2));

    // Bottom
    geometry.vertices.push(new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 - 1, 0, data[2] * this.multiplierZ - 2));
    geometry.vertices.push(new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 - 1, 0, data[2] * this.multiplierZ + 2));
    geometry.vertices.push(new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 + Space.getGrid().offset + 1, 0, data[2] * this.multiplierZ + 2));
    geometry.vertices.push(new THREE.Vector3(this.dataSetIndex * Space.getGrid().offset * 2 + Space.getGrid().offset + 1, 0, data[2] * this.multiplierZ - 2));

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

    return {data: data, realData: realData, hoverPosition3D: p3D, changed: true, indexZ:index};

}

CurveGeometry.prototype.resetHighlights = function () {

    if (this.highlightGeometry != null)
    {
        Space.getScene().remove(this.highlightGeometry.object);
        this.highlightGeometry = null;
    }

}

CurveGeometry.prototype.remove = function () {
    Space.getScene().remove(this.object);
}
/**
 * Authors: Jerome Champigny & Josselin Muller
 * Company: Media Innovation Group
 * Project: 3D Graph
 *
 * Description: BarChart geometry class
 */

function BarChartGeometry () {
    this.dataSetIndex = 0;
    this.geometry = new THREE.Geometry();
    this.object = null;
    this.nbVertex = 0;
    this.dataJSON = null;
    this.color = getRandomColor(0xc10000);;

    this.multiplierY = null;
    this.multiplierZ = null;

    this.dataMap = new Array();
    this.realDataMap = new Array();

    this.highlightGeometry = null;
    this.highlightMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFFFF, wireframe: false, wireframeLinewidth: 30, transparent: true, opacity: 0.6});
}

BarChartGeometry.prototype.isUniqueGeometry = function() {
    return false;
}

BarChartGeometry.prototype.build = function (previousData, data, multiplierY, multiplierZ, dataJSON, dataSetIndex) {

    this.dataSetIndex = dataSetIndex;
    this.dataJSON = dataJSON;

    this.multiplierY = multiplierY;
    this.multiplierZ = multiplierZ;

    this.dataMap[data[2]] = data;
    this.realDataMap[data[2]] = dataJSON;

    // Top
    this.geometry.vertices.push(new THREE.Vector3(dataSetIndex * Space.getGrid().offset * 2, 1, data[2] * multiplierZ));
    this.geometry.vertices.push(new THREE.Vector3(dataSetIndex * Space.getGrid().offset * 2, 1, (data[2] + 1) * multiplierZ));
    this.geometry.vertices.push(new THREE.Vector3(dataSetIndex * Space.getGrid().offset * 2 + Space.getGrid().offset, 1, (data[2] + 1) * multiplierZ));
    this.geometry.vertices.push(new THREE.Vector3(dataSetIndex * Space.getGrid().offset * 2 + Space.getGrid().offset, 1, data[2] * multiplierZ));

    // Bottom
    this.geometry.vertices.push(new THREE.Vector3(dataSetIndex * Space.getGrid().offset * 2, 0, data[2] * multiplierZ));
    this.geometry.vertices.push(new THREE.Vector3(dataSetIndex * Space.getGrid().offset * 2, 0, (data[2] + 1) * multiplierZ));
    this.geometry.vertices.push(new THREE.Vector3(dataSetIndex * Space.getGrid().offset * 2 + Space.getGrid().offset, 0, (data[2] + 1) * multiplierZ));
    this.geometry.vertices.push(new THREE.Vector3(dataSetIndex * Space.getGrid().offset * 2 + Space.getGrid().offset, 0, data[2] * multiplierZ));

    // Set final position Y in rawData
    for(var i = this.geometry.vertices.length - 8, j = 0; j < 4; j++)
        this.geometry.vertices[i + j].rawData = Space.getGrid().getYAxisValue(data[1]);

    for(var i = this.geometry.vertices.length - 4, j = 0; j < 4; j++)
        this.geometry.vertices[i + j].rawData = 0;
}

BarChartGeometry.prototype.buildFaces = function (nbDataSet, dataWidth) {

    // Build faces
    for (var i = 0; i < this.geometry.vertices.length / 8; ++i)
    {
        this.geometry.faces.push(new THREE.Face4(this.nbVertex, this.nbVertex + 1, this.nbVertex + 2, this.nbVertex + 3)); // Top
        this.geometry.faces.push(new THREE.Face4(this.nbVertex + 1, this.nbVertex, this.nbVertex + 4, this.nbVertex + 5)); // Forward
        this.geometry.faces.push(new THREE.Face4(this.nbVertex, this.nbVertex + 3, this.nbVertex + 7, this.nbVertex + 4)); // Right
        this.geometry.faces.push(new THREE.Face4(this.nbVertex + 3, this.nbVertex + 2, this.nbVertex + 6, this.nbVertex + 7)); // Backward
        this.geometry.faces.push(new THREE.Face4(this.nbVertex + 2, this.nbVertex + 1, this.nbVertex + 5, this.nbVertex + 6)); // Left

        for (x = 0; x < 5; ++x){
            for (y = 0; y < 4; ++y){
                this.geometry.faces[i * 5 + x].vertexColors[y] = new THREE.Color(this.color);
            }
        }

        this.nbVertex += 8;
    }

    this.geometry.computeCentroids();
    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();
}

BarChartGeometry.prototype.finalize = function () {

    this.geometry.dynamic = true;

    this.object = new THREE.Mesh(this.geometry, new THREE.MeshLambertMaterial({vertexColors: THREE.VertexColors}));
    this.object.dynamic = true;
    this.object.name = "BarChart_" + this.dataSetIndex;
    this.object.doubleSided = true;

    // Add to scene
    Space.getScene().add(this.object);

}

BarChartGeometry.prototype.getPointedData = function (point) {

    var offsetZ = this.multiplierZ;

    var index = Math.floor(point.z / offsetZ);

    if (index >= this.dataMap.length)
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
    }

    return index;

}

BarChartGeometry.prototype.highlightPointedData = function (point) {

    var index = this.getPointedData(point);

    if (!(index in this.dataMap))
        return {data: null, realData: null, hoverPosition3D: null, indexZ:index, changed: false};

    var data = this.dataMap[index];
    var realData = this.realDataMap[index];

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

BarChartGeometry.prototype.resetHighlights = function () {

    if (this.highlightGeometry != null)
    {
        Space.getScene().remove(this.highlightGeometry.object);
        this.highlightGeometry = null;
    }

}

BarChartGeometry.prototype.remove = function () {
    Space.getScene().remove(this.object);
}
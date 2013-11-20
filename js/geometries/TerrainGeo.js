/**
 * Authors: Jerome Champigny & Josselin Muller
 * Company: Media Innovation Group
 * Project: 3D Graph
 *
 * Description: Terrain geometry class
 */

function TerrainGeometry () {
    this.dataSetIndex = 0;
    this.geometry = new THREE.Geometry();
    this.object = null;
    this.nbVertex = 0;
    this.dataJSON = null;
    this.color = null;
    this.gradientColors = new Array();
    this.gradientColors.push("0x1C38D6");
    this.gradientColors.push("0xBD6B00");

    this.multiplierY = null;
    this.multiplierZ = null;

    this.dataMap = new Array();
    this.realDataMap = new Array();

    this.highlightGeometry = null;
    this.highlightMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFFFF, wireframe: true, wireframeLinewidth: 30, transparent: true, opacity: 0.6});
}

TerrainGeometry.prototype.isUniqueGeometry = function() {
    return true;
}

TerrainGeometry.prototype.build = function (previousData, data, multiplierY, multiplierZ, dataJSON, dataSetIndex) {
    this.dataSetIndex = dataSetIndex;
    this.dataJSON = dataJSON;

    this.multiplierY = multiplierY;
    this.multiplierZ = multiplierZ;

    var size = this.geometry.vertices.length;

    // build null data between each data gaps (not at the end)
    if (previousData != null && data[2] - 1 > previousData[2]) {
        for (var k = 1; data[2] != previousData[2] + k; ++k) {
            this.geometry.vertices.push(new THREE.Vector3(
                (this.dataSetIndex * Space.getGrid().offset * 2) + Space.getGrid().offset,
                0,
                (previousData[2] + k) * multiplierZ
            ));
            this.geometry.vertices[size++].rawData = 1;
        }
    } else if (previousData != null && data[0] != previousData[0] && (data[2] * multiplierZ) != 0) {
        for (var k = 0; data[2] > k; ++k) {
            this.geometry.vertices.push(new THREE.Vector3(
                (this.dataSetIndex * Space.getGrid().offset * 2) + Space.getGrid().offset,
                0,
                k * multiplierZ
            ));
            this.geometry.vertices[size++].rawData = 1;
        }
    }

    this.geometry.vertices.push(new THREE.Vector3(
        (this.dataSetIndex * Space.getGrid().offset * 2) + Space.getGrid().offset,
        0,
        data[2] * multiplierZ
    ));
    this.geometry.vertices[size++].rawData = Space.getGrid().getYAxisValue(data[1]);
}

TerrainGeometry.prototype.finishLine = function (data, multiplierZ, dataSetIndex) {
    var i = data[2] + 1;

    var size = this.geometry.vertices.length;

    for (; i <= Space.getHighData()[2]; ++i) {
        this.geometry.vertices.push(new THREE.Vector3(
            dataSetIndex * Space.getGrid().offset * 2 + Space.getGrid().offset,
            0,
            i * multiplierZ
        ));
        this.geometry.vertices[i].rawData = 1;
    }
}

TerrainGeometry.prototype.buildFaces = function (nbDataSet, dataWidth) {
    for (var i = 1; i < dataWidth.length; ++i)
        if (dataWidth[i] != dataWidth[0])
            throw "dataWidth are not equals"

    this.dataWidth = dataWidth[0];

    // Nb curves (X)
    for (var x = 0, f = 0; x < nbDataSet - 1; ++x)
    {
        // Nb points by curves (Z)
        for (var i = 0; i < this.dataWidth - 1; ++i)
        {
            this.geometry.faces.push(new THREE.Face3(
                i + x * this.dataWidth,
                i + x * this.dataWidth + 1,
                i + (x + 1) * this.dataWidth
            ));

            this.geometry.faces.push(new THREE.Face3(
                i + x * this.dataWidth + 1,
                i + (x + 1) * this.dataWidth + 1,
                i + (x + 1) * this.dataWidth
            ));

            this.geometry.faces[f].vertexColors[0] = new THREE.Color(getColorFromGradientPercentage("0x000088", "0x880000", this.geometry.vertices[this.geometry.faces[f].a].rawData / Space.getGrid().getYAxisValue(Space.getHighData()[1])).toHexString());
            this.geometry.faces[f].vertexColors[1] = new THREE.Color(getColorFromGradientPercentage("0x000088", "0x880000", this.geometry.vertices[this.geometry.faces[f].b].rawData / Space.getGrid().getYAxisValue(Space.getHighData()[1])).toHexString());
            this.geometry.faces[f].vertexColors[2] = new THREE.Color(getColorFromGradientPercentage("0x000088", "0x880000", this.geometry.vertices[this.geometry.faces[f].c].rawData / Space.getGrid().getYAxisValue(Space.getHighData()[1])).toHexString());
            ++f;
            this.geometry.faces[f].vertexColors[0] = new THREE.Color(getColorFromGradientPercentage("0x000088", "0x880000", this.geometry.vertices[this.geometry.faces[f].a].rawData / Space.getGrid().getYAxisValue(Space.getHighData()[1])).toHexString());
            this.geometry.faces[f].vertexColors[1] = new THREE.Color(getColorFromGradientPercentage("0x000088", "0x880000", this.geometry.vertices[this.geometry.faces[f].b].rawData / Space.getGrid().getYAxisValue(Space.getHighData()[1])).toHexString());
            this.geometry.faces[f].vertexColors[2] = new THREE.Color(getColorFromGradientPercentage("0x000088", "0x880000", this.geometry.vertices[this.geometry.faces[f].c].rawData / Space.getGrid().getYAxisValue(Space.getHighData()[1])).toHexString());
            ++f;
        }
    }

    this.geometry.computeCentroids();
    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();
}

TerrainGeometry.prototype.finalize = function () {

    this.geometry.dynamic = true;

    // Create mesh
    this.object = new THREE.Mesh(
        this.geometry,
        new THREE.MeshLambertMaterial({vertexColors: THREE.VertexColors})
    );
    this.object.dynamic = true;
    this.object.doubleSided = true;
    this.object.name = "Geometry_";

    // Add to scene
    Space.getScene().add(this.object);

}

TerrainGeometry.prototype.getPointedData = function (point) {

    return -1;

}

TerrainGeometry.prototype.highlightPointedData = function (point) {


}

TerrainGeometry.prototype.resetHighlights = function () {

    if (this.highlightGeometry != null)
    {
        Space.getScene().remove(this.highlightGeometry.object);
        this.highlightGeometry = null;
    }

}

TerrainGeometry.prototype.remove = function () {
    Space.getScene().remove(this.object);
}
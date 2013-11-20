/**
 * Authors: Jerome Champigny & Josselin Muller
 * Company: Media Innovation Group
 * Project: 3D Graph
 *
 * Description: 3D representation of a grid (with lines, axes and legends)
 */

function Grid () {
    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.precisionX = 50;
    this.precisionY = 50;
    this.precisionZ = 50;

    this.precision = 50;
    this.opacity = 0.1;
    this.color = "#000000";

    this.linesA = new Array();
    this.linesB = new Array();
    this.linesC = new Array();

    this.hoverLineA = null;
    this.hoverLineA2 = null;
    this.hoverLineB = null;
    this.hoverLineC = null;
    this.offset = 50;

    this.init = false;

    this.textMaterials = new Array();
    this.textGeometries = new Array();
    this.textGeometriesMerged = new THREE.Geometry();

    this.hoverMaterial = new THREE.MeshBasicMaterial({color: 0xFF996699});

    // Scale
    this.scaleType = "linear";

    this.create = function (scaleType) {
        this.remove();

        this.scaleType = scaleType;

        // Create three faces beyond grids in order to catch a ray
        var faces = new THREE.Geometry();
        var line;

        this.getCoords();

        faces.vertices.push(new THREE.Vector3(0, -1, 0));
        faces.vertices.push(new THREE.Vector3(this.x, -1, 0));
        faces.vertices.push(new THREE.Vector3(this.x, this.y, 0));
        faces.vertices.push(new THREE.Vector3(0, this.y, 0));
        faces.vertices.push(new THREE.Vector3(this.x, -1, this.z));
        faces.vertices.push(new THREE.Vector3(0, -1, this.z));
        faces.vertices.push(new THREE.Vector3(0, this.y, this.z));

        faces.faces.push(new THREE.Face4(0, 1, 2, 3));
        faces.faces.push(new THREE.Face4(0, 3, 6, 5));
        faces.faces.push(new THREE.Face4(0, 5, 4, 1));

        faces.computeCentroids();
        faces.computeFaceNormals();

        // Create faces Mesh and add it to the object Array in order to perform ray.intersectObjects
        var object = new THREE.Mesh(faces, new THREE.MeshBasicMaterial({opacity: 0}));
        object.name = "quadrillage";
        //Space.getZoomableObjects().push(object);
        Space.getScene().add(object);

        var X = new THREE.Geometry();
        var Y = new THREE.Geometry();
        var Z = new THREE.Geometry();

        X.vertices.push(new THREE.Vector3(1, 1, 1));
        Y.vertices.push(new THREE.Vector3(1, 1, 1));
        Z.vertices.push(new THREE.Vector3(1, 1, 1));

        X.vertices.push(new THREE.Vector3(this.x, 1, 1));
        Y.vertices.push(new THREE.Vector3(1, this.y, 1));
        Z.vertices.push(new THREE.Vector3(1, 1, this.z));

        line = new THREE.Line(X, new THREE.LineBasicMaterial({color:0xc10000}));
        Space.getScene().add(line);

        line = new THREE.Line(Y, new THREE.LineBasicMaterial({color:0x000bc0}));
        Space.getScene().add(line);

        line = new THREE.Line(Z, new THREE.LineBasicMaterial({color:0x00c00b}));
        Space.getScene().add(line);
    }

    this.createLines = function() {
        var line;
        var material = new THREE.LineBasicMaterial({color:0x000000, opacity:this.opacity});

        var X = new THREE.Geometry();
        var Y = new THREE.Geometry();
        var Z = new THREE.Geometry();

        X.vertices.push(new THREE.Vector3(0, 0, 0));
        Y.vertices.push(new THREE.Vector3(0, 0, 0));
        Z.vertices.push(new THREE.Vector3(0, 0, 0));

        X.vertices.push(new THREE.Vector3(this.x, 0, 0));
        Y.vertices.push(new THREE.Vector3(0, this.y, 0));
        Z.vertices.push(new THREE.Vector3(0, 0, this.z));

        // Y lines
        for (var i = 1; i <= (this.y / this.precisionY); ++i) {
            line = new THREE.Line(Z, material);
            line.position.y = i * this.precisionY;
            Space.getScene().add(line);

            line = new THREE.Line(X, material);
            line.position.y = i * this.precisionY;
            line.rotation.x = -90 * Math.PI / 180;
            Space.getScene().add(line);
        }

        // X lines
        for (i = 1; i <= (this.x / this.precisionX); ++i) {
            line = new THREE.Line(Y, material);
            line.position.x = i * this.precisionX;
            Space.getScene().add(line);

            line = new THREE.Line(Z, material);
            line.position.x = i * this.precisionX;
            line.position.y = -1;
            line.rotation.z = -90 * Math.PI / 180;
            Space.getScene().add(line);
        }

        // Z lines
        for (i = 1; i <= (this.z / this.precisionZ); ++i) {
            var material = new THREE.LineBasicMaterial({color:0x000000, opacity:this.opacity});

            line = new THREE.Line(X, material);
            line.position.y = -1;
            line.position.z = i * this.precisionZ;
            Space.getScene().add(line);

            this.linesB.push(line);

            var material = new THREE.LineBasicMaterial({color:0x000000, opacity:this.opacity});
            line = new THREE.Line(Y, material);
            line.position.z = i * this.precisionZ;
            line.rotation.y = -90 * Math.PI / 180;
            Space.getScene().add(line);
        }


        var geometry = new THREE.Geometry();

        // Top on Z
        geometry.vertices.push(new THREE.Vector3(0, this.y, 0));
        geometry.vertices.push(new THREE.Vector3(-20, this.y, 0));
        geometry.vertices.push(new THREE.Vector3(-20, this.y, this.z));
        geometry.vertices.push(new THREE.Vector3(0, this.y, this.z));

        // Top on X
        geometry.vertices.push(new THREE.Vector3(-20, this.y, 0));
        geometry.vertices.push(new THREE.Vector3(-20, this.y, -20));
        geometry.vertices.push(new THREE.Vector3(this.x, this.y, -20));
        geometry.vertices.push(new THREE.Vector3(this.x, this.y, 0));

        // Side on max-X
        geometry.vertices.push(new THREE.Vector3(this.x, this.y, -20));
        geometry.vertices.push(new THREE.Vector3(this.x, this.y, 0));
        geometry.vertices.push(new THREE.Vector3(this.x, -20, 0));
        geometry.vertices.push(new THREE.Vector3(this.x, -20, -20));

        // Side on max-Z
        geometry.vertices.push(new THREE.Vector3(-20, this.y, this.z));
        geometry.vertices.push(new THREE.Vector3(0, this.y, this.z));
        geometry.vertices.push(new THREE.Vector3(0, -20, this.z));
        geometry.vertices.push(new THREE.Vector3(-20, -20, this.z));

        // Bottom on Z
        geometry.vertices.push(new THREE.Vector3(this.x, 0, 0));
        geometry.vertices.push(new THREE.Vector3(this.x, -20, 0));
        geometry.vertices.push(new THREE.Vector3(this.x, -20, this.z));
        geometry.vertices.push(new THREE.Vector3(this.x, 0, this.z));

        // Bottom on X
        geometry.vertices.push(new THREE.Vector3(0, 0, this.z));
        geometry.vertices.push(new THREE.Vector3(0, -20, this.z));
        geometry.vertices.push(new THREE.Vector3(this.x, -20, this.z));
        geometry.vertices.push(new THREE.Vector3(this.x, 0, this.z));


        geometry.faces.push(new THREE.Face4(0, 1, 2, 3)); // Top on Z
        geometry.faces.push(new THREE.Face4(4, 7, 6, 5)); // Top on X
        geometry.faces.push(new THREE.Face4(8, 9, 10, 11)); // Side on max-X
        geometry.faces.push(new THREE.Face4(12, 15, 14, 13)); // Side on max-Z
        geometry.faces.push(new THREE.Face4(16, 19, 18, 17)); // Bottom on Z
        geometry.faces.push(new THREE.Face4(20, 21, 22, 23)); // Bottom on Z

        geometry.computeCentroids();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        var mat = new THREE.MeshLambertMaterial({color: 0xF0F0F0 });
        var mesh = new THREE.Mesh(geometry, mat);

        Space.getScene().add(mesh);
    }

    this.createLegends = function() {
        var mins = Space.getMinData();

        // Legends Z

        var unit = mins[2];
        if (typeof Space.getStringsJSON()["dataZ"] != "undefined") {
            var values = new Array();
            for (i = 0; i < Space.getStringsJSON()["dataZ"].length; ++i)
                if (values[values.length - 1] != Space.getStringsJSON()["dataZ"][i].name)
                    values.push(Space.getStringsJSON()["dataZ"][i].name);

            for (var i = 0, j = 1; i <= values.length && j < (this.z / this.precisionZ); ++i, ++j) {
                this.createTextLabel(this.x + 30, -20, j * this.precisionZ - 60, 60, 60, 0, 0.6, 0, values[i], "16pt");
            }
        } else if (isInt(Space.getDataJSON()[0].dataZ)) {
            for (i = 1; i <= (this.z/ this.precisionZ); ++i) {
                this.createTextLabel(this.x + 30, -20, i * this.precisionZ - 60, 60, 60, 0, 0.6, 0, (unit + i - 1), "12pt");
            }
        } else if (isDate(Space.getDataJSON()[0].dataZ)) {
            var d = new Date(unit);
            for (var i = 1; i <= (this.z / this.precisionZ); ++i) {
                var dI = new Date(d.getTime() + i * 24 * 60 * 60 * 1000);
                this.createTextLabel(this.x + 30, -20, i * this.precisionZ - 60, 60, 60, 0, 0.6, 0, (dI.getMonth() + 1) + '/' + dI.getDate() + '/' + dI.getFullYear(), "8pt");
            }
        }

        // Legends Y
        unit = mins[1];
        if (this.scaleType == "logarithmic")
        {
            for (var i = 1, j = 1; i <= (this.y / this.precisionY); ++i, j *= 10) {
                this.createTextLabel(this.x + 40, i * this.precisionY, -20, 60, 40, Math.PI / 2, 0, 0, j, "12pt");
                this.createTextLabel(-20, i * this.precisionY, this.z + 40, 60, 40, Math.PI / 2, Math.PI / 2, 0, j, "12pt");
            }
        }
        else
        {
            if (typeof Space.getStringsJSON()["dataY"] != "undefined") {
                var values = new Array();
                for (i = 0; i < Space.getDataJSON()["dataY"].length; ++i)
                    if (values[values.length - 1] != Space.getStringsJSON()["dataY"][i].name)
                        values.push(Space.getStringsJSON()["dataY"][i].name);

                for (var i = 0, j = 0; i <= values.length && j <= (this.y / this.precisionY); ++i, ++j) {
                    this.createTextLabel(this.x + 40, i * this.precisionY, -20, 60, 40, Math.PI / 2, 0, 0, values[i], "16pt");
                    this.createTextLabel(-20, i * this.precisionY, this.z + 40, 60, 40, Math.PI / 2, Math.PI / 2, 0, values[i], "16pt");
                }
            } else if (isInt(Space.getDataJSON()[0].dataY)) {
                for (i = 1; i <= (this.y / this.precisionY); ++i) {
                    this.createTextLabel(this.x + 40, i * this.precisionY, -20, 60, 40, Math.PI / 2, 0, 0, unit + i - 1, "12pt");
                    this.createTextLabel(-20, i * this.precisionY, this.z + 40, 60, 40, Math.PI / 2, Math.PI / 2, 0, unit + i - 1, "12pt");
                }
            } else if (isDate(Space.getDataJSON()[0].dataY)) {
                var d = new Date(unit);
                for (var i = 1; i <= (this.y / this.precisionY); ++i) {
                    var dI = new Date(d.getTime() + i * 24 * 60 * 60 * 1000);
                    this.createTextLabel(this.x + 40, i * this.precisionY, -20, 60, 40, Math.PI / 2, 0, 0, (dI.getMonth() + 1) + '/' + dI.getDate() + '/' + dI.getFullYear(), "8pt");
                    this.createTextLabel(-20, i * this.precisionY, this.z + 40, 60, 40, Math.PI / 2, Math.PI / 2, 0, (dI.getMonth() + 1) + '/' + dI.getDate() + '/' + dI.getFullYear(), "8pt");
                }
            }
        }


        // Legends X
        unit = mins[0];
        if (typeof Space.getStringsJSON()["constant"] != "undefined") {
            var values = new Array();
            for (i = 0; i < Space.getStringsJSON()["constant"].length; ++i)
                if (values[values.length - 1] != Space.getStringsJSON()["constant"][i].name)
                    values.push(Space.getStringsJSON()["constant"][i].name);

            for (var i = 0, j = 1; i <= values.length && j <= (this.x / this.precisionX); ++i, j += 2) {
                this.createTextLabel(j * this.precisionX - 15, -20, this.z + 40, 60, 40, 0, Math.PI / 2 - 0.6, 0, values[i], "16pt");
            }
        } else if (isInt(Space.getDataJSON()[0].constant)) {
            for (i = 1; i <= (this.x / this.precisionX); i += 2) {
                this.createTextLabel(i * this.precisionX - 15, -20, this.z + 40, 60, 40, 0, Math.PI / 2 - 0.6, 0, (unit + i) / 2, "12pt");
            }
        } else if (isDate(Space.getDataJSON()[0].constant)) {
            var d = new Date(unit);
            for (var i = 1; i <= (this.x / this.precisionX); i += 2) {
                var dI = new Date(d.getTime() + i * 24 * 60 * 60 * 1000);
                this.createTextLabel(i * this.precisionX - 15, -20, this.z + 40, 60, 40, 0, Math.PI / 2 - 0.6, 0, (dI.getMonth() + 1) + '/' + dI.getDate() + '/' + dI.getFullYear() / 2, "12pt");
            }
        }

        this.createTextLabel(this.x + 220, this.y / 2, -25, 350, 100, Math.PI / 2, 0, 0, Space.getAxes()['dataY'], "30pt");
        this.createTextLabel(this.x + 220, -25, this.z / 2, 350, 100, 0, 0, 0, Space.getAxes()['dataZ'], "30pt");
        this.createTextLabel(this.x / 2, -25, this.z + 120, 350, 100, 0, 0, 0, Space.getAxes()['constant'], "30pt");

        for (var i = 0; i < this.textGeometries.length; ++i)
        {
            var geo = this.textGeometries[i];
            geo.materials = this.textMaterials;

            // Set material index
            for (var j = 0; j < geo.faces.length; ++j)
            {
                geo.faces[j].materialIndex = i;
            }

            THREE.GeometryUtils.merge(this.textGeometriesMerged, geo)
        }

        this.textGeometriesMerged.computeFaceNormals();

        var computedGeoMesh = new THREE.Mesh(this.textGeometriesMerged, new THREE.MeshFaceMaterial());
        computedGeoMesh.updateMatrix();
        Space.getScene().add(computedGeoMesh);

    }

    this.createTextLabel = function(x, y, z, width, height, rotationX, rotationY, rotationZ, text, fontSize) {

        var texture = new THREE.Texture(this.getTextCanvas(text, fontSize, width, height));
        texture.needsUpdate = true;

        var material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        var normal = new THREE.Vector3(0, 1, 0);

        this.textMaterials.push(material);

        var geo = new THREE.Geometry();
        geo.vertices.push(new THREE.Vector3(-width / 2, 0, -height / 2)); // 0
        geo.vertices.push(new THREE.Vector3(width / 2, 0, -height / 2)); // 1
        geo.vertices.push(new THREE.Vector3(width / 2, 0, height / 2)); // 2
        geo.vertices.push(new THREE.Vector3(-width / 2, 0, height / 2)); // 3

        var face = new THREE.Face4(0, 3, 2, 1, normal);
        face.materialIndex = 0;
        geo.faces.push(face);

        geo.faceVertexUvs[0].push([
            new THREE.UV(0, 0),
            new THREE.UV(0, 1),
            new THREE.UV(1, 1),
            new THREE.UV(1, 0)
        ]);

        geo.computeCentroids();
        geo.computeFaceNormals();
        geo.computeVertexNormals();

        if (rotationX != 0)
            geo.applyMatrix(new THREE.Matrix4().rotateX(rotationX));
        if (rotationY != 0)
            geo.applyMatrix(new THREE.Matrix4().rotateY(rotationY));
        if (rotationZ != 0)
            geo.applyMatrix(new THREE.Matrix4().rotateZ(rotationZ));

        geo.applyMatrix(new THREE.Matrix4().translate({x: x, y: y, z: z}));

        this.textGeometries.push(geo);

    }

    this.getTextCanvas = function (text, fontSize, width, height) {
        var canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        var context = canvas.getContext('2d');
        context.font = fontSize + ' Arial';
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fontWeight = "bold";
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        return canvas;
    }

    this.getYAxisValue = function(value) {

        var val = value;

        if (this.scaleType == "logarithmic")
        {
            val = Math.log10(value + 1);
        }

        var valOnAxis = val * this.precisionY;

        return valOnAxis;
    }

    this.lineHover = function(x, y, z) {

        if (this.hoverLineA == null && this.hoverLineA2 == null)
        {
            var normal = new THREE.Vector3(0, 1, 0);

            var geo = new THREE.Geometry();
            geo.vertices.push(new THREE.Vector3(0, 5, 0)); // 0
            geo.vertices.push(new THREE.Vector3(this.x, 5, 0)); // 1
            geo.vertices.push(new THREE.Vector3(this.x, -5, 0)); // 2
            geo.vertices.push(new THREE.Vector3(0, -5, 0)); // 3

            var face = new THREE.Face4(0, 3, 2, 1, normal);
            geo.faces.push(face);

            geo.dynamic = true;

            geo.computeCentroids();
            geo.computeFaceNormals();
            geo.computeVertexNormals();

            // Create mesh with shadows
            this.hoverLineA = new THREE.Mesh(
                geo,
                this.hoverMaterial
            );

            this.hoverLineA.position.z = 0.5;

            Space.getScene().add(this.hoverLineA);


            var geo = new THREE.Geometry();
            geo.vertices.push(new THREE.Vector3(0, 5, this.z)); // 0
            geo.vertices.push(new THREE.Vector3(0, 5, 0)); // 1
            geo.vertices.push(new THREE.Vector3(0, -5, 0)); // 2
            geo.vertices.push(new THREE.Vector3(0, -5, this.z)); // 3

            var face = new THREE.Face4(0, 3, 2, 1, normal);
            geo.faces.push(face);

            geo.dynamic = true;

            geo.computeCentroids();
            geo.computeFaceNormals();
            geo.computeVertexNormals();

            // Create mesh with shadows
            this.hoverLineA2 = new THREE.Mesh(
                geo,
                this.hoverMaterial
            );

            this.hoverLineA2.position.x = 0.5;
            //this.hoverLineA2.rotation.y = Math.PI / 2;

            Space.getScene().add(this.hoverLineA2);
        }

        if (this.hoverLineB == null)
        {
            var normal = new THREE.Vector3(0, 1, 0);

            var geo = new THREE.Geometry();
            geo.vertices.push(new THREE.Vector3(0, 0, 5)); // 0
            geo.vertices.push(new THREE.Vector3(this.x, 0, 5)); // 1
            geo.vertices.push(new THREE.Vector3(this.x, 0, -5)); // 2
            geo.vertices.push(new THREE.Vector3(0, 0, -5)); // 3

            var face = new THREE.Face4(0, 1, 2, 3, normal);
            geo.faces.push(face);

            geo.dynamic = true;

            geo.computeCentroids();
            geo.computeFaceNormals();
            geo.computeVertexNormals();

            // Create mesh with shadows
            this.hoverLineB = new THREE.Mesh(
                geo,
                this.hoverMaterial
            );

            this.hoverLineB.position.y = -0.5;

            Space.getScene().add(this.hoverLineB);
        }

        if (this.hoverLineC == null)
        {
            var normal = new THREE.Vector3(0, 1, 0);

            var geo = new THREE.Geometry();
            geo.vertices.push(new THREE.Vector3(0, 0, 0)); // 0
            geo.vertices.push(new THREE.Vector3(this.precisionX, 0, 0)); // 1
            geo.vertices.push(new THREE.Vector3(this.precisionX, 0, this.z)); // 2
            geo.vertices.push(new THREE.Vector3(0, 0, this.z)); // 3

            var face = new THREE.Face4(0, 3, 2, 1, normal);
            geo.faces.push(face);

            geo.dynamic = true;

            geo.computeCentroids();
            geo.computeFaceNormals();
            geo.computeVertexNormals();

            // Create mesh with shadows
            this.hoverLineC = new THREE.Mesh(
                geo,
                this.hoverMaterial
            );

            this.hoverLineC.position.y = -0.5;

            Space.getScene().add(this.hoverLineC);
        }

        this.hoverLineA.position.y = this.getYAxisValue(y);
        this.hoverLineA2.position.y = this.getYAxisValue(y);
        this.hoverLineB.position.z = z * this.precisionZ;
        this.hoverLineC.position.x = ((x - 1) * 2) * this.precisionX;

        this.showLineHover();
    }

    this.remove = function () {
        var present = true;
        /*while (present) {
            for (var i = 0; i < Space.getScene().objects.length; ++i)
                if (null != Space.getScene().objects[i].type)
                    Space.getScene().remove(Space.getScene().objects[i]);

            present = false;

            for (var i = 0; i < Space.getScene().objects.length; ++i)
                if (null != Space.getScene().objects[i].type)
                    present = true;
        }*/
    }
    this.getColor = function () {
        var tmp = this.color.match(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/i);

        if (tmp != null) {
            tmp = this.color.split("#");
            return this.color = "0x" + tmp[1];
        }
    }
    this.getCoords = function () {
        if (Space.getMinData().length == 0)
            throw("Min data must be set");

        if (Space.getHighData().length == 0)
            throw("Max data must be set");

        var minData = Space.getMinData();
        var maxData = Space.getHighData();

		this.offset = (1 / Math.abs((maxData[0] - minData[0]) / 1000) / 2);
		var offsetZ = (1 / Math.abs(maxData[2] / (maxData[2] * 30)));

		if (this.offset < 25)
			this.offset = 25;
        if (this.offset > 150)
            this.offset = 150;
			
        this.x = (maxData[0] - minData[0] + 1) * this.offset * 2;// * 1.2;

        if (this.scaleType == "logarithmic")
        {
            var power = getNextPowerOf(10, maxData[1]);
            this.y = 1000;
            this.precisionY = this.y / (power + 1);
        }
        else
        {
            this.y = maxData[1] * (1 / Math.abs(maxData[1] / (maxData[1] * 30)));// * 1.1;
            this.precisionY = this.y / (parseInt(maxData[1]) + 1);
        }
		
		if (offsetZ < 50)
			offsetZ = 50;

        this.precisionX = this.offset;
        this.precisionZ = offsetZ;

        this.z = (parseInt(maxData[2]) + 1) * offsetZ;
    }

    this.showLineHover = function() {

        if (this.hoverLineA != null)
            this.hoverLineA.visible = true;
        if (this.hoverLineA2 != null)
            this.hoverLineA2.visible = true;
        if (this.hoverLineB != null)
            this.hoverLineB.visible = true;
        if (this.hoverLineC != null)
            this.hoverLineC.visible = true;
    }

    this.hideLineHover = function() {

        if (this.hoverLineA != null)
            this.hoverLineA.visible = false;
        if (this.hoverLineA2 != null)
            this.hoverLineA2.visible = false;
        if (this.hoverLineB != null)
            this.hoverLineB.visible = false;
        if (this.hoverLineC != null)
            this.hoverLineC.visible = false;
    }
}
/**
 * Authors: Jerome Champigny & Josselin Muller
 * Company: Media Innovation Group
 * Project: 3D Graph
 *
 * Description: Dynamic camera controlled with the mouse
 */

function GraphCamera () {

    this.camera = null;

    this.target = null;
    this.position = null;

    this.needsUpdate = true;

    this.create = function () {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        this.position = this.camera.position;
    }

    this.lookAt = function(vector) {
        this.target = vector;
        this.camera.lookAt(vector);

        this.needsUpdate = true;
    }

    this.setPositionAndTarget = function(pos, target, constraintTarget) {
        pos.x = pos.x < 100 ? 100 : pos.x;
        pos.y = pos.y < 200 ? 200 : pos.y;
        pos.z = pos.z < 100 ? 100 : pos.z;

        if (constraintTarget === undefined)
            target.y = 0;

        this.camera.position = pos;
        this.camera.lookAt(target);

        this.position = pos;
        this.target = target;

        this.needsUpdate = true;
    }

    this.move = function(offset) {

        var pos = this.camera.position;
        pos.addSelf(offset);

        pos.x = pos.x < 100 ? 100 : pos.x;
        pos.y = pos.y < 200 ? 200 : pos.y;
        pos.z = pos.z < 100 ? 100 : pos.z;

        this.position = this.camera.position;
        this.needsUpdate = true;
    }

    this.moveTarget = function(offset) {

        var target = this.target;
        target.addSelf(offset);

        if (target.y < 0)
        {
            var x1 = this.position.x;
            var y1 = this.position.y;
            var z1 = this.position.z;
            var x2 = target.x;
            var y2 = target.y;
            var z2 = target.z;

            var k = - y1 / (y2 - y1);

            var x3 = x1 + k * (x2 - x1);
            var z3 = z1 + k * (z2 - z1);

            target.x = x3;
            target.y = 0;
            target.z = z3;
        }

        this.camera.lookAt(target);

        this.position = this.camera.position;
        this.needsUpdate = true;
    }

    this.update = function() {

        if (this.needsUpdate)
        {
            this.camera.updateMatrix();

            this.position = this.camera.position;
            this.needsUpdate = false;
        }
    }
}
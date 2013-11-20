/**
 * Authors: Jerome Champigny & Josselin Muller
 * Company: Media Innovation Group
 * Project: 3D Graph
 *
 * Description: Mouse handling (left / right click, move & wheel)
 */

// Mouse Button state (0: left; 2: right)
var mouseButtonDown = new Array();
var mousePosition = {x: 0, y: 0};

function onDocumentMouseWheel (event) {

    var delta = event.wheelDelta;
    var deltaAbs = delta > 0 ? 1 : -1;

    var detail = event.detail;
    deltaAbs = detail == 0 ? deltaAbs : detail < 0 ? 1 : -1;

    var camera = Space.getCamera();

    var pos = camera.position;
    var target = camera.target;

    var dir = null;

    // Forward
    if (deltaAbs > 0)
    {
        var mousePosition = Space.getProjector().unprojectVector(
            new THREE.Vector3(
                (event.clientX / Space.getRenderer().domElement.width) * 2 - 1,
                -(event.clientY / Space.getRenderer().domElement.height) * 2 + 1, 0.5
            ),
            Space.getCamera().camera
        );
        var dir = mousePosition.subSelf(pos).normalize();
        dir.multiplyScalar(100);

    }

    // Backward
    else
    {
        var dir = pos.clone().subSelf(target).normalize();
        dir.multiplyScalar(100);
    }

    camera.move(dir);
    Space.updateHighlightedDataHover();

    if (deltaAbs > 0)
        camera.moveTarget(dir);
}
function onDocumentMouseDown (event) {
    event.preventDefault();

    mousePosition.x = Math.round(event.clientX);
    mousePosition.y = Math.round(event.clientY);

    mouseButtonDown[event.button] = true;

    return false;
}
function onDocumentMouseMove (event) {
    event.preventDefault();

    var camera = Space.getCamera();
    var cameraPos = camera.camera.position;

    var deltaX = Math.round(event.clientX) - mousePosition.x;
    var deltaY = Math.round(event.clientY) - mousePosition.y;
    var deltaAll = deltaX + deltaY;


    mousePosition.x = Math.round(event.clientX);
    mousePosition.y = Math.round(event.clientY);

    // Left mouse down
    if (mouseButtonDown[0])
    {
        var up = new THREE.Vector3(0, 1, 0);
        var left = camera.position.clone().subSelf(camera.target).normalize();
        left.crossSelf(up);
        left.normalize();
        left.multiplyScalar(2 * deltaX);

        var front = camera.position.clone().subSelf(camera.target).normalize();
        front.y = 0;
        front.multiplyScalar(- 2 * deltaY);

        left.addSelf(front);

        camera.move(left);
        camera.moveTarget(left);

        Space.updateHighlightedDataHover();
    }

    // Right mouse down
    else if (mouseButtonDown[2])
    {
        var targetDir = camera.position.clone().subSelf(camera.target);
        var up = new THREE.Vector3(0, 1, 0);
        var left = camera.position.clone().subSelf(camera.target).normalize();
        left.crossSelf(up);
        left.normalize();

        var rotMat = new THREE.Matrix4().rotateY(-deltaX / 100);
        var trans = rotMat.multiplyVector3(targetDir);

        var rotMat = new THREE.Matrix4().rotateByAxis(left, deltaY / 100);
        var trans2 = trans.clone();
        trans2 = rotMat.multiplyVector3(trans2);

        trans2.addSelf(camera.target);

        // 2 is camera base
        // 3 is camera position
        var P12 = Math.sqrt(Math.pow(camera.target.x - trans2.x, 2) + Math.pow(camera.target.y - 0, 2) + Math.pow(camera.target.z - trans2.z, 2));
        var P13 = Math.sqrt(Math.pow(camera.target.x - trans2.x, 2) + Math.pow(camera.target.y - trans2.y, 2) + Math.pow(camera.target.z - trans2.z, 2));
        var P23 = Math.sqrt(Math.pow(trans2.x - trans2.x, 2) + Math.pow(0 - trans2.y, 2) + Math.pow(trans2.z - trans2.z, 2));
        var angle = Math.acos( (Math.pow(P12, 2) + Math.pow(P13, 2) - Math.pow(P23, 2)) / (2 * P12 * P13) );

        if (angle < (Math.PI / 2.2))
            camera.setPositionAndTarget(trans2, camera.target);

        Space.updateHighlightedDataHover();
    }

    // Selection
    else
    {
        var graphOffset = $("#3dgraph").offset();
        var renderer = Space.getRenderer().domElement;

        var relativeMousePos = { x: event.clientX - graphOffset.left, y: event.clientY - graphOffset.top };

        var mouse3D = Space.getProjector().unprojectVector(
            new THREE.Vector3(
                (relativeMousePos.x / renderer.width) * 2 - 1,
                -(relativeMousePos.y / renderer.height) * 2 + 1,
                0.5
            ),
            camera.camera
        );

        Space.getScene().updateMatrix();

        var target = mouse3D.subSelf(camera.position).normalize();

        var ray = new THREE.Ray(camera.position, target);
        var intersects = ray.intersectObjects(Space.getZoomableObjects());

        var i;
        var minI = -1;
        var minD = 999999999999999;

        for (i = 0; i < intersects.length; ++i)
        {
            if (!intersects[i].object.visible)
                continue;

            var distance = cameraPos.distanceToSquared(intersects[i].point);

            if (distance < minD)
            {
                minI = i;
                minD = distance;
            }
        }

        if (intersects.length > 0 && minI < intersects.length && intersects[minI] != null)// && intersects[minI].object.name != "quadrillage")
            Space.highlightPoint(intersects[minI]);
    }
}

function onDocumentMouseUp (event) {
    event.preventDefault();

    mousePosition.x = Math.round(event.clientX);
    mousePosition.y = Math.round(event.clientY);

    mouseButtonDown[event.button] = false;
    return false;
}

function onDocumentContextMenu (event) {
    event.preventDefault();

    return false;
}
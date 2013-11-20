/**
 * Authors: Jerome Champigny & Josselin Muller
 * Company: Media Innovation Group
 * Project: 3D Graph
 *
 * Description: The communicator is used to get & set the data
 * that the 3D graph must show
 */

function Communicator () {
    this.url = "http://localhost/jchampigny/3D-graph/Server/";
    this.method = "GET";
    this.callback;
}

Communicator.prototype.setCallback = function (callback) {
    this.callback = callback;
}
Communicator.prototype.getJSON = function () {
    var xmlhttp = false;
    var callback = this.callback;

    try {
        xmlhttp = new XMLHttpRequest();
    } catch (e) {
        xmlhttp = false;
    }

    xmlhttp.open(this.method, this.url, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            try {
                callback(JSON.parse(xmlhttp.responseText));
            } catch (err) {
                console.error("[Communicator] " + err);
                document.getElementsByClassName("modal")[0].getElementsByTagName("p")[0].innerHTML = "[ERROR] " + err.message;
                document.getElementsByClassName("modal")[0].getElementsByTagName("p")[0].style.color = "#c10000";
            }
        } else if (xmlhttp.status == "404" && xmlhttp.readyState == 3) {
            alert("Server couldn't be reached");
        }

    };
    xmlhttp.send(null)
}
Communicator.prototype.setJSON = function (jsonStr) {
    var callback = this.callback;
    callback(JSON.parse(jsonStr));
};
Communicator.prototype.setJSONObject = function (jsonObject) {
    this.callback(jsonObject);
};

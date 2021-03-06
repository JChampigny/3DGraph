/**
 * Authors: Jerome Champigny & Josselin Muller
 * Company: Media Innovation Group
 * Project: 3D Graph
 *
 * Description: Samples of JSON objects that the graph
 * can use
 */

var sample_logarithmic =
{
    "settings":
    {
        "scale": "logarithmic", // "linear" || "logarithmic"
        "type": "curve" // "curve" || "barchart" || "multibarchart" || "terrain"
    },
    "axes":
    {
        "constant": "User",
        "dataY": "Number of click",
        "dataZ":"Date"
    },
    "colors":
    [
        {"id":"1","color":"0xE5847C"},
        {"id":"2","color":"0x58F9BB"},
        {"id":"3","color":"0x764344"},
        {"id":"4","color":"0x4F8C82"}
    ],
    "data":
    [
        {"constant":"1","dataY":"2","dataZ":"2012-07-13"},
        {"constant":"1","dataY":"2","dataZ":"2012-07-14"},
        {"constant":"1","dataY":"5","dataZ":"2012-07-15"},
        {"constant":"1","dataY":"7","dataZ":"2012-07-16"},
        {"constant":"1","dataY":"4","dataZ":"2012-07-17"},
        {"constant":"1","dataY":"5","dataZ":"2012-07-18"},
        {"constant":"1","dataY":"60","dataZ":"2012-07-19"},
        {"constant":"1","dataY":"1","dataZ":"2012-07-20"},
        {"constant":"1","dataY":"6","dataZ":"2012-07-21"},
        {"constant":"1","dataY":"6","dataZ":"2012-07-22"},
        {"constant":"1","dataY":"1","dataZ":"2012-07-23"},
        {"constant":"1","dataY":"6","dataZ":"2012-07-24"},
        {"constant":"1","dataY":"6","dataZ":"2012-07-25"},
        {"constant":"1","dataY":"2","dataZ":"2012-07-26"},
        {"constant":"1","dataY":"5","dataZ":"2012-07-27"},
        {"constant":"1","dataY":"6","dataZ":"2012-07-28"},
        {"constant":"1","dataY":"4","dataZ":"2012-07-29"},
        {"constant":"1","dataY":"6","dataZ":"2012-07-30"},
        {"constant":"1","dataY":"8","dataZ":"2012-07-31"},
        {"constant":"1","dataY":"5","dataZ":"2012-08-01"},
        {"constant":"2","dataY":"7","dataZ":"2012-07-13"},
        {"constant":"2","dataY":"3","dataZ":"2012-07-14"},
        {"constant":"2","dataY":"3","dataZ":"2012-07-15"},
        {"constant":"2","dataY":"2","dataZ":"2012-07-16"},
        {"constant":"2","dataY":"5","dataZ":"2012-07-17"},
        {"constant":"2","dataY":"3000","dataZ":"2012-07-18"},
        {"constant":"2","dataY":"6","dataZ":"2012-07-19"},
        {"constant":"2","dataY":"3","dataZ":"2012-07-20"},
        {"constant":"2","dataY":"2","dataZ":"2012-07-21"},
        {"constant":"2","dataY":"3","dataZ":"2012-07-22"},
        {"constant":"2","dataY":"4","dataZ":"2012-07-23"},
        {"constant":"2","dataY":"1","dataZ":"2012-07-24"},
        {"constant":"2","dataY":"3","dataZ":"2012-07-25"},
        {"constant":"2","dataY":"8","dataZ":"2012-07-26"},
        {"constant":"2","dataY":"4","dataZ":"2012-07-27"},
        {"constant":"2","dataY":"3","dataZ":"2012-07-28"},
        {"constant":"2","dataY":"4","dataZ":"2012-07-29"},
        {"constant":"2","dataY":"3","dataZ":"2012-07-30"},
        {"constant":"2","dataY":"4","dataZ":"2012-07-31"},
        {"constant":"2","dataY":"6","dataZ":"2012-08-01"},
        {"constant":"3","dataY":"3","dataZ":"2012-07-13"},
        {"constant":"3","dataY":"5","dataZ":"2012-07-14"},
        {"constant":"3","dataY":"5","dataZ":"2012-07-15"},
        {"constant":"3","dataY":"4","dataZ":"2012-07-16"},
        {"constant":"3","dataY":"2","dataZ":"2012-07-17"},
        {"constant":"3","dataY":"3","dataZ":"2012-07-18"},
        {"constant":"3","dataY":"5","dataZ":"2012-07-19"},
        {"constant":"3","dataY":"3","dataZ":"2012-07-20"},
        {"constant":"3","dataY":"5","dataZ":"2012-07-21"},
        {"constant":"3","dataY":"3","dataZ":"2012-07-22"},
        {"constant":"3","dataY":"2","dataZ":"2012-07-23"},
        {"constant":"3","dataY":"2","dataZ":"2012-07-24"},
        {"constant":"3","dataY":"4","dataZ":"2012-07-25"},
        {"constant":"3","dataY":"2","dataZ":"2012-07-26"},
        {"constant":"3","dataY":"6","dataZ":"2012-07-27"},
        {"constant":"3","dataY":"3","dataZ":"2012-07-28"},
        {"constant":"3","dataY":"1","dataZ":"2012-07-29"},
        {"constant":"3","dataY":"6","dataZ":"2012-07-30"},
        {"constant":"3","dataY":"4","dataZ":"2012-07-31"},
        {"constant":"3","dataY":"3","dataZ":"2012-08-01"},
        {"constant":"4","dataY":"5","dataZ":"2012-07-13"},
        {"constant":"4","dataY":"5","dataZ":"2012-07-14"},
        {"constant":"4","dataY":"3","dataZ":"2012-07-15"},
        {"constant":"4","dataY":"5","dataZ":"2012-07-16"},
        {"constant":"4","dataY":"1","dataZ":"2012-07-17"},
        {"constant":"4","dataY":"2","dataZ":"2012-07-18"},
        {"constant":"4","dataY":"5","dataZ":"2012-07-19"},
        {"constant":"4","dataY":"5","dataZ":"2012-07-20"},
        {"constant":"4","dataY":"1","dataZ":"2012-07-21"},
        {"constant":"4","dataY":"3","dataZ":"2012-07-22"},
        {"constant":"4","dataY":"2","dataZ":"2012-07-23"},
        {"constant":"4","dataY":"1","dataZ":"2012-07-24"},
        {"constant":"4","dataY":"5","dataZ":"2012-07-25"},
        {"constant":"4","dataY":"5","dataZ":"2012-07-26"},
        {"constant":"4","dataY":"2","dataZ":"2012-07-27"},
        {"constant":"4","dataY":"2","dataZ":"2012-07-28"},
        {"constant":"4","dataY":"7","dataZ":"2012-07-29"},
        {"constant":"4","dataY":"5","dataZ":"2012-07-30"},
        {"constant":"4","dataY":"4","dataZ":"2012-07-31"},
        {"constant":"4","dataY":"3","dataZ":"2012-08-01"}
    ]
};

var sample_multibarchart =
{
    "settings":
    {
        "scale": "linear", // "linear" || "logarithmic"
        "type": "terrain" // "curve" || "barchart" || "multibarchart" || "terrain"
    },
    "axes":
    {
        "constant": "User",
        "dataY": "Number of click",
        "dataZ":"Date"
    },
    "colors":
    [
        {"id":"1","color":"0xE5847C"},
        {"id":"2","color":"0x58F9BB"},
        {"id":"3","color":"0x764344"},
        {"id":"4","color":"0x4F8C82"}
    ],
    "strings":
    {
        "constant":
        [
            {"id":"1","name":"string 1"},
            {"id":"2","name":"string 2"},
            {"id":"3","name":"string 3"},
            {"id":"4","name":"string 4"}
        ]
    },
    "data":
        [
            {"constant":"1","dataY":"2","dataZ":"2012-07-13"},
            {"constant":"1","dataY":"2","dataZ":"2012-07-14"},
            {"constant":"1","dataY":"5","dataZ":"2012-07-15"},
            {"constant":"1","dataY":"7","dataZ":"2012-07-16"},
            {"constant":"1","dataY":"4","dataZ":"2012-07-17"},
            {"constant":"1","dataY":"5","dataZ":"2012-07-18"},
            {"constant":"1","dataY":"6","dataZ":"2012-07-19"},
            {"constant":"1","dataY":"1","dataZ":"2012-07-20"},
            {"constant":"1","dataY":"6","dataZ":"2012-07-21"},
            {"constant":"1","dataY":"6","dataZ":"2012-07-22"},
            {"constant":"1","dataY":"1","dataZ":"2012-07-23"},
            {"constant":"1","dataY":"6","dataZ":"2012-07-24"},
            {"constant":"1","dataY":"6","dataZ":"2012-07-25"},
            {"constant":"1","dataY":"2","dataZ":"2012-07-26"},
            {"constant":"1","dataY":"5","dataZ":"2012-07-27"},
            {"constant":"1","dataY":"6","dataZ":"2012-07-28"},
            {"constant":"1","dataY":"4","dataZ":"2012-07-29"},
            {"constant":"1","dataY":"6","dataZ":"2012-07-30"},
            {"constant":"1","dataY":"8","dataZ":"2012-07-31"},
            {"constant":"1","dataY":"5","dataZ":"2012-08-01"},
            {"constant":"2","dataY":"7","dataZ":"2012-07-13"},
            {"constant":"2","dataY":"3","dataZ":"2012-07-14"},
            {"constant":"2","dataY":"3","dataZ":"2012-07-15"},
            {"constant":"2","dataY":"2","dataZ":"2012-07-16"},
            {"constant":"2","dataY":"5","dataZ":"2012-07-17"},
            {"constant":"2","dataY":"3","dataZ":"2012-07-18"},
            {"constant":"2","dataY":"6","dataZ":"2012-07-19"},
            {"constant":"2","dataY":"3","dataZ":"2012-07-20"},
            {"constant":"2","dataY":"2","dataZ":"2012-07-21"},
            {"constant":"2","dataY":"3","dataZ":"2012-07-22"},
            {"constant":"2","dataY":"4","dataZ":"2012-07-23"},
            {"constant":"2","dataY":"1","dataZ":"2012-07-24"},
            {"constant":"2","dataY":"3","dataZ":"2012-07-25"},
            {"constant":"2","dataY":"8","dataZ":"2012-07-26"},
            {"constant":"2","dataY":"4","dataZ":"2012-07-27"},
            {"constant":"2","dataY":"3","dataZ":"2012-07-28"},
            {"constant":"2","dataY":"4","dataZ":"2012-07-29"},
            {"constant":"2","dataY":"3","dataZ":"2012-07-30"},
            {"constant":"2","dataY":"4","dataZ":"2012-07-31"},
            {"constant":"2","dataY":"6","dataZ":"2012-08-01"},
            {"constant":"3","dataY":"3","dataZ":"2012-07-13"},
            {"constant":"3","dataY":"5","dataZ":"2012-07-14"},
            {"constant":"3","dataY":"5","dataZ":"2012-07-15"},
            {"constant":"3","dataY":"4","dataZ":"2012-07-16"},
            {"constant":"3","dataY":"2","dataZ":"2012-07-17"},
            {"constant":"3","dataY":"3","dataZ":"2012-07-18"},
            {"constant":"3","dataY":"5","dataZ":"2012-07-19"},
            {"constant":"3","dataY":"3","dataZ":"2012-07-20"},
            {"constant":"3","dataY":"5","dataZ":"2012-07-21"},
            {"constant":"3","dataY":"3","dataZ":"2012-07-22"},
            {"constant":"3","dataY":"2","dataZ":"2012-07-23"},
            {"constant":"3","dataY":"2","dataZ":"2012-07-24"},
            {"constant":"3","dataY":"4","dataZ":"2012-07-25"},
            {"constant":"3","dataY":"2","dataZ":"2012-07-26"},
            {"constant":"3","dataY":"6","dataZ":"2012-07-27"},
            {"constant":"3","dataY":"3","dataZ":"2012-07-28"},
            {"constant":"3","dataY":"1","dataZ":"2012-07-29"},
            {"constant":"3","dataY":"6","dataZ":"2012-07-30"},
            {"constant":"3","dataY":"4","dataZ":"2012-07-31"},
            {"constant":"3","dataY":"3","dataZ":"2012-08-01"},
            {"constant":"4","dataY":"5","dataZ":"2012-07-13"},
            {"constant":"4","dataY":"5","dataZ":"2012-07-14"},
            {"constant":"4","dataY":"3","dataZ":"2012-07-15"},
            {"constant":"4","dataY":"5","dataZ":"2012-07-16"},
            {"constant":"4","dataY":"1","dataZ":"2012-07-17"},
            {"constant":"4","dataY":"2","dataZ":"2012-07-18"},
            {"constant":"4","dataY":"5","dataZ":"2012-07-19"},
            {"constant":"4","dataY":"5","dataZ":"2012-07-20"},
            {"constant":"4","dataY":"1","dataZ":"2012-07-21"},
            {"constant":"4","dataY":"3","dataZ":"2012-07-22"},
            {"constant":"4","dataY":"2","dataZ":"2012-07-23"},
            {"constant":"4","dataY":"1","dataZ":"2012-07-24"},
            {"constant":"4","dataY":"5","dataZ":"2012-07-25"},
            {"constant":"4","dataY":"5","dataZ":"2012-07-26"},
            {"constant":"4","dataY":"2","dataZ":"2012-07-27"},
            {"constant":"4","dataY":"2","dataZ":"2012-07-28"},
            {"constant":"4","dataY":"7","dataZ":"2012-07-29"},
            {"constant":"4","dataY":"5","dataZ":"2012-07-30"},
            {"constant":"4","dataY":"4","dataZ":"2012-07-31"},
            {"constant":"4","dataY":"3","dataZ":"2012-08-01"}
        ]
};
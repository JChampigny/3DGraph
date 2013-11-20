3DGraph
=======

3D data representation on 3 axis

## Global

### Authors ###
- Jerome Champigny <jerome.champigny@247media.com>
- Josselin Muller <josselin.muller@247media.com>

### Description ###
This project allows you to represent multi-dimensional data in a dynamic 3D graph.
The user can move, rotate and zoom in the 3D world by using the mouse. He can also
filter the data he wants to see in the graph with the help of the legend panel.
The graph is built using JSON representation, format is explained in the JSON Format
chapter.

### Technologies ###
- JavaScript
- WebGL (with Three.js framework)

## Install Notes

Simply connect the API with your server by modifying index.html. The Communicator's
url should be the address of the JSON.

Css can be modified thru style.css in css file.

## JSON Format

### Settings

settings - optional
    scale
        logarithmic
        linear
    type
        curve
        barchart
        terrain

Settings are optional and allows to choose a scale for the graph
and a entrance type.

#### Scale
The scale is either linear which is perfect for small data gaps or
logarithmic which allows to display huge data gaps with a certain
coherence.

#### Type
The type defines the graph type displayed at first, then the menu
allows the user to choose another graph type.

    Curves
    Curves are a group of linked points forming a pseudo line
    chart modelized in a volume.

    Bars
    This representation builds a cuboid for each data point.

    Terrain
    The terrain shows spikes or drops with a different color
    code if the data is near the max.

### Axes

This object defines the displayed name of each three axes.

axes
    constant
    dataY
    dataZ

### Colors

This object specifies a static color for each "constant" id, where
"constant" is the axe.

colors
    [
        id
        color
    ]

### String

This optional object is used to display strings on the graph. It uses a child
object name after the concerned axe. It binds "data"'s axe id with the string.

strings - optional
    constant - optional
        id
            int
        name
            string
    dataY - optional
        id
            int
        name
            string
    dataZ - optional
        id
            int
        name
            string

### Data

data
    [
        constant
            int
            date
        dataY
            int
            date
        dataZ
            int
            date
    ]

# Example

Each value is an example showing what can be given to the corresponding key.

```json
{
    "settings":
    {
        "scale": "logarithmic",
        "type": "curve"
    },
    "axes":
    {
        "constant":"Category",
        "dataY":"Number of click",
        "dataZ":"User"
    },
    "colors":
    [
        {
            "id":"1",
            "color":"0x21C60F"
        },
        ...
    ],
    "strings":
    {
        "constant":
        [
            {
                "id":"1",
                "name":"Cars"
            },
        ...
        ]
    },
    "data":
    [
        {
            "constant":"1",
            "dataY":"5",
            "dataZ":"2012-06-22"
        },
        ...
    ]
}
```

java -jar ./closure/compiler.jar ^
     --js ./lib/Three.js ^
          ./lib/raf.js ^
          ./js/Utilities.js  ^
          ./js/GraphCamera.js ^
          ./js/MouseHandler.js ^
          ./js/Grid.js ^
          ./js/geometries/CurveGeo.js ^
          ./js/geometries/BarChartGeo.js ^
          ./js/geometries/MultiBarChartGeo.js ^
          ./js/geometries/TerrainGeo.js ^
          ./js/Communicator.js ^
          ./js/Space.js ^
          ./js/Samples.js ^
     --js_output_file ./closure/out/3dgraph.js
pause;
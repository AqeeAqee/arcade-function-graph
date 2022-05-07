game.stats=true

functionGraph.setScale(20)
// functionGraph.setMark(1)
// functionGraph.setGrid(1)
functionGraph.setOriginOffset(12345,67890)
functionGraph.setAxesPos(66,117)

functionGraph.addFuctionGraph(3, false,(x) => {
    functionGraph.setY(Math.sqrt(x))
})

// functionGraph.addFuctionGraph(2, true,(x) => {
//     functionGraph.setY(x**2)
// })

// functionGraph.addFuctionGraph(5, true, function (x) {
//     functionGraph.setY((45 - (x / 3)) * 4)
// })
// functionGraph.addFuctionGraph(5, true, function (x) {
//     functionGraph.setY((42 - (x / 5)) * 4)
// })

// //by default, all ghaph drawn on BackgroundImage
// //do following if want to draw on a image
// scene.setBackgroundImage(null)      // or any background image you want
// let canvas=image.create(150,110)    // any size
// functionGraph.setCanvas(canvas)          // set new image to be canvas of graph of functions
// sprites.create(canvas)              // for easy to operate

// functionGraph.canvas.drawRect(10,10,100,100,5)
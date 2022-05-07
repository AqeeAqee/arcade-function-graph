// + extension name: function/f(x) Graph
// + set offseted origin, and set position of axes
// drawing methods
// + position picker for offsetXY
// + cache image
// + x interval
// ? move cursor with btns , print Y Values at current cursor
// ? f(t)
// ? oscillometer
// demo: dataSerial[], dots/lines
// demo: common functions, x, x**2,sin(x), ...

//% icon="\uf201"
//% color=#BBBBBB weight=1 
//% groups='["Basic", "Advanced"]'
//% block="f(x) Graph"
namespace functionGraph{
    // type plotFunction = (x: number) => void
    export let functions: GraphFunction[] = []
    class GraphFunction {
        constructor(
            public handler: (x: number) => void,
            public color: number,
            public joinDots: boolean,

        ) {
        }
    }

    let imgCanvas = image.create(screen.width, screen.height)
    scene.setBackgroundImage(imgCanvas)

    const AXIS_OFFSET_MARGIN = 10
    let axesPosX = imgCanvas.width / 2, axesPosY = imgCanvas.height / 2
    let orginOffsetX = 0, orginOffsetY = 0
    let scale = 10
    let colorPlot = 2, colorMark = 1, colorGrid = 11, colorCursor = 2
    let markInterval = 1, gridInterval = 5

    let yValue: number = 0

    /**
     * Define a graph of a function(x). This will be called many times for each x, as long as x value in the canvas.
     * Actually, the stepX = 1/scale, one time per pixel on axis X
     * @param color Color for drawing funciton graph
     * @param joinDots connect dots(x,y) into lines, for funcitons which result values far away each others.
     * @param x the x in f(x), you can grag it into set Y=() block to define your f(x)
     */

    //% block="graph of y|=|f|(|$x|)|, in color$color=colorindexpicker, join dots $joinDots=toggleOnOff"
    //% draggableParameters="reporter"
    //% color.defl=2
    //% joinDots.defl=false
    //% blockAllowMultiple=1
    //% blockid=functionGraph_addFuctionGraph
    //% weight=100 group="Basic"
    export function addFuctionGraph(color: number, joinDots: boolean, handler: (x: number) => void) {
        //, joinDots?:boolean , color: number
        // let joinDots = false
        // let color =3
        if (joinDots != true && joinDots != false) joinDots = true

        if (!color) color = colorPlot
        color = Math.clamp(1, 15, color)

        const newCurve = new GraphFunction(handler, color, joinDots)
        if (!functions) functions = []
        functions.push(newCurve)
        redraw()
    }

    /**
     * Define your f(x), used inside "graph of y=f(x)..." block. 
     * Add more for each functions.
     * Drag the "x" from "graph of y=f(x)..." block into your function.
     * Don't call this, if given "x" out of its domain
     * @param y the f(x) defination, eg. f(x)=Math.sin(x), f(x)=x*x, f(x)=Math.abs(x-2)
     */
    //% block="set f|(|x|) =|$y"
    //% blockid=functionGraph_setY
    //% weight=99 group="Basic"
    export function setY(y: number) {
        yValue = y
    }

    /**
     * Set offset values of origin point (not screen pixel).
     */
    //% block="set origin offset x$x y$y"
    //% x.defl=0
    //% y.defl=0
    //% blockid=functionGraph_setOriginOffset
    //% weight=80 group="Advanced"
    export function setOriginOffset(x: number, y: number) {
        orginOffsetX = x
        orginOffsetY = y
        redraw()
    }

    /**
     * Set X axis and Y axis position in canvas, in pixel
     */
    //% block="set axes offset x$x y$y"
    //% x.defl=80
    //% y.defl=60
    //% blockid=functionGraph_setAxesPos
    //% weight=80 group="Advanced"
    //% x.shadow="positionPicker" y.shadow="positionPicker"
    export function setAxesPos(x: number, y: number) {
        axesPosX = x
        axesPosY = y
        redraw()
    }

    //% block="set scale$s"
    //% s.defl=10
    //% blockid=functionGraph_setScale
    //% weight=79 group="Advanced"
    export function setScale(s: number) {
        scale = s
        redraw()
    }

    //% block="set Mark color$colorMark=colorindexpicker||, grid color$colorGrid=colorindexpicker, cursor color$colorCursor=colorindexpicker"
    //% blockid=functionGraph_setcolors
    //% colorMark.defl=1
    //% colorGrid.defl=11
    //% colorCursor.defl=2
    //% weight=0 group="Advanced"
    //% deprecated blockHidden
    export function setColors(cMark: number, cGrid?: number, cCursor?: number) {
        colorMark = cMark
        if (cGrid) colorGrid = cGrid
        if (cCursor) colorCursor = cCursor
        redraw()
    }

    //% block="set Mark interval $interval||, color$color=colorindexpicker"
    //% blockid=functionGraph_setmark
    //% interval.defl=1 interval.min=0
    //% color.defl=1
    //% weight=70 group="Advanced"
    export function setMark(interval: number, color?: number) {
        markInterval = Math.ceil(interval)
        if (color) colorMark = color
        redraw()
    }

    //% block="set Grid interval $interval||, color$color=colorindexpicker"
    //% blockid=functionGraph_setgrid
    //% interval.defl=5 interval.min=0
    //% color.defl=11
    //% weight=69 group="Advanced"
    export function setGrid(interval: number, color?: number) {
        gridInterval = Math.ceil(interval)
        if (color) colorGrid = color
        redraw()
    }

    /**
     * Set canvas for all graphs of funcitons.
     * Axes positions will be set to the center of the new canvas, automatically. 
     * @param canvas Image on which all graph of functions drawing on. It been set as scene.BackgroundImage by default for convenience of beginner of this extension.
     */
    //% block="set canvas $canvas=background_image_picker"
    //% blockid=functionGraph_setCanvas
    //% weight=40 group="Advanced"
    export function setCanvas(canvas: Image) {
        if (canvas) {
            imgCanvas = canvas
            setAxesPos(canvas.width / 2, canvas.height / 2)
            // redraw() //called in setAxesPos()
        }
    }

    /**
     * Get canvas image
     */
    //% block="get canvas image"
    //% blockid=functionGraph_getCanvas
    //% weight=39 group="Advanced"
    export function getCanvas(): Image {
        return imgCanvas
    }

    /**
     * Don't need called usually, unless parameters changed, which presents in setY=f(x), outside the "addFuctionGraph(...)".
     * Blocks, that changing curve parameters, will call this automatically.
     */
    //% block="redraw canvas based on all parameters"
    //% blockid=functionGraph_redraw
    //% weight=50 group="Advanced"
    export function redraw() {
        imgCanvas.fill(15)

        if (gridInterval > 0) {
            let gridIntervalScaled = Math.ceil(scale * gridInterval)
            if (gridIntervalScaled < 2) gridIntervalScaled = 2
            for (let ix = axesPosX % (gridIntervalScaled); ix < imgCanvas.width; ix += gridIntervalScaled) {
                imgCanvas.drawLine(ix, 0, ix, imgCanvas.height, colorGrid)
            }
            for (let iy = axesPosY % (gridIntervalScaled); iy < imgCanvas.height; iy += gridIntervalScaled) {
                imgCanvas.drawLine(0, iy, imgCanvas.width, iy, colorGrid)
            }
        }

        if (markInterval > 0) {
            let markIntervalScaled = Math.ceil(scale * markInterval)
            if (markIntervalScaled < 2) markIntervalScaled = 2
            for (let ix = axesPosX % (markIntervalScaled); ix < imgCanvas.width; ix += markIntervalScaled) {
                imgCanvas.drawLine(ix, axesPosY + 1, ix, axesPosY - 1, colorMark)
            }
            for (let iy = axesPosY % (markIntervalScaled); iy < imgCanvas.width; iy += markIntervalScaled) {
                imgCanvas.drawLine(axesPosX + 1, iy, axesPosX - 1, iy, colorMark)
            }
        }

        imgCanvas.drawLine(0, axesPosY, imgCanvas.width, axesPosY, colorMark)
        imgCanvas.drawLine(axesPosX, 0, axesPosX, imgCanvas.height, colorMark)

        const originText = "(" + orginOffsetX + "," + orginOffsetY + ")"
        const orginPrintX = (imgCanvas.width - axesPosX < originText.length * image.font5.charWidth) ?
            axesPosX - originText.length * image.font5.charWidth +2:
            axesPosX +1
        const orginPrintY = (imgCanvas.height - axesPosY < image.font5.charHeight) ?
            axesPosY - image.font5.charHeight -2:
            axesPosY +3
        imgCanvas.print("(" + orginOffsetX + "," + orginOffsetY + ")", orginPrintX, orginPrintY, colorMark, image.font5)

        for (let cv of functions) {
            let lastX, lastY
            for (let x = -axesPosX / scale + orginOffsetX; x < (160 - axesPosX) / scale + orginOffsetX; x += 1 / scale) {
                yValue = null
                cv.handler(x)
                if (yValue == null || isNaN(yValue)) continue
                
                const newX = (x - orginOffsetX) * scale + axesPosX, newY = -(yValue - orginOffsetY) * scale + axesPosY
                if (!cv.joinDots)
                    imgCanvas.setPixel(newX, newY, cv.color)
                else if (!!lastX && !!lastY && !(lastY < 0 && newY > imgCanvas.height) && !(newY < 0 && lastY > imgCanvas.height)) {
                    imgCanvas.drawLine(lastX, lastY, newX, newY, cv.color)
                }
                // if()  //(newX<0||newX>imgCanvas.width||newY<0||newY>imgCanvas.height)
                //     lastX=undefined, lastY=undefined
                // else
                lastX = newX, lastY = newY
            }
        }
    }

}

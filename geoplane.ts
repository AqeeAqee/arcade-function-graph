
// x interval
// dataSerial[], dots/lines
// PrintValue
// control move with btns
// f(t)
// common functions, x, x**2,sin(x), ...
// drawing methods

//% icon="\uf201"
//% color=#AAAAAA weight=1 
//% groups='["Basic", "Advanced"]'
//% block="Geo Plane"
namespace geoplane {
    // type plotFunction = (x: number) => void
    export let curves: Curve[] = []
    class Curve {
        constructor(
            public handler: (x: number) => void,
            public color: number,
            public joinDots: boolean,

        ) {
        }
    }

    let _offsetX = screen.width / 2, _offsetY = screen.height / 2
    let _scale = 10
    let _colorPlot = 3, _colorMark = 1, _colorGrid = 11, _colorCursor=2
    let _markInterval=1, _gridInterval=5

    let y: number = 0


    //% block="draw curve Y by $x, in color$color=colorindexpicker, join dots $joinDots "
    //% draggableParameters="reporter"
    //% color.defl=3
    //% joinDots.defl=true
    //% blockAllowMultiple=1
    //% blockid=geoplane_drawCurve
    //% weight=100 group="Basic"
    export function drawCurve(color: number, joinDots: boolean,handler: (x: number) => void) {
        //, joinDots?:boolean , color: number
        // let joinDots = false
        // let color =3
        if (joinDots != true && joinDots !=false) joinDots=true

        if (!color) color = _colorPlot
        color = Math.clamp(1, 15, color)

        const newCurve = new Curve(handler, color, joinDots)
        if(!curves) curves=[]
        curves.push(newCurve)
    }

    //% block="set Y= |$v"
    //% weight=99 group="Basic"
    export function setY(v: number) {
        y = v
    }

    //% block="set origin offset x$offsetX y$offsetY"
    //% offsetX.defl=80
    //% offsetY.defl=60
    //% blockid=geoplane_setOffset
    //% weight=80 group="Advanced"
    export function setOffset(offsetX:number,offsetY:number){
        _offsetX=offsetX
        _offsetY=offsetY
    }

    //% block="set scale$scale"
    //% scale.defl=10
    //% blockid=geoplane_setScale
    //% weight=79 group="Advanced"
    export function setScale(scale: number) {
        _scale = scale
    }

    //% block="set Mark color$colorMark=colorindexpicker||, grid color$colorGrid=colorindexpicker, cursor color$colorCursor=colorindexpicker"
    //% blockid=geoplane_setcolors
    //% colorMark.defl=1
    //% colorGrid.defl=11
    //% colorCursor.defl=2
    //% weight=0 group="Advanced"
    //% deprecated blockHidden
    export function setColors(colorMark: number, colorGrid?: number, colorCursor?: number) {
        _colorMark = colorMark
        if (colorGrid) _colorGrid = colorGrid
        if (colorCursor) _colorCursor = colorCursor
    }

    //% block="set Mark interval $interval||, color$color=colorindexpicker"
    //% blockid=geoplane_setmark
    //% interval.min=0 interval.max=100
    //% color.defl=1
    //% weight=70 group="Advanced"
    export function setMark(interval: number, color?: number) {
        _markInterval = Math.ceil(interval)
        if (color) _colorMark = color
    }

    //% block="set Grid interval $interval||, color$color=colorindexpicker"
    //% blockid=geoplane_setgrid
    //% interval.min=0 interval.max=100
    //% color.defl=11
    //% weight=69 group="Advanced"
    export function setGrid(interval: number, color?: number) {
        _gridInterval = Math.ceil(interval)
        if (color) _colorGrid = color
    }

    game.onPaint(() => {
        if (curves.length < 1) return

        if (_gridInterval > 0) {
            for (let ix = _offsetX % (_scale * _gridInterval); ix < screen.width; ix += _scale * _gridInterval) {
                screen.drawLine(ix, 0, ix, screen.height, _colorGrid)
            }
            for (let iy = _offsetY % (_scale * _gridInterval); iy < screen.height; iy += _scale * _gridInterval) {
                screen.drawLine(0, iy, screen.width, iy, _colorGrid)
            }
        }

        if (_markInterval > 0) {
            for (let ix = _offsetX % (_scale * _markInterval); ix < screen.width; ix += _scale * _markInterval) {
                screen.drawLine(ix, _offsetY + 1, ix, _offsetY - 1, _colorMark)
            }
            for (let iy = _offsetY % (_scale * _markInterval); iy < screen.width; iy += _scale * _markInterval) {
                screen.drawLine(_offsetX + 1, iy, _offsetX - 1, iy, _colorMark)
            }
        }
        screen.drawLine(_offsetX, 0, _offsetX, screen.height, _colorMark)
        screen.drawLine(0, _offsetY, screen.width, _offsetY, _colorMark)

        for (let cv of curves) {
            let lastX, lastY
            y = null
            for (let x = -_offsetX; x < _offsetX; x += 1 / _scale) {
                cv.handler(x)
                if (y == null) continue
                const newX = x * _scale + _offsetX, newY = -y * _scale + _offsetY
                if (!cv.joinDots)
                    screen.setPixel(newX, newY, cv.color)
                else if (!!lastX && !!lastY && !(lastY < 0 && newY > screen.height) && !(newY < 0 && lastY > screen.height)) {
                    screen.drawLine(lastX, lastY, newX, newY, cv.color)
                }
                // if()  //(newX<0||newX>screen.width||newY<0||newY>screen.height)
                //     lastX=undefined, lastY=undefined
                // else
                lastX = newX, lastY = newY
            }
        }
    })

}

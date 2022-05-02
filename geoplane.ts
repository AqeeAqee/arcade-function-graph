// color, PrintValue
// control move with btns
// f(t)
// common functions, x, x**2,sin(x), ...
// data[]
// drawing methods

enum markType{
    //% block=Mark
    mark,
    //% block=Grid
    grid,
}

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

    let _markType=markType.grid
    let _offsetX = screen.width / 2, _offsetY = screen.height / 2
    let _scale = 10
    let _colorDefault = 1, _colorPlot = 2, _colorGrid = 11

    let y: number = 0


    //% block="draw curve Y by $x, in color$color=colorindexpicker, join dots $joinDots "
    //% draggableParameters="reporter"
    //% color.defl=3
    //% joinDots.defl=true
    //% blockAllowMultiple=1
    //% blockid=geoplane_plot
    export function plot(color: number, joinDots: boolean,handler: (x: number) => void) {
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
    export function setY(v: number) {
        y = v
    }

    game.onPaint(() => {
        if (curves.length < 1) return

        for (let ix = Math.max(0, _offsetX % _scale); ix < screen.width; ix += _scale) {
            if(_markType==markType.mark)
                screen.drawLine(ix, _offsetY + 1, ix, _offsetY - 1, _colorDefault)
            else
                screen.drawLine(ix, 0, ix, screen.height, _colorGrid)
        }
        screen.drawLine(_offsetX, 0, _offsetX, screen.height, _colorDefault)

        for (let iy = Math.max(0, _offsetY % _scale); iy < screen.width; iy += _scale) {
            if(_markType == markType.mark)
                screen.drawLine(_offsetX + 1, iy, _offsetX - 1, iy, _colorDefault)
            else
                screen.drawLine(0, iy, screen.width, iy, _colorGrid)
        }
        screen.drawLine(0, _offsetY, screen.width, _offsetY, _colorDefault)

        for(let cv of curves){
            let lastX, lastY
            y=null
            for (let x = -_offsetX; x < _offsetX; x += 1/_scale) {
                cv.handler(x)
                if(y==null) continue
                const newX = x * _scale + _offsetX, newY = -y * _scale + _offsetY
                if (!cv.joinDots)
                    screen.setPixel(newX, newY, cv.color)
                else if (!!lastX && !!lastY && Math.abs(lastY - newY) < screen.height) {
                    screen.drawLine(lastX, lastY, newX, newY, cv.color)
                }
                // if()  //(newX<0||newX>screen.width||newY<0||newY>screen.height)
                //     lastX=undefined, lastY=undefined
                // else
                    lastX = newX, lastY = newY
            }
        }
    })

    //% block="set origin offset x$offsetX y$offsetY"
    //% offsetX.defl=80
    //% offsetY.defl=60
    //% blockid=geoplane_setOffset
    export function setOffset(offsetX:number,offsetY:number){
        _offsetX=offsetX
        _offsetY=offsetY
    }

    //% block="set scale$scale"
    //% scale.defl=10
    //% blockid=geoplane_setScale
    export function setScale(scale: number) {
        _scale = scale
    }

    //% block="set scale mark type $v"
    //% v.defl=markType.mark
    //% blockid=geoplane_setMarkType
    export function setMarkType(v: markType) {
        _markType = v
    }

}

// geoplane.plot((x) => {
//     return x * x
// })
// geoplane.plot((x) => {
//     return x
// })

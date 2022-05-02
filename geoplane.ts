// color, PrintValue
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
//% color=#0ffffff weight=1 
//% groups='["Basic", "Advanced"]'
//% block="Geo Plane"
namespace geoplane{
    type plotFunction =(x:number)=>void
    let curves: Curve[]=[]
    class Curve {
        constructor(
            public plot:plotFunction, 
            public color:number,
            public joinDots:boolean,

            ){
        }
    }

    let _markType=markType.grid
    let _offsetX=screen.width/2, _offsetY=screen.height/2
    let _scale=10
    let _colorDefault=1, _colorPlot=2, _colorGrid=11

    let y:number=0


    //% block="plot y=function( $x ) ||with color $color, join dots with line $joinDots"
    //% draggableParameters="reporter"
    //% x.shim=reporter
    //% color.defl=_colorPlot
    //% joinDots.defl=true
    export function plot(handler: (x: number) => void, color?: number, joinDots?:boolean){
        if(!joinDots) joinDots=true

        if (!color) color = _colorPlot
        color=Math.clamp(1, 15, color)

        curves.push(new Curve(handler, color, joinDots))
    }

    //% block="set Y(function(x))=$v"
    export function setY(v:number){
        y=v
    }

img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`
    game.onPaint(()=>{

//grid
        for (let ix = Math.max(0, _offsetX % _scale); ix < screen.width; ix += _scale) {
            if(_markType==markType.mark)
                screen.drawLine(ix, _offsetY+1, ix, _offsetY - 1, _colorDefault)
            else
                screen.drawLine(ix, 0, ix, screen.height, _colorGrid)
        }
        screen.drawLine(_offsetX, 0, _offsetX, screen.height, _colorDefault)

        for (let iy = Math.max(0, _offsetY % _scale); iy < screen.width; iy += _scale) {
            if (_markType == markType.mark)
                screen.drawLine(_offsetX + 1, iy, _offsetX - 1, iy, _colorDefault)
            else
                screen.drawLine(0, iy, screen.width, iy, _colorGrid)
        }
        screen.drawLine(0, _offsetY, screen.width, _offsetY, _colorDefault)

        curves.forEach((curve)=>{
            let lastX,lastY
            for(let x=-_offsetX;x<_offsetX;x+=.1){
                curve.plot(x)
                const newX = x * _scale + _offsetX, newY = -y * _scale + _offsetY
                if(!curve.joinDots)
                    screen.setPixel(x,y,curve.color)
                else if(!!lastX&&!!lastY){
                    screen.drawLine(lastX,lastY,newX,newY, curve.color)
                }
                lastX=newX
                lastY=newY
            }
        })
    })

    //% block="set origin offset x$offsetX y$offsetY"
    //% offsetX.defl=screen.width/2
    //% offsetY.defl=screen.height/2
    export function setOffset(offsetX:number,offsetY:number){
        _offsetX=offsetX
        _offsetY=offsetY
    }

    //% block="set scale$scale"
    //% scale.defl=10
    export function setScale(scale: number) {
        _scale = scale
    }

    //% block="set scale$scale"
    //% scale.defl=10
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

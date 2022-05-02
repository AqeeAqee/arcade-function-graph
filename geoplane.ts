
namespace geoplane{

    let _offsetX=screen.width/2, _offsetY=screen.height/2
    let _scale=10
    let _colorPlot=2

    type plotFunction =(x:number)=>number
    let handlers: plotFunction[]=[]


    //% block="plot y by $x"
    export function plot(handler: plotFunction){
        handlers.push(handler)
    }

    game.onPaint(()=>{
        handlers.forEach((h)=>{
            for(let x=-_offsetX;x<_offsetX;x+=.1){
                let y:number =h(x)
                screen.setPixel(x * _scale + _offsetX, -y * _scale + _offsetY,2)
            }
        })
    })

    //% block="set origin offset x$offsetX y$offsetY"
    export function setOffset(offsetX:number,offsetY:number){
        _offsetX=offsetX
        _offsetY=offsetY
    }

    //% block="set scale$scale"
    export function setScale(scale:number){
        _scale=scale
    }

}


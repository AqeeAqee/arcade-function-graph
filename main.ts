
let a=0
game.onUpdate(()=>{

})

geoplane.setMarkType(markType.mark)
geoplane.setScale(29)
geoplane.setOffset(80,110)
geoplane.plot((x) => {
    geoplane.setY(x ** 2)
},3, false)
geoplane.plot((x) => {
    geoplane.setY(x ** 1)
}, 5)

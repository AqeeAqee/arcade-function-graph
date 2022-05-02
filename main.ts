

// geoplane.setMarkType(markType.mark)
// geoplane.setScale(29)
// geoplane.setOffset(80,110)

geoplane.plot(3, true,(x) => {
    geoplane.setY(Math.tan(x))
})

geoplane.plot(2, true,(x) => {
    geoplane.setY(x ** 3)
})

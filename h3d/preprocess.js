export function preprocess(eTempFloorplan) {
    const copy = JSON.parse(JSON.stringify(eTempFloorplan))
    const barycenter = getBarycenter(copy)
    for (const level of copy.levels) {
        for (const room of level.RectangleRoom || []) {
            for (let i = 0; i < room.points.length; i += 2) {
                room.points[i] -= barycenter[0]
                room.points[i + 1] -= barycenter[1]
                room.points[i + 1] *= -1
            }
        }
        const snappableTypes = ['Door', 'Window', 'Radiator']
        for (const snappableType of snappableTypes) {
            const snappables = level[snappableType] || []
            for (const snappable of snappables) {
                snappable.position.x -= barycenter[0]
                snappable.position.y -= barycenter[1]
                snappable.rotation = -snappable.rotation ?? 0
                snappable.position.y *= -1
            }
        }
    }
    return copy
}

function getBarycenter(eTempFloorplan) {
    const level = eTempFloorplan.levels[0]
    const rooms = level.RectangleRoom || []
    const xs = []
    const ys = []
    for (const room of rooms) {
        for (let i = 0; i < room.points.length; i += 2) {
            xs.push(room.points[i])
            ys.push(room.points[i + 1])
        }
    }
    const xMin = Math.min(...xs)
    const xMax = Math.max(...xs)
    const yMin = Math.min(...ys)
    const yMax = Math.max(...ys)
    const x = (xMin + xMax) / 2
    const y = (yMin + yMax) / 2 
    return [x, y]
}
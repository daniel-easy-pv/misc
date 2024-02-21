export function preprocess(eTempFloorplan) {
    const copy = JSON.parse(JSON.stringify(eTempFloorplan))
    for (const level of copy.levels) {
        for (const room of level.rooms || []) {
            for (let i = 0; i < room.points.length; i += 2) {
                room.points[i + 1] *= -1
            }
        }
        const snappableTypes = [
            'doors', 
            'windows', 
            'radiators', 
            'heatPumps', 
            'heatPumpCylinders'
        ]
        for (const snappableType of snappableTypes) {
            const snappables = level[snappableType] || []
            for (const snappable of snappables) {
                for (let i = 0; i < snappable.points.length; i += 2) {
                    snappable.points[i + 1] *= -1
                }
            }
        }
        const walls = level.walls || []
        for (const wall of walls) {
            wall.position.y *= -1
            wall.rotation *= -1
            for (const neighbour of wall.neighbours || []) {
                const snappableTypes = ['windows', 'doors']
                for (const snappableType of snappableTypes) {
                    for (const snappable of neighbour[snappableType] || []) {
                        for (let i = 0; i < snappable.points.length; i += 2) {
                            snappable.points[i + 1] *= -1
                        }
                    }
                }
            }
        }

    }
    return copy
}

export function getBarycenter(eTempFloorplan) {
    const level = eTempFloorplan.levels[0]
    const rooms = level.rooms || []
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

export function getRectangleProperties(rectangle) {
    const x = (rectangle[0] + rectangle[2] + rectangle[4] + rectangle[6]) / 4
    const y = (rectangle[1] + rectangle[3] + rectangle[5] + rectangle[7]) / 4
    const d = Math.round(Math.sqrt((rectangle[2] - rectangle[0]) ** 2 + 
    (rectangle[3] - rectangle[1]) ** 2))
    const w = Math.round(Math.sqrt((rectangle[4] - rectangle[2]) ** 2 + 
    (rectangle[5] - rectangle[3]) ** 2))
    const rotation = -Math.round((Math.atan2(rectangle[3] - rectangle[1]
        , rectangle[2] - rectangle[0]) * 180) / Math.PI) + 90
    return { d, w, x, y, rotation }
}
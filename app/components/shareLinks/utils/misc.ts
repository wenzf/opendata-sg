import  {  createElement } from "react"


export const mkSVG = ([...props]) => {
    const [
        label,
        fill,
        viewBoxFragment,
        path,
        size,
        isCircle,
        borderRadius
    ] = props
    const viewBox = `0 0 ${viewBoxFragment} ${viewBoxFragment}`
    const frameProps= isCircle
        ? { cx: 32,  cy: 32, fill, key: 1} 
        : { height: 64, width: 64, rx: borderRadius, ry: borderRadius, fill, key: 1 }

    const pathEl = createElement('path', { d: path, fill, key: 2 })
    const circleOrRectEl = createElement(isCircle ? 'circle' : 'rect', frameProps)
    return createElement('svg', { viewBox, width: size, height: size, "aria-label": label, key: `k${label}` }, [pathEl, circleOrRectEl])
}



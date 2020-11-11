import { useEffect } from 'react';

function useMouseCursorEffect(
	hoverTargetName: string,
	enableDraw: boolean,
	layerRef: React.MutableRefObject<HTMLCanvasElement | null>
) {

	useEffect(() => {
		if (!layerRef.current) return
		let cursorStyle = 'initial'
		if (enableDraw) {
			cursorStyle = 'crosshair'
		}
		else if (hoverTargetName === 'rect_selected')
			cursorStyle = 'move'
		else if (hoverTargetName === 'rect')
			cursorStyle = 'pointer'
		else if (hoverTargetName === 'top-left _anchor' || hoverTargetName === 'bottom-right _anchor')
			cursorStyle = 'nw-resize'
		else if (hoverTargetName === 'top-center _anchor' || hoverTargetName === 'bottom-center _anchor')
			cursorStyle = 's-resize'
		else if (hoverTargetName === 'top-right _anchor' || hoverTargetName === 'bottom-left _anchor')
			cursorStyle = 'ne-resize'
		else if (hoverTargetName === 'middle-left _anchor' || hoverTargetName === 'middle-right _anchor')
			cursorStyle = 'w-resize'
		layerRef.current.style.cursor = cursorStyle
		//This is used to rerender the mouse cursor, 
		//otherwise user would need to move the mouse to rerender it
		layerRef.current.style.visibility = 'hidden'
		layerRef.current.style.visibility = 'visible'
	}, [ hoverTargetName, enableDraw, layerRef ])
}

export default useMouseCursorEffect;
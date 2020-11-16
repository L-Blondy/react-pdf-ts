import './ProgressCircle.scss'
import React from 'react';

function ProgressCircle({
	progress = 0,
	strokeWidth = 4,
	ballStrokeWidth = 16,
	reduction = 0.25,
	transitionDuration = 0.5,
	transitionTimingFunction = 'ease',
	background = '#dde2e9',
	hideValue = false,
	gradient = [ { stop: 0.0, color: '#00bc9b' }, { stop: 1, color: '#5eaefd' } ],
	className,
}: any) {

	const width = 200;
	const center = width / 2;
	const height = 200
	const [ unique ] = React.useState(() => Math.random().toString());
	const rotate = 90 + 180 * reduction;
	const r = center - strokeWidth / 2 - ballStrokeWidth / 2;
	const circumference = Math.PI * r * 2;
	const offset = circumference * (100 - progress * (1 - reduction)) / 100;

	return (
		<div className={'progress_circle ' + className}>
			{!hideValue &&
				<div className='value'>
					{progress}%
				</div>
			}
			<svg viewBox={`0 0 ${width} ${height}`}>
				<defs>
					<linearGradient id={"gradient" + unique} x1="0%" y1="0%" x2="0%" y2="100%">
						{gradient.map(({ stop, color }: { stop: number, color: string }) => <stop key={stop} offset={stop * 100 + "%"} stopColor={color} />)}
					</linearGradient>
				</defs>

				<circle
					transform={`rotate(${rotate} ${center} ${center})`}
					id="path"
					cx={center}
					cy={center}
					r={r}
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={circumference * reduction}
					fill="none"
					stroke={background}
					strokeLinecap="round">
				</circle>
				<circle
					style={{ transition: `stroke-dashoffset ${transitionDuration}s ${transitionTimingFunction}` }}
					transform={`rotate(${rotate} ${center} ${center})`}
					id="path"
					cx={center}
					cy={center}
					r={r}
					strokeWidth={strokeWidth}
					strokeDasharray={`${circumference}`}
					strokeDashoffset={offset}
					fill="none"
					stroke={`url(#gradient${unique})`}
					strokeLinecap="round">
				</circle>
			</svg>
		</div>);
}

export default React.memo(ProgressCircle)
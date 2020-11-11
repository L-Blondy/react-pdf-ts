import React from 'react'

interface Props {
	when: boolean
}

const PDFPagePreloader = ({ when }: Props) => {
	const radius = 18
	const preloader_width = '20%'

	if (!when) return null

	return (
		<svg
			className='pdf_page_placeholder'
			width={preloader_width}
			viewBox="0 0 38 38"
			xmlns="http://www.w3.org/2000/svg"
			aria-label='loading' >

			<g fill="none" fillRule="evenodd">
				<g transform="translate(1 1)" strokeWidth="2">
					<circle strokeOpacity=".5" cx="18" cy="18" r={radius} />
					<path d="M36 18c0-9.94-8.06-18-18-18">
						<animateTransform
							attributeName="transform"
							type="rotate"
							from="0 18 18"
							to="360 18 18"
							dur="1s"
							repeatCount="indefinite"
						/>
					</path>
				</g>
			</g>
		</svg>
	)
}

export default PDFPagePreloader
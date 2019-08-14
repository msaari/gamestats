import React, { useEffect } from "react"

const DisplayText = ({ action, data, params, heading }) => {
	useEffect(() => {
		if (data.length === 0) action(params)
	}, [action, data, params])

	return (
		<>
			<h3>{heading}</h3>
			<div>
				{data.split("\n").map((item, key) => (
					<span key={key}>
						{item}
						<br />
					</span>
				))}
			</div>
		</>
	)
}

export default DisplayText

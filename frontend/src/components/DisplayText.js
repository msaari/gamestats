import React from "react"

const DisplayText = ({ data, heading }) => {
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

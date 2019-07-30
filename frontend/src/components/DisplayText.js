import React, { useState, useEffect } from "react"

const DisplayText = ({ service, path, params, heading }) => {
	const [textContent, setTextContent] = useState("")

	useEffect(() => {
		service.getPath(path, params).then(response => {
			setTextContent(response)
		})
	}, [path, params, service])

	return (
		<>
			<h3>{heading}</h3>
			<div>
				{textContent.split("\n").map((item, key) => (
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

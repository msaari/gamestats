import React from "react"

const ExportList = ({ text }) => {
	const displayText = text.join("\n")
	return (
		<div>
			<h2>Exportable list</h2>
			<pre>{displayText}</pre>
		</div>
	)
}

export default ExportList

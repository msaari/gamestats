import React from "react"

const Plays = ({ plays, totalPlays }) => {
	const totalStyle = {
		color: "#aaaaaa",
		fontSize: "90%"
	}

	if (plays === totalPlays) return <span>{plays}</span>
	return (
		<span>
			{plays} <span style={totalStyle}> / {totalPlays}</span>
		</span>
	)
}

export default Plays

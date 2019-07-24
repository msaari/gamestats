import React from "react"

const boxStyle = {
	display: "inline-block",
	width: "30px",
	textAlign: "center",
	color: "#000000"
}

const style10 = {
	backgroundColor: "#00cc00"
}

const style9 = {
	backgroundColor: "#33cc99"
}

const style8 = {
	backgroundColor: "#66ff99"
}

const style7 = {
	backgroundColor: "#99ffff"
}

const style6 = {
	backgroundColor: "#9999ff"
}

const style5 = {
	backgroundColor: "#cc99ff"
}

const style4 = {
	backgroundColor: "#ff66cc"
}

const style3 = {
	backgroundColor: "#ff6699"
}

const style2 = {
	backgroundColor: "#ff3366"
}

const style1 = {
	backgroundColor: "#ff0000"
}

const Rating = ({ value }) => {
	let spanStyle = {}
	switch (value) {
		case 10:
			spanStyle = Object.assign({}, boxStyle, style10)
			break
		case 9:
			spanStyle = Object.assign({}, boxStyle, style9)
			break
		case 8:
			spanStyle = Object.assign({}, boxStyle, style8)
			break
		case 7:
			spanStyle = Object.assign({}, boxStyle, style7)
			break
		case 6:
			spanStyle = Object.assign({}, boxStyle, style6)
			break
		case 5:
			spanStyle = Object.assign({}, boxStyle, style5)
			break
		case 4:
			spanStyle = Object.assign({}, boxStyle, style4)
			break
		case 3:
			spanStyle = Object.assign({}, boxStyle, style3)
			break
		case 2:
			spanStyle = Object.assign({}, boxStyle, style2)
			break
		case 1:
			spanStyle = Object.assign({}, boxStyle, style1)
			break
		default:
			spanStyle = boxStyle
	}
	return <span style={spanStyle}>{value}</span>
}

export default Rating

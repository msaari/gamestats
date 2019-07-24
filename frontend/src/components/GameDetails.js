import React from "react"
import Table from "react-bootstrap/Table"
import Rating from "./Rating"

const GameDetails = ({ game }) => {
	return (
		<Table size="sm">
			<tbody>
				<tr>
					<td>Designers</td>
					<td>{game.designers}</td>
				</tr>
				<tr>
					<td>Publisher</td>
					<td>{game.publisher}</td>
				</tr>
				<tr>
					<td>Year</td>
					<td>{game.year}</td>
				</tr>
				<tr>
					<td>BGG</td>
					<td>
						<a
							href={"https://www.boardgamegeek.com/boardgame/" + game.bgg + "/"}
						>
							{game.bgg}
						</a>
					</td>
				</tr>
				<tr>
					<td>Rating</td>
					<td>
						<Rating value={game.rating} />
					</td>
				</tr>
				<tr>
					<td>Length</td>
					<td>{game.gameLength}</td>
				</tr>
				<tr>
					<td>Parent</td>
					<td>{game.parent}</td>
				</tr>
			</tbody>
		</Table>
	)
}

export default GameDetails

import React, { useState } from "react"

import Rating from "./Rating"
import GameEditForm from "./GameEditForm"
import GameDetails from "./GameDetails"

const Game = ({ game, counter, isAuth }) => {
	const [moreVisible, setMoreVisible] = useState(null)

	const toggleMoreVisibility = () => {
		setMoreVisible(!moreVisible)
	}

	const moreVisibilityStyle = {
		display: moreVisible ? "" : "none",
		paddingTop: 10
	}

	return (
		<tr>
			<td className="counter">{counter}</td>
			<td>
				<span onClick={toggleMoreVisibility}>{game.name}</span>
				<div style={moreVisibilityStyle}>
					{isAuth && (
						<GameEditForm game={game} toggleVisibility={toggleMoreVisibility} />
					)}
					{!isAuth && <GameDetails game={game} />}
				</div>
			</td>
			<td>{game.plays}</td>
			<td>{game.wins}</td>
			<td>
				<Rating value={game.rating} />
			</td>
		</tr>
	)
}

export default Game

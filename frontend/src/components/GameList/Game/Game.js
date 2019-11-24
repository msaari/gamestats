import React, { useState } from "react"
import Rating from "./Rating/Rating"
import Plays from "./Plays/Plays"
import GameEditForm from "./GameEditForm/GameEditForm"
import GameDetails from "./GameDetails/GameDetails"
import FormModal from "../../FormModal"
import { useOvermind } from "../../../overmind"

const Game = ({ game, counter }) => {
	const { state } = useOvermind()
	const isAuth = state.user ? true : false

	const [editForm, setEditForm] = useState(false)

	const closeModal = () => {
		setEditForm(false)
	}

	const openModal = () => {
		setEditForm(true)
	}

	const years = new Date().getFullYear() - game.firstYear + 1

	return (
		<tr>
			<td className="counter">{counter}</td>
			<td>
				<span onClick={openModal}>{game.name}</span>
				{isAuth && (
					<FormModal
						heading="Edit game"
						show={editForm}
						closeModal={closeModal}
					>
						<GameEditForm game={game} modalCloser={closeModal} />
					</FormModal>
				)}
				{!isAuth && (
					<FormModal
						heading="Game details"
						show={editForm}
						closeModal={closeModal}
					>
						<GameDetails game={game} />
					</FormModal>
				)}
			</td>
			<td>
				<Plays plays={game.plays} totalPlays={game.totalPlays} />
			</td>
			<td>{game.wins}</td>
			<td>
				<Rating value={game.rating} />
			</td>
			<td>{game.monthMetric}</td>
			<td>
				{game.yearMetric}/{years}
			</td>
			<td>{game.happiness}</td>
			<td>{game.hotness}</td>
		</tr>
	)
}

export default Game

class Game {
	constructor(name, id, data) {
		this.id = id
		this.name = name
		this.plays = 0
		this.wins = 0
		this.designers = data.designers
		this.publisher = data["publisher"]
		this.year = data.year
		this.bgg = data.bgg
		this.rating = data.rating
		this.gameLength = data["length"]
		this.parent = data.parent
		this.owned = data.owned
		this.happiness = 0
	}

	addSession(plays, wins) {
		this.addPlays(plays)
		this.addWins(wins)
	}

	addPlays(plays) {
		this.plays += parseInt(plays)
		this.updateHappiness()
	}

	addWins(wins) {
		this.wins += parseInt(wins)
	}

	updateHappiness() {
		this.happiness = Math.round(
			(this.rating - 4.5) * (this.gameLength * this.plays)
		)
	}
}

module.exports = Game

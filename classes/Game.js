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
		this.hotness = 0
		this.totalPlays = data.totalPlays
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
		const ratio =
			this.plays && this.totalPlays ? 1 + this.plays / this.totalPlays : 0
		this.happiness = Math.round(
			(this.rating - 4.5) * (this.gameLength * this.plays)
		)
		this.hotness = Math.round(
			ratio * ratio * Math.sqrt(this.plays) * this.happiness
		)
		this.happiness = Number.parseFloat(Math.log10(this.happiness)).toPrecision(
			3
		)
		this.hotness = Number.parseFloat(Math.log10(this.hotness)).toPrecision(3)
		if (isNaN(this.happiness)) this.happiness = 0
		if (isNaN(this.hotness)) this.hotness = 0
	}
}

module.exports = Game

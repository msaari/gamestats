class Game {
	constructor(name, id, data) {
		this.id = id
		this.name = name
		this.plays = 0
		this.playsPerYear = {}
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
		this.sessions = []
		this.monthMetric = 0
		this.months = new Set()
		this.yearMetric = 0
		this.years = new Set()
		this.firstYear = null
		this.lastYear = null
		this.stayingPower = 0
	}

	addSession(session, includeSessions) {
		this.addPlays(session.plays, session.date)
		this.addWins(session.wins)
		this.manageDateData(session.date)
		if (includeSessions) {
			this.sessions.push({
				date: session.date,
				players: session.players,
				plays: session.plays,
				wins: session.wins
			})
		}
	}

	addPlays(plays, date) {
		this.plays += parseInt(plays)
		this.updateHappiness()

		const year = date.getFullYear()
		let playsPerYear = this.playsPerYear[year]
		!playsPerYear
			? (playsPerYear = parseInt(plays))
			: (playsPerYear += parseInt(plays))
		this.playsPerYear[year] = playsPerYear
	}

	addWins(wins) {
		this.wins += parseInt(wins)
	}

	manageDateData(date) {
		const month = date.getMonth()
		const year = date.getFullYear()
		const metricMonth = `${year}/${month}`

		this.months = this.months.add(metricMonth)
		this.monthMetric = this.months.size

		this.years = this.years.add(year)
		this.yearMetric = this.years.size

		if (!this.firstYear || this.firstYear > year) this.firstYear = year
		if (!this.lastYear || this.lastYear < year) this.lastYear = year
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

	updateStayingPower(from, to) {
		let sumOfWeights = 0
		for (let year = from; year <= to; year++) {
			const yearWeight = Math.pow(5 / 6, to - year)
			sumOfWeights += yearWeight
		}

		const currentYear = new Date().getFullYear()
		const rawStayingPower = Object.entries(this.playsPerYear).reduce(
			(sp, [year, plays]) => {
				const yearWeight = Math.pow(5 / 6, currentYear - year)
				sp.sumOfValues += Math.sqrt(plays * (this.gameLength / 60)) * yearWeight
				sp.weightedAverage = Math.pow(sp.sumOfValues / sumOfWeights, 2)
				return sp
			},
			{ sumOfWeights: 0, sumOfValues: 0, weightedAverage: 0 }
		)
		const lengthStayingPower = rawStayingPower.weightedAverage
		this.stayingPower = Number.parseFloat(lengthStayingPower).toPrecision(3)
	}
}

module.exports = Game

const moment = require("moment")

const readDateParam = query => {
	let dateParam = null

	if (query.from) {
		dateParam = generateRangeDateParam(query)
	}

	if (query.week || query.month || query.year) {
		dateParam = generateWeekDateParam(query)
	}

	return dateParam
}

const generateWeekDateParam = ({ week, month, year }) => {
	year = Number.isInteger(parseInt(year)) ? parseInt(year) : null
	month = Number.isInteger(parseInt(month)) ? parseInt(month) : null
	week = Number.isInteger(parseInt(week)) ? parseInt(week) : null

	let dateParam = {}

	if (year && month) {
		const theMonth = moment(year + " " + month, "YYYY MM")

		dateParam = {
			date: {
				$gte: `${theMonth.startOf("month").format("YYYY-MM-DD")}`,
				$lte: `${theMonth.endOf("month").format("YYYY-MM-DD")}`
			}
		}
	} else if (year && week) {
		const theWeek = moment(year + "W" + week)
		dateParam = {
			date: {
				$gte: `${theWeek.startOf("isoWeek").format("YYYY-MM-DD")}`,
				$lte: `${theWeek.endOf("isoWeek").format("YYYY-MM-DD")}`
			}
		}
	} else if (year) {
		const theYear = moment(year, "YYYY")

		dateParam = {
			date: {
				$gte: `${theYear.startOf("year").format("YYYY-MM-DD")}`,
				$lte: `${theYear.endOf("year").format("YYYY-MM-DD")}`
			}
		}
	}

	return dateParam
}

const generateRangeDateParam = ({ from, to }) => {
	if (!to) {
		const now = moment()
		to = now.format("YYYY-MM-DD")
	}

	const toNextDay = moment(to)
		.add(1, "days")
		.format("YYYY-MM-DD")
	console.log(toNextDay)

	let dateParam = {
		date: {
			$gte: `${from}`,
			$lt: `${toNextDay}`
		}
	}
	console.log(dateParam)
	return dateParam
}

module.exports = {
	readDateParam
}

const dayjs = require("dayjs")

const readDateParam = (query) => {
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

	var customParseFormat = require("dayjs/plugin/customParseFormat")
	dayjs.extend(customParseFormat)

	if (year && month) {
		const theMonth = dayjs(
			year + " " + month.toString().padStart(2, "0"),
			"YYYY MM"
		)

		dateParam = {
			date: {
				$gte: `${theMonth.startOf("month").format("YYYY-MM-DD")}`,
				$lte: `${theMonth.endOf("month").format("YYYY-MM-DD")} 23:59:59`,
			},
		}
		console.log(dateParam)
	} else if (year && week) {
		var isoWeek = require("dayjs/plugin/isoWeek")
		dayjs.extend(isoWeek)

		const theWeek = dayjs(year + "W" + week)
		dateParam = {
			date: {
				$gte: `${theWeek.startOf("isoWeek").format("YYYY-MM-DD")}`,
				$lte: `${theWeek.endOf("isoWeek").format("YYYY-MM-DD")} 23:59:59`,
			},
		}
	} else if (year) {
		const theYear = dayjs(year, "YYYY")

		dateParam = {
			date: {
				$gte: `${theYear.startOf("year").format("YYYY-MM-DD")}`,
				$lte: `${theYear.endOf("year").format("YYYY-MM-DD")}`,
			},
		}
	}

	return dateParam
}

const generateRangeDateParam = ({ from, to }) => {
	if (!to) {
		const now = dayjs()
		to = now.format("YYYY-MM-DD")
	}

	let dateParam = {
		date: {
			$gte: `${from}`,
			$lte: `${to} 23:59:59`,
		},
	}

	return dateParam
}

module.exports = {
	readDateParam,
}

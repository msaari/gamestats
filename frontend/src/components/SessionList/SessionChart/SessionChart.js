import React from "react"
import { Line } from "react-chartjs-2"
import { useAppState } from "../../../overmind"
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
} from "chart.js"

const SessionChart = () => {
	const { state } = useAppState()

	ChartJS.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Tooltip
	)

	const options = {
		responsive: true,
		plugins: {
			legend: false,
		},
		scales: {
			y: {
				min: 0,
				ticks: {
					beginAtZero: true,
					stepSize: 1,
				},
			},
		},
	}

	const yearLabels = new Set()
	const monthLabels = new Set()
	state.sessionList.forEach((entry) => {
		var date = new Date(entry.date)
		var year = date.getFullYear()
		var month = date.getMonth() + 1
		var monthKey = month < 10 ? `${year}-0${month}` : `${year}-${month}`

		yearLabels.add(year)
		monthLabels.add(monthKey)
	})

	const oldestYear = Math.min(...yearLabels)
	let oldestYearMonth = "9999-99"
	monthLabels.forEach((entry) => {
		if (entry < oldestYearMonth) {
			oldestYearMonth = entry
		}
	})

	if (oldestYearMonth) {
		const today = new Date()
		const currentYear = today.getFullYear()
		const currentMonth = today.getMonth() + 1
		const oldestYear = parseInt(oldestYearMonth.split("-")[0])
		const oldestMonth = parseInt(oldestYearMonth.split("-")[1])
		for (let i = oldestYear; i <= currentYear; i++) {
			for (let j = 1; j <= 12; j++) {
				if (
					(i === oldestYear && j > oldestMonth) ||
					(i > oldestYear && i < currentYear) ||
					(i === currentYear && j <= currentMonth)
				) {
					j < 10 ? monthLabels.add(`${i}-0${j}`) : monthLabels.add(`${i}-${j}`)
				}
			}
		}
	}

	if (oldestYear) {
		const today = new Date()
		const currentYear = today.getFullYear()
		for (let i = oldestYear; i <= currentYear; i++) {
			yearLabels.add(i)
		}
	}

	const monthSourceData = state.sessionList.reduce((acc, entry) => {
		var date = new Date(entry.date)
		var month = date.getMonth() + 1
		var key =
			month < 10
				? `${date.getFullYear()}-0${month}`
				: `${date.getFullYear()}-${month}`
		if (!acc[key]) {
			acc[key] = 0
		}
		acc[key] += parseInt(entry.plays)
		return acc
	}, {})

	const yearSourceData = state.sessionList.reduce((acc, entry) => {
		var date = new Date(entry.date)
		var year = date.getFullYear()
		if (!acc[year]) {
			acc[year] = 0
		}
		acc[year] += parseInt(entry.plays)
		return acc
	}, {})

	const labelsMonth = Array.from(monthLabels).sort()

	let dataForMonths = {}
	labelsMonth.forEach((label) => {
		dataForMonths[label] = monthSourceData[label] ? monthSourceData[label] : 0
	})

	const chartDataMonths = {
		labelsMonth,
		datasets: [
			{
				data: dataForMonths,
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	}

	const labelsYear = Array.from(yearLabels).sort().reverse()

	let dataForYears = {}
	labelsYear.forEach((label) => {
		dataForYears[label] = yearSourceData[label] ? yearSourceData[label] : 0
	})

	const chartDataYears = {
		labelsYear,
		datasets: [
			{
				data: dataForYears,
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	}

	return (
		<>
			<Line data={chartDataMonths} options={options} />
			<Line data={chartDataYears} options={options} />
		</>
	)
}

export default SessionChart

import React from "react"
import Autosuggest from "react-autosuggest"

const games = ["Altiplano", "Dawn of Peacemakers", "Magic: the Gathering"]

const getSuggestions = value => {
	const inputValue = value.trim().toLowerCase()
	const inputLength = inputValue.length
	return inputLength === 0
		? []
		: games.filter(
				game => game.toLowerCase().slice(0, inputLength) === inputValue
		  )
}

const getSuggestionValue = suggestion => suggestion

const renderSuggestion = suggestion => <div>{suggestion}</div>

class GameSelector extends React.Component {
	constructor() {
		super()

		this.state = {
			value: "",
			suggestions: []
		}
	}

	onChange = (event, { newValue }) => {
		this.setState({
			value: newValue
		})
	}

	// Autosuggest will call this function every time you need to update suggestions.
	// You already implemented this logic above, so just use it.
	onSuggestionsFetchRequested = ({ value }) => {
		this.setState({
			suggestions: getSuggestions(value)
		})
	}

	// Autosuggest will call this function every time you need to clear suggestions.
	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: []
		})
	}

	render() {
		const { value, suggestions } = this.state

		// Autosuggest will pass through all these props to the input.
		const inputProps = {
			placeholder: "Choose a game",
			value,
			onChange: this.onChange
		}

		// Finally, render it!
		return (
			<Autosuggest
				suggestions={suggestions}
				onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
				onSuggestionsClearRequested={this.onSuggestionsClearRequested}
				getSuggestionValue={getSuggestionValue}
				renderSuggestion={renderSuggestion}
				inputProps={inputProps}
			/>
		)
	}
}

export default GameSelector

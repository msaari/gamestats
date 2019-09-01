module.exports = games => {
	const output = games.reduce((result, game) => {
		let text = ""
		switch (game.rating) {
			case 10:
				text =
					"[b][bgcolor=#00cc00][color=#00cc00].[/color][color=#000000]10[/color][color=#00cc00]![/color][/bgcolor][/b]"
				break
			case 9:
				text =
					"[b][bgcolor=#33cc99][color=#33cc99]_[/color][color=#000000]9[/color][color=#33cc99]_[/color][/bgcolor][/b]"
				break
			case 8:
				text =
					"[b][bgcolor=#66ff99][color=#66ff99]_[/color][color=#000000]8[/color][color=#66ff99]_[/color][/bgcolor][/b]"
				break
			case 7:
				text =
					"[b][bgcolor=#99ffff][color=#99ffff]_[/color][color=#000000]7[/color][color=#99ffff]_[/color][/bgcolor][/b]"
				break
			case 6:
				text =
					"[b][bgcolor=#9999ff][color=#9999ff]_[/color][color=#000000]6[/color][color=#9999ff]_[/color][/bgcolor][/b]"
				break
			case 5:
				text =
					"[b][bgcolor=#cc99ff][color=#cc99ff]_[/color][color=#000000]5[/color][color=#cc99ff]_[/color][/bgcolor][/b]"
				break
			case 4:
				text =
					"[b][bgcolor=#ff66cc][color=#ff66cc]_[/color][color=#000000]4[/color][color=#ff66cc]_[/color][/bgcolor][/b]"
				break
			case 3:
				text =
					"[b][bgcolor=#ff6699][color=#ff6699]_[/color][color=#000000]3[/color][color=#ff6699]_[/color][/bgcolor][/b]"
				break
			case 2:
				text =
					"[b][bgcolor=#ff3366][color=#ff3366]_[/color][color=#000000]2[/color][color=#ff3366]_[/color][/bgcolor][/b]"
				break
			default:
				text = ""
		}
		const totalPlays =
			game.plays === game.totalPlays
				? "[size=85][color=#ff0000]UUSI![/color][/size]"
				: `[size=85](${game.totalPlays} yhteensä)[/size]`
		result += `${text} ${game.name} × ${game.plays} ${totalPlays}\n`
		return result
	}, "")
	if (!output) return "No result"
	return output
}

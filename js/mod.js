let modInfo = {
	name: "Constellation Incremental",
	author: "GalacticalTraveller",
	pointsName: "Stardust",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(0),
	offlineLimit: 1,
}

let VERSION = {
	num: "0.2",
	name: "Cosmic Expansion",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.2</h3><br>
		- Added new Star upgrades (Binary Star, Dying Star).<br>
		- Added new Constellation upgrades (Cosmic Chain, Void Pulse).<br>
		- Added Star Milestones (unlocked via Constellations).<br>
		- Added Achievements.<br>
		- Added music toggle.<br>
		- Added timer to next reset.<br>
		- Various bug fixes and balancing.<br>
	<h3>v0.1</h3><br>
		- Added Constellations layer.<br>
		- Added Constellation upgrades.<br>
		- Added music (The Heaven-Sent Abomination by DM DOKURO).<br>
	<h3>v0.0</h3><br>
		- Game released.<br>
		- Added Stars layer with upgrades.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints(){
	return true
}

function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)

	// === STARS - FILEIRA 1 ===

	// supg11 — Star Boost: 1.75x
	// cupg14: 1.2x melhor | supg32 Binary Star: dobra | milestone0: já incluso no cupg14
	if (hasUpgrade("p", 11)) {
		let boost = new Decimal(1.75)
		if (hasUpgrade("c", 14)) boost = boost.mul(1.2)
		if (hasUpgrade("p", 32)) boost = boost.mul(2)
		// milestone 1 — 75c: upg1 0.25x melhor
		if (player["c"].best.gte(75) && hasUpgrade("c", 17)) boost = boost.mul(1.25)
		gain = gain.mul(boost)
	}

	// supg12 — Faster Collection: +1/sec (cupg16: +2/sec)
	// milestone 1 — 75c: 0.25x melhor → +1.25 ou +2.5
	if (hasUpgrade("p", 12)) {
		let base = hasUpgrade("c", 16) ? 2 : 1
		if (player["c"].best.gte(75) && hasUpgrade("c", 17)) base = base * 1.25
		gain = gain.add(base)
	}

	// supg13 — Squared Star: 2x
	// cupg14: 1.2x melhor | supg32 Binary Star: dobra
	// milestone 1 — 75c: 0.25x melhor
	if (hasUpgrade("p", 13)) {
		let boost = new Decimal(2)
		if (hasUpgrade("c", 14)) boost = boost.mul(1.2)
		if (hasUpgrade("p", 32)) boost = boost.mul(2)
		if (player["c"].best.gte(75) && hasUpgrade("c", 17)) boost = boost.mul(1.25)
		gain = gain.mul(boost)
	}

	// supg14 — You Help Me: Stardust boosts itself
	// cupg13: expoente 1.3 | milestone 1 — 75c: 0.25x melhor (expoente extra)
	if (hasUpgrade("p", 14)) {
		let base = player.points.add(1).log10().add(1)
		let exp = hasUpgrade("c", 13) ? upgradeEffect("c", 13) : new Decimal(1)
		if (player["c"].best.gte(75) && hasUpgrade("c", 17)) exp = exp.add(0.25)
		gain = gain.mul(base.pow(exp))
	}

	// === STARS - FILEIRA 2 ===

	// supg22 — Rocket Boost: 3.5x
	if (hasUpgrade("p", 22))
		gain = gain.mul(3.5)

	// supg23 — Orbital Momentum: Stars boostam SD (log)
	if (hasUpgrade("p", 23))
		gain = gain.mul(upgradeEffect("p", 23))

	// supg24 — Galactic Drift: Stardust boosta mais
	if (hasUpgrade("p", 24))
		gain = gain.mul(upgradeEffect("p", 24))

	// === STARS - FILEIRA 3 ===

	// supg31 — Star Aligned: 2x SD
	if (hasUpgrade("p", 31))
		gain = gain.mul(2)

	// supg33 — Dying Star: cada reset +5% permanente
	if (hasUpgrade("p", 33))
		gain = gain.mul(upgradeEffect("p", 33))

	// === CONSTELLATIONS ===

	// cupg11 — Merged Stars: 2.5x
	if (hasUpgrade("c", 11))
		gain = gain.mul(2.5)

	// cupg12 — Shiny Line: Constellations boostam SD (log)
	if (hasUpgrade("c", 12))
		gain = gain.mul(upgradeEffect("c", 12))

	// cupg15 — Stellar Boost: 4x
	if (hasUpgrade("c", 15))
		gain = gain.mul(4)

	// cupg19 — Void Pulse: 3x
	if (hasUpgrade("c", 19))
		gain = gain.mul(3)

	// === MILESTONES DE CONSTELLATIONS ===

	// milestone 0 — 50c: 2.5x SD
	if (player["c"].total.gte(50) && hasUpgrade("c", 17))
		gain = gain.mul(2.5)

	// milestone 2 — 125c: 3x SD
	if (player["c"].best.gte(125) && hasUpgrade("c", 17))
		gain = gain.mul(3)

	return gain
}

function addedPlayerData() { return {
    musicEnabled: true,
    showMilestonePopups: false,
}}

var displayThings = [
    function() { return "Gather Stardust. Go far beyond what they call endless." },
    function() { return "Music: 'The Heaven-Sent Abomination (Theme of the Astral Infection)' by DM DOKURO" },
    function() { 
        let status = player.musicEnabled !== false ? "ON" : "OFF"
        return "<button onclick='toggleMusic()' style='background:#333; color:white; border:1px solid #888; padding:3px 10px; cursor:pointer; font-family:Inconsolata'>🎵 Music: " + status + "</button>"
    }
]

function isEndgame() {
	return player.points.gte(new Decimal("1.8e308"))
}

var backgroundStyle = {
    "background-image": "url('images/Constellation.png')",
    "background-size": "1000px",
    "background-position": "center",
    "background-repeat": "no-repeat",
    "background-attachment": "fixed",
}

function maxTickLength() {
	return(3600)
}

function fixOldSave(oldVersion){
}

// ============================================================
//  Música — The Heaven-Sent Abomination (Astral Infection)
//  by DM DOKURO — usado com permissão, créditos ao autor
// ============================================================
var music = new Audio("audio/the-heaven-sent-abomination---theme-of-the-astral-infection.mp3")
music.loop = true
music.volume = 0.5

document.addEventListener("click", function startMusic() {
    if (player.musicEnabled !== false) music.play()
    document.removeEventListener("click", startMusic)
}, { once: true })

function toggleMusic() {
    player.musicEnabled = !player.musicEnabled
    if (player.musicEnabled) {
        music.play()
    } else {
        music.pause()
    }
}
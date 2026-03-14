// ============================================================
//  LAYER: Stars (p)
// ============================================================
addLayer("p", {
    name: "Stars",
    symbol: "★",
    position: 0,

    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},

    color: "#FFFF55",
    requires: new Decimal(15),
    resource: "Stars",
    baseResource: "Stardust",
    baseAmount() { return player.points },

    type: "normal",
    exponent: 0.5,

    gainMult() {
        let mult = new Decimal(1)
        if (hasUpgrade("p", 21)) mult = mult.mul(2)
        if (hasUpgrade("c", 18)) mult = mult.mul(upgradeEffect("c", 18))
        return mult
    },

    gainExp() {
        return new Decimal(1)
    },

    row: 0,

    upgrades: {
        // === FILEIRA 1 ===
        11: {
            title: "Star Boost",
            description: "Multiply Stardust gain by 1.75x.",
            cost: new Decimal(1),
        },
        12: {
            title: "Faster Collection",
            description: "+1 Stardust per second.",
            cost: new Decimal(3),
        },
        13: {
            title: "Squared Star",
            description: "2x Stardust gain.",
            cost: new Decimal(7),
        },
        14: {
            title: "You Help Me",
            description: "Stardust boosts itself.",
            cost: new Decimal(25),

            effect() {
                return player.points.add(1).log10().add(1).min(5)
            },
            effectDisplay() {
                return format(this.effect()) + "x"
            },
        },

        // === FILEIRA 2 ===
        21: {
            title: "Stardust Powah",
            description: "2x Star gain.",
            cost: new Decimal(40),
        },
        22: {
            title: "Rocket Boost",
            description: "3.5x Stardust gain.",
            cost: new Decimal(85),
        },
        23: {
            title: "Orbital Momentum",
            description: "Stars boost Stardust gain.",
            cost: new Decimal(120),

            effect() {
                return player["p"].points.add(1).log10().add(1).pow(1.2).min(5)
            },
            effectDisplay() {
                return format(this.effect()) + "x"
            },
        },
        24: {
            title: "Galactic Drift",
            description: "Stardust boosts itself even harder.",
            cost: new Decimal(175),

            effect() {
                return player.points.add(1).log10().add(1).pow(1.2).min(6)
            },
            effectDisplay() {
                return format(this.effect()) + "x"
            },
        },

        // === FILEIRA 3 ===
        31: {
            title: "Star Aligned",
            description: "Unlock Constellations. 2x Stardust gain.",
            cost: new Decimal(250),
        },
        32: {
            title: "Binary Star",
            description: "Double the effect of Star Boost and Squared Star.",
            cost: new Decimal(400),
            unlocked() { return player["c"].best.gte(125) || hasUpgrade("p", 32) },
        },
        33: {
            title: "Dying Star",
            description: "Each Star reset permanently boosts Stardust by +2%.",
            cost: new Decimal(600),
            unlocked() { return player["c"].best.gte(125) || hasUpgrade("p", 33) },

            effect() {
                return new Decimal(1).add(new Decimal(0.02).mul(player["p"].resetTime || 0))
            },
            effectDisplay() {
                return format(this.effect()) + "x"
            },
        },
    },

    // Milestones — desbloqueados pelo upgrade "Its Marked on Stars" (cupg17)
    milestones: {
        0: {
            requirementDescription: "50 Constellations at once — Keep Row 1 upgrades & 2.5x Stardust",
            effectDescription: "Keep Row 1 Star upgrades on Constellation reset. 2.5x Stardust gain.",
            done() { return player["c"].best.gte(50) && hasUpgrade("c", 17) },
            unlocked() { return hasUpgrade("c", 17) },
        },
        1: {
            requirementDescription: "75 Constellations at once — upg1-4 are 0.25x better & 2x Constellation gain",
            effectDescription: "Star upgrades 1, 2, 3, 4 are 0.25x stronger. 2x Constellation gain.",
            done() { return player["c"].best.gte(75) && hasUpgrade("c", 17) },
            unlocked() { return hasUpgrade("c", 17) },
        },
        2: {
            requirementDescription: "125 Constellations at once — 3x Stardust & unlocks more upgrades",
            effectDescription: "3x Stardust gain. Unlocks new Star and Constellation upgrades.",
            done() { return player["c"].best.gte(125) && hasUpgrade("c", 17) },
            unlocked() { return hasUpgrade("c", 17) },
        },
    },

    tabFormat: {
        "Upgrades": {
            content: [
                "main-display",
                ["prestige-button", function() {
                    return "Reset for " + format(getResetGain("p", true)) + " Stars"
                }],
                "resource-display",
                ["display-text", function() {
                    let gain = getPointGen()
                    if (gain.lte(0)) return ""
                    let required = getNextAt("p")
                    let current = player.points
                    if (current.gte(required)) return "⏱ Ready to reset!"
                    let timeLeft = required.sub(current).div(gain)
                    let secs = Math.ceil(timeLeft.toNumber())
                    if (secs < 60) return "⏱ Next reset in: " + secs + "s"
                    let mins = Math.floor(secs / 60)
                    let remSecs = secs % 60
                    return "⏱ Next reset in: " + mins + "m " + remSecs + "s"
                }],
                "upgrades",
            ],
        },
        "Milestones": {
            content: [
                "main-display",
                ["prestige-button", function() {
                    return "Reset for " + format(getResetGain("p", true)) + " Stars"
                }],
                "resource-display",
                ["display-text", function() {
                    let gain = getPointGen()
                    if (gain.lte(0)) return ""
                    let required = getNextAt("p")
                    let current = player.points
                    if (current.gte(required)) return "⏱ Ready to reset!"
                    let timeLeft = required.sub(current).div(gain)
                    let secs = Math.ceil(timeLeft.toNumber())
                    if (secs < 60) return "⏱ Next reset in: " + secs + "s"
                    let mins = Math.floor(secs / 60)
                    let remSecs = secs % 60
                    return "⏱ Next reset in: " + mins + "m " + remSecs + "s"
                }],
                "milestones",
            ],
            unlocked() { return hasUpgrade("c", 17) },
            buttonStyle() {
                return hasUpgrade("c", 17) ? {} : {"display": "none"}
            },
        },
    },

    hotkeys: [
        {key: "p", description: "P: Reset for Stars", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown(){return true}
})

// ============================================================
//  LAYER: Constellations (c)
// ============================================================
addLayer("c", {
    name: "Constellations",
    symbol: "✦",
    position: 0,

    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},

    color: "#88AAFF",
    requires: new Decimal(300),
    resource: "Constellations",
    baseResource: "Stars",
    baseAmount() { return player["p"].points },

    type: "normal",
    exponent: 0.5,

    gainMult() {
        let mult = new Decimal(1)
        return mult
    },

    gainExp() {
        return new Decimal(1)
    },

    row: 1,

    resetsNothing: false,

    branches: ["p"],

    onReset() {
        // Salva upgrades da fileira 1 antes do reset
        if (player["c"].best.gte(50) && hasUpgrade("c", 17)) {
            let keepIds = [11, 12, 13, 14]
            let kept = keepIds.filter(id => player["p"].upgrades && player["p"].upgrades.includes(id))
            // Após o reset do TMT, restaura os upgrades
            setTimeout(() => {
                if (!player["p"].upgrades) player["p"].upgrades = []
                for (let id of kept) {
                    if (!player["p"].upgrades.includes(id)) {
                        player["p"].upgrades.push(id)
                    }
                }
            }, 50)
        }
    },

    upgrades: {
        11: {
            title: "Merged Stars",
            description: "2.5x Stardust gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "Shiny Line",
            description: "Constellations boost Stardust gain.",
            cost: new Decimal(1),

            effect() {
                return player["c"].points.add(1).log10().mul(2).add(1)
            },
            effectDisplay() {
                return format(this.effect()) + "x"
            },
        },
        13: {
            title: "Lines of Stars",
            description: "supg4 (You Help Me) is a bit better.",
            cost: new Decimal(3),

            effect() {
                return new Decimal(1.3)
            },
        },
        14: {
            title: "Polished Stars",
            description: "supg1, supg3 are 1.2x stronger.",
            cost: new Decimal(5),
        },
        15: {
            title: "Stellar Boost",
            description: "4x Stardust gain.",
            cost: new Decimal(8),
        },
        16: {
            title: "Many Stars",
            description: "supg2 (Faster Collection) now gives +2/sec instead of +1/sec.",
            cost: new Decimal(15),
        },
        17: {
            title: "It's Marked on Stars",
            description: "Unlock Milestones for Stars.",
            cost: new Decimal(25),
        },
        18: {
            title: "Cosmic Chain",
            description: "Constellations boost Star gain.",
            cost: new Decimal(175),
            unlocked() { return player["c"].best.gte(125) || hasUpgrade("c", 18) },

            effect() {
                return player["c"].points.add(1).log10().add(1).pow(1.1)
            },
            effectDisplay() {
                return format(this.effect()) + "x"
            },
        },
        19: {
            title: "Void Pulse",
            description: "3x Stardust gain.",
            cost: new Decimal(250),
            unlocked() { return player["c"].best.gte(125) || hasUpgrade("c", 19) },
        },
    },

    gainMult() {
        let mult = new Decimal(1)
        // Milestone 1 — 75 Constellations: 2x Constellation gain
        if (player["c"].best.gte(75) && hasUpgrade("c", 17)) mult = mult.mul(2)
        return mult
    },

    hotkeys: [
        {key: "c", description: "C: Reset for Constellations", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    tabFormat: ["main-display",
        ["prestige-button", function() {
            return "Reset for " + format(getResetGain("c", true)) + " Constellations"
        }],
        "resource-display",
        ["display-text", function() {
            let required = getNextAt("c")
            let current = player["p"].points
            if (current.gte(required)) return "⏱ Ready to reset!"
            return "⏱ You need " + format(required.sub(current)) + " more Stars"
        }],
        "upgrades",
    ],

    layerShown() { return hasUpgrade("p", 31) || player["c"].total.gt(0) }
})

// ============================================================
//  LAYER: Achievements (a)
// ============================================================
addLayer("a", {
    name: "Achievements",
    symbol: "🏆",
    position: 0,
    startData() { return { unlocked: true } },
    color: "#FFD700",
    row: "side",

    achievements: {
        // === STARDUST ===
        11: {
            name: "First Discovery",
            done() { return player.points.gte(1) },
            tooltip: "Reach 1 Stardust.",
        },
        12: {
            name: "Gathering them all",
            done() { return player.points.gte(1000) },
            tooltip: "Reach 1,000 Stardust.",
        },
        13: {
            name: "Not even enough.",
            done() { return player.points.gte(1e6) },
            tooltip: "Reach 1,000,000 Stardust.",
        },

        // === STARS ===
        21: {
            name: "Born of a star",
            done() { return player["p"].total.gte(1) },
            tooltip: "Get your first Star.",
        },
        22: {
            name: "Lots o stars",
            done() { return player["p"].best.gte(100) },
            tooltip: "Reach 100 Stars.",
        },
        23: {
            name: "Sky of many stars",
            done() { return player["p"].best.gte(1000) },
            tooltip: "Reach 1,000 Stars.",
        },

        // === UPGRADES ===
        31: {
            name: "Big boost!",
            done() { return hasUpgrade("p", 22) },
            tooltip: "Buy Rocket Boost.",
        },
        32: {
            name: "Rocket for discoveries",
            done() { return hasUpgrade("p", 31) },
            tooltip: "Buy Star Aligned.",
        },
        33: {
            name: "Duping Stardust",
            done() { return hasUpgrade("p", 14) },
            tooltip: "Buy You Help Me.",
        },

        // === CONSTELLATIONS ===
        41: {
            name: "First Constellation",
            done() { return player["c"].total.gte(1) },
            tooltip: "Get your first Constellation.",
        },
        42: {
            name: "Constellations of the space.",
            done() { return player["c"].best.gte(10) },
            tooltip: "Reach 10 Constellations.",
        },
        43: {
            name: "Marked",
            done() { return hasUpgrade("c", 17) },
            tooltip: "Buy It's Marked on Stars.",
        },
        44: {
            name: "Star Enthusiast",
            done() { return player["c"].best.gte(50) },
            tooltip: "Reach 50 Constellations at once.",
        },
        45: {
            name: "Master Of Stars",
            done() { return player["c"].best.gte(125) },
            tooltip: "Reach 125 Constellations at once.",
        },
        46: {
            name: "Many Lined Stars",
            done() { return player["c"].best.gte(250) },
            tooltip: "Reach 250 Constellations at once.",
        },
        47: {
            name: "Unlocked Potential",
            done() { return player["p"].milestones.includes(2) },
            tooltip: "Activate the 125 Constellations milestone.",
        },
    },

    layerShown() { return true },
})
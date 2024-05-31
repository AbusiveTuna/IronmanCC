import requests
import urllib.parse

HIGHSCORE_PLAYER_URL = "https://secure.runescape.com/m=hiscore_oldschool_ironman/index_lite.ws?player="
IRONMAN_CC_TEMPLE_URL = "https://templeosrs.com/api/groupmembers.php?id=2176"

# The following is taken from https://runescape.wiki/w/Application_programming_interface#Old_School_Hiscores
# For the index_lite endpoint
# It will need to be updated if a new boss or skill is added.
OSRS_INDEX_LITE_CATEGORY_ORDER = [
    "Overall",
    "Attack",
    "Defence",
    "Strength",
    "Hitpoints",
    "Ranged",
    "Prayer",
    "Magic",
    "Cooking",
    "Woodcutting",
    "Fletching",
    "Fishing",
    "Firemaking",
    "Crafting",
    "Smithing",
    "Mining",
    "Herblore",
    "Agility",
    "Thieving",
    "Slayer",
    "Farming",
    "Runecrafting",
    "Hunter",
    "Construction",
    "League Points",
    "Deadman Points",
    "Bounty Hunter - Hunter",
    "Bounty Hunter - Rogue",
    "Bounty Hunter (Legacy) - Hunter",
    "Bounty Hunter (Legacy) - Rogue",
    "Clue Scrolls (all)",
    "Clue Scrolls (beginner)",
    "Clue Scrolls (easy)",
    "Clue Scrolls (medium)",
    "Clue Scrolls (hard)",
    "Clue Scrolls (elite)",
    "Clue Scrolls (master)",
    "LMS - Rank",
    "PvP Arena - Rank",
    "Soul Wars Zeal",
    "Rifts closed",
    "Colosseum Glory",
    "Abyssal Sire",
    "Alchemical Hydra",
    "Artio",
    "Barrows Chests",
    "Bryophyta",
    "Callisto",
    "Cal'varion",
    "Cerberus",
    "Chambers of Xeric",
    "Chambers of Xeric: Challenge Mode",
    "Chaos Elemental",
    "Chaos Fanatic",
    "Commander Zilyana",
    "Corporeal Beast",
    "Crazy Archaeologist",
    "Dagannoth Prime",
    "Dagannoth Rex",
    "Dagannoth Supreme",
    "Deranged Archaeologist",
    "Duke Sucellus",
    "General Graardor",
    "Giant Mole",
    "Grotesque Guardians",
    "Hespori",
    "Kalphite Queen",
    "King Black Dragon",
    "Kraken",
    "Kree'Arra",
    "K'ril Tsutsaroth",
    "Lunar Chests",
    "Mimic",
    "Nex",
    "Nightmare",
    "Phosani's Nightmare",
    "Obor",
    "Phantom Muspah",
    "Sarachnis",
    "Scorpia",
    "Scurrius",
    "Skotizo",
    "Sol Heredit",
    "Spindel",
    "Tempoross",
    "The Gauntlet",
    "The Corrupted Gauntlet",
    "The Leviathan",
    "The Whisperer",
    "Theatre of Blood",
    "Theatre of Blood: Hard Mode",
    "Thermonuclear Smoke Devil",
    "Tombs of Amascut",
    "Tombs of Amascut: Expert Mode",
    "TzKal-Zuk",
    "TzTok-Jad",
    "Vardorvis",
    "Venenatis",
    "Vet'ion",
    "Vorkath",
    "Wintertodt",
    "Zalcano",
    "Zulrah",
]


def get_players_highscores(player):
    urlsafe_username = urllib.parse.quote_plus(player)
    osrs_highscores_player_url = HIGHSCORE_PLAYER_URL + urlsafe_username
    response = requests.get(osrs_highscores_player_url)
    results = response.text.split('\n')[:-1] #last line is empty
    player_current_values = {}

    if len(OSRS_INDEX_LITE_CATEGORY_ORDER) != len(results):
        raise Exception("wtf the response length didn't match the expected amount of skills and bosses")

    for name, value in zip(OSRS_INDEX_LITE_CATEGORY_ORDER, results):
        player_current_values[name] = value

    return player_current_values

def main():
    r = requests.get(IRONMAN_CC_TEMPLE_URL)
    members = r.json()
    results = {}
    for member in members[:5]: #first 5 members in the member list just to test
        results[member] = get_players_highscores(member)

    print(results)



if __name__ == "__main__":
    main()


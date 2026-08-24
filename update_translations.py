import json

with open('translation.json', 'r') as f:
    t = json.load(f)

new_skills = [
    "zoology", "botany", "geology", "industrial equipment", "jury-rigging", "chemistry",
    "zero-g", "mathematics", "art", "archaeology", "theology", "military training",
    "rimwise", "athletics", "psychology", "pathology", "field medicine", "ecology",
    "wilderness survival", "asteroid mining", "mechanical repair", "explosives",
    "pharmacology", "hacking", "piloting", "physics", "mysticism", "firearms",
    "hand-to-hand combat", "sophontology", "exobiology", "surgery", "planetology",
    "robotics", "engineering", "cybernetics", "artificial intelligence", "hyperspace",
    "xenoesotericism", "command", "linguistics", "computers"
]

for skill in new_skills:
    t[skill] = skill

with open('translation.json', 'w') as f:
    json.dump(t, f, indent=4)


import re

with open('src/pug/sheetdata.pug', 'r') as f:
    text = f.read()

new_skills = """    const skills = {
        trained: [
            { name: "linguistics", desc: "Study of language" },
            { name: "zoology", desc: "Study of animal life" },
            { name: "botany", desc: "Study of plant life" },
            { name: "geology", desc: "Solid features of any terrestrial planet" },
            { name: "industrial equipment", desc: "Safe operation of heavy machinery" },
            { name: "jury-rigging", desc: "Makeshift repairs" },
            { name: "chemistry", desc: "Identification of substances" },
            { name: "computers", desc: "Fluent use of computers and networks" },
            { name: "zero-g", desc: "Working in a vacuum, vaccsuits, etc." },
            { name: "mathematics", desc: "Science of numbers, quantity, and space" },
            { name: "art", desc: "Expression or application of creative ability" },
            { name: "archaeology", desc: "Ancient cultures and their artifacts" },
            { name: "theology", desc: "Study of religion" },
            { name: "military training", desc: "Standard basic training" },
            { name: "rimwise", desc: "Outer rim colonies and seedy parts" },
            { name: "athletics", desc: "Physical sports and games" }
        ],
        expert: [
            { name: "psychology", prereq: ["linguistics", "zoology", "botany"], desc: "Study of behavior and mind" },
            { name: "pathology", prereq: ["zoology", "botany"], desc: "Study of the cause and effect of disease" },
            { name: "field medicine", prereq: ["zoology", "botany"], desc: "Emergency medical care" },
            { name: "ecology", prereq: ["botany", "geology"], desc: "Organisms and their physical surroundings" },
            { name: "wilderness survival", prereq: ["botany"], desc: "Surviving in harsh environments" },
            { name: "asteroid mining", prereq: ["geology", "industrial equipment"], desc: "Tools and procedures used in mining asteroids" },
            { name: "mechanical repair", prereq: ["industrial equipment", "jury-rigging"], desc: "Fixing broken machines" },
            { name: "explosives", prereq: ["jury-rigging", "chemistry", "military training"], desc: "Bombs and incendiary devices" },
            { name: "pharmacology", prereq: ["chemistry"], desc: "Uses, effects, and modes of action of drugs" },
            { name: "hacking", prereq: ["computers"], desc: "Unauthorized access to computer systems" },
            { name: "piloting", prereq: ["zero-g"], desc: "Operation and control of air and spacecraft" },
            { name: "physics", prereq: ["mathematics"], desc: "Study of nature and properties of matter and energy" },
            { name: "mysticism", prereq: ["art", "archaeology", "theology"], desc: "Spiritual apprehension of hidden knowledge" },
            { name: "firearms", prereq: ["military training", "rimwise"], desc: "Guns and their use" },
            { name: "hand-to-hand combat", prereq: ["military training", "rimwise", "athletics"], desc: "Melee fighting" }
        ],
        master: [
            { name: "sophontology", prereq: ["psychology"], desc: "Alien psychology" },
            { name: "exobiology", prereq: ["pathology"], desc: "Alien biology" },
            { name: "surgery", prereq: ["pathology", "field medicine"], desc: "Medical specialty involving manual operation" },
            { name: "planetology", prereq: ["ecology", "asteroid mining"], desc: "Study of planets and celestial bodies" },
            { name: "robotics", prereq: ["mechanical repair"], desc: "Design and operation of robots and androids" },
            { name: "engineering", prereq: ["mechanical repair"], desc: "Design, building, and use of engines" },
            { name: "cybernetics", prereq: ["mechanical repair"], desc: "Interface between man and machine" },
            { name: "artificial intelligence", prereq: ["hacking"], desc: "Simulacrum of human consciousness" },
            { name: "hyperspace", prereq: ["piloting", "physics", "mysticism"], desc: "FTL travel" },
            { name: "xenoesotericism", prereq: ["mysticism"], desc: "Obscure alien mysticism and belief" },
            { name: "command", prereq: ["piloting", "firearms"], desc: "Leadership and authority" }
        ]
    };"""

text = re.sub(r'const skills = \{.*?\]\n    \};', new_skills, text, flags=re.DOTALL)

with open('src/pug/sheetdata.pug', 'w') as f:
    f.write(text)


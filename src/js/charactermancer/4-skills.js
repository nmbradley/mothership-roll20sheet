{

    const trained_skills = [
        "linguistics",
        "biology",
        "first_aid",
        "hydroponics",
        "geology",
        "zero-g",
        "scavenging",
        "heavy_machinery",
        "computers",
        "mechanical_repair",
        "driving",
        "piloting",
        "mathematics",
        "art",
        "archaeology",
        "theology",
        "military_training",
        "rimwise",
        "athletics",
        "chemistry"
    ];

    const expert_skills = [
        "psychology",
        "genetics",
        "pathology",
        "botany",
        "planetology",
        "asteroid_mining",
        "jury_rigging",
        "engineering",
        "hacking",
        "vehicle_specialization",
        "astrogation",
        "physics",
        "mysticism",
        "tactics",
        "gunnery",
        "firearms",
        "close-quarters_combat",
        "explosives"
    ];

    const master_skills = [
        "sophontology",
        "xenobiology",
        "surgery",
        "cybernetics",
        "robotics",
        "artificial_intelligence",
        "command",
        "hyperspace",
        "xenoesotericism",
        "weapon_specialization"
    ];

    const onLoadSkills = () => {
        const data = getCharmancerData();

        resetClassSkills();

        if (data?.skills?.values?.skillpoints_max) calcAllSkills();
        else if (data?.class?.values?.skill_points) setAttrs({skillpoints_max:data.class.values.skill_points}, callback => calcAllSkills());
        else setCharmancerText({[`t__skillpointserror`]:getTranslationByKey("Ensure you have selected a class")});
    };

    const resetClassSkills = () => {
        const data = getCharmancerData();
        const all_skills = [...trained_skills, ...expert_skills, ...master_skills];

        all_skills.forEach(skill => (data?.skills?.values[`${skill}_type`] === "class") ? setAttrs({[skill]:0},{silent:true}) : false);

        const class_skills = (data?.class?.values?.skills) ? JSON.parse(data.class.values.skills).map(skill => skill.replace(/ /g, "_")) : [];

        class_skills.forEach(skill => setAttrs({[skill]:"on", [`${skill}_type`]:"class"},{silent:true}));

        if (data?.class?.repeating?.length > 0) {
            const skill_choices = data.class.repeating.filter(repeating_id => repeating_id.indexOf("choicerow") > -1);

            skill_choices.forEach(repeating_id => {
                const skill_name = data.class.values[`${repeating_id}_skill`].toLowerCase().replace(/ /g, "_");

                if (skill_name !== "choose") setAttrs({[skill_name]:"on", [`${skill_name}_type`]:"class"},{silent:true});
            });
        }
    };

    const calcAllSkills = () => {
        const data = getCharmancerData();

        const sp_total = (data?.skills?.values?.skillpoints_max) ? parseInt(data.skills.values.skillpoints_max) : 0;
        let sp_spent = 0;
        
        trained_skills.forEach(skill => {
            const skill_toggle =  data.skills.values[skill];
            const skill_type = data.skills.values[`${skill}_type`];
            if (skill_toggle === "on" && skill_type !== "class") sp_spent += 1;
        }); 
        
        expert_skills.forEach(skill => { 
            const skill_toggle =  data.skills.values[skill];
            const skill_type = data.skills.values[`${skill}_type`];
            if (skill_toggle === "on" && skill_type !== "class") sp_spent += 2;
        });
        
        master_skills.forEach(skill => { 
            const skill_toggle =  data.skills.values[skill];
            const skill_type = data.skills.values[`${skill}_type`];
            if (skill_toggle === "on" && skill_type !== "class") sp_spent += 3;
        });

        const updateAttrs = {
            trained_lock: "0",
            expert_lock: "0",
            master_lock: "0"
        };

        const updateHTML = {};

        const sp_remaining = sp_total - sp_spent;

        if (sp_remaining <= 2) updateAttrs["master_lock"] = "on";
        if (sp_remaining <= 1) updateAttrs["expert_lock"] = "on";
        if (sp_remaining <= 0) updateAttrs["trained_lock"] = "on";

        updateAttrs["skill_points"] = sp_remaining;
        updateHTML["t__skillpoints"] = `${sp_remaining} / ${sp_total}`;

        setCharmancerText(updateHTML);
        setAttrs(updateAttrs);
    }

    const toggleSkill = (skill, new_value) => {
        const data = getCharmancerData();
        const existing_values = (data?.skills?.values?.unlocked) ? data.skills.values.unlocked.trim() : "";
        const value_list = existing_values.split(" ");
        const unlocks = skillList[skill].unlocks || [];
        
        const existing_skills = (data?.skills?.values?.owned) ? data.skills.values.owned.trim() : "";
        const skill_list = existing_skills.split(" ");

        let update_attr = "";
        let owned = "";

        if (new_value === "on" && skill_list.includes(skill)) return;
    
        if (typeof new_value === "undefined") {

            unlocks.forEach(item => value_list.splice(value_list.indexOf(item), 1));
            skill_list.filter(item => item !== skill)

        } else if (new_value === "on") {
            
            if (unlocks.length !== 0) unlocks.forEach(unlock => value_list.push(unlock));
            skill_list.push(skill);
        }

        update_attr = value_list.join(" ");
        owned = skill_list.join(" ");
            
        setAttrs({unlocked:update_attr, owned: owned}); 

    };

    on(`page:skills`, eventInfo => onLoadSkills());

    [...trained_skills, ...expert_skills, ...master_skills].forEach(skill => on(`mancerchange:${skill}`, eventInfo => {
        toggleSkill(skill, eventInfo.newValue);
        calcAllSkills();
    }));
}
const onLoadSkills = () => {
    const data = getCharmancerData();

    console.log(data.skills.repeating)

    if (data?.skills?.repeating.length > 1) reloadSkills();
    generateSkillList();
}

const reloadSkills = () => {
    const data = getCharmancerData();

    data.skills.repeating.forEach(section_id => {

        if (section_id.match(/skillpointrow/g)) {

            let choices = ["custom"];

            addRepeatingSection("sheet-t__skillpointchoice", "skillselection", "skillpointrow", section_id => {

                showChoices([`sheet-${section_id} .sheet-delete`])

                const type = data.skills.values[`${section_id}_skill_type`];

                console.log(type);
    
                choices = (type === "trained") ? [...choices, ...trained_skills] : 
                          (type === "expert") ? [...choices, ...expert_skills] : 
                          (type === "master_skills") ? [...choices, ...master_skills] : 
                          choices;
    
                let disable = [];
    
                if (data?.class?.values?.["skills"]) {
                    disable = JSON.parse(data.class.values.skills);
                }
    
                if (data?.skills?.repeating) {
                    data.skills.repeating.forEach(repeating_id => {
    
                        if (repeating_id.match(/choicerow/g)) {
    
                            disable.push(data.skills.values[`${repeating_id}_skill`]);
            
                        }
    
                    });
                }
    
                setCharmancerOptions(`${section_id}_skill`, choices, {disable:disable});        

            });

        }
    });
}

const generateSkillList = () => {
    const data = getCharmancerData();

    if (data?.class?.values?.["skills"]) {
        const skill_list = JSON.parse(data.class.values.skills);
        const skill_string = skill_list.join(", ");

        setCharmancerText({["t__baseskills"]:skill_string});
    }

    if (data?.class?.values?.["skill_choice"]) {
        const choice = JSON.parse(data.class.values.skill_choice);

        choice.forEach(choices => {

            addRepeatingSection("sheet-t__skillchoices", "skillselection", "choicerow", section_id => {

                let disable = [];

                if (data?.class?.values?.["skills"]) {
                    disable = JSON.parse(data.class.values.skills);
                }

                setCharmancerOptions(`${section_id}_skill`, choices, {disable: disable});

            }); 

        })
    }

    if (data?.class?.values?.["skill_points"]) {
        const skill_points = parseInt(data.class.values["skill_points"]);
        
        setCharmancerText({"t__skillpoints":skill_points});
    }

    if (!data?.class?.values?.["skills"] && data?.class?.values?.["skill_choices"] && data?.class?.values?.["skill_points"]) return setCharmancerText({["t__baseskills"]:getTranslationByID("Pleas ensure you have selected a class.")})
};

const addNewRepeatingSkill = (new_value) => {
    const data = getCharmancerData();

    if (new_value === "choose") return;

    let choices = ["custom"];

    addRepeatingSection("sheet-t__skillpointchoice", "skillselection", "skillpointrow", section_id => {

        showChoices([`sheet-${section_id} .sheet-delete`])

        choices = (new_value === "trained") ? [...choices, ...trained_skills] : 
                  (new_value === "expert") ? [...choices, ...expert_skills] : 
                  (new_value === "master_skills") ? [...choices, ...master_skills] : 
                  choices;

        let disable = [];

        if (data?.class?.values?.["skills"]) {
            disable = JSON.parse(data.class.values.skills);
        }

        if (data?.skills?.repeating) {
            data.skills.repeating.forEach(repeating_id => {

                if (repeating_id.match(/choicerow/g)) {

                    disable.push(data.skills.values[`${repeating_id}_skill`]);
    
                }

            });
        }

        setCharmancerOptions(`${section_id}_skill`, choices, {disable:disable});

        setAttrs({skill_type:new_value});

    });

    setAttrs({newskill:"choose"});

};
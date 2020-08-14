{

    const onLoadReview = () => {
        const data = getCharmancerData();

        const updateHTML = {};
        const updateAttrs = {};

        ["strength","speed","intellect","combat","health","stress","resolve","sanity","fear","body","armor"].forEach(item => {
            let value = (data?.equipment?.values?.[item]) ? data.equipment.values[item] :
                        (data?.skills?.values?.[item]) ? data.skills.values[item] :
                        (data?.class?.values?.[item]) ? data.class.values[item] :
                        (data?.stats?.values?.[item]) ? data.stats.values[item] :
                        false;

            value = parseInt(value);

            let mod = (data?.equipment?.values?.[`${item}_mod`]) ? data.equipment.values[`${item}_mod`] :
                      (data?.skills?.values?.[`${item}_mod`]) ? data.skills.values[`${item}_mod`] :
                      (data?.class?.values?.[`${item}_mod`]) ? data.class.values[`${item}_mod`] :
                      (data?.stats?.values?.[`${item}_mod`]) ? data.stats.values[`${item}_mod`] :
                      0;

            mod = parseInt(mod);

            const total = value + mod;
            
            updateHTML[`t__${item}`] = total;
            updateAttrs[item] = total;
        });

        const skills = [];
        
        const filter = ["owned", "skillpoints_max", "trained_lock", "expert_lock", "master_lock", "unlocked"];

        Object.entries(data.skills.values).forEach(([key, value]) => {
            if (!key.match(/type/) && !filter.includes(key) && value === "on") skills.push(capitalizeString(key));
        });

        updateHTML[`t__skilllist`] = skills.join(', ');
        updateAttrs[`skills`] = JSON.stringify(skills);

        const skillpoints = (data?.skills?.values?.skillpoints) ? data.equipment.values.skillpoints : "0";

        updateHTML[`t__skillpoints`] = skillpoints;
        updateAttrs[`skillpoints`] = skillpoints;

        const starting_credits = (data?.equipment?.values?.credits) ? data.equipment.values.credits : "Not Rolled";

        updateHTML[`t__credits`] = starting_credits;
        updateAttrs[`credits`] = starting_credits;

        const trinket = (data?.equipment?.values?.trinket) ? data.equipment.values.trinket : "Not Rolled";

        updateHTML[`t__trinket`] = trinket;
        updateAttrs[`trinket`] = trinket;

        const patch = (data?.equipment?.values?.patch) ? data.equipment.values.patch : "Not Rolled";

        updateHTML[`t__patch`] = patch;
        updateAttrs[`patch`] = patch;

        const package = (data?.equipment?.values?.equipment && parseJSON(data?.equipment?.values?.equipment)) ? parseJSON(data.equipment.values.equipment) : [];

        const items = package.map(item => (Array.isArray(item)) ? `${item[0]} (${item[1]})` : item).join(", ");

        updateHTML[`t__equipment`] = items;
        updateAttrs[`equipment`] = JSON.stringify(package);

        setCharmancerText(updateHTML)
        setAttrs(updateAttrs);
    }

    on(`page:review`, eventInfo => onLoadReview());

}
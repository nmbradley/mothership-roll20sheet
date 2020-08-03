{
    const addTopBar = (page) => {

        console.log(page);

        addRepeatingSection(`sheet-t__topbar`, `topbar`, section_id => {
            const data = getCharmancerData();
            const updateHTML = {};

            ["strength","speed","intellect","combat","health","stress","resolve","sanity","fear","body","armor"].forEach(item => {
                const value = (data?.equipment?.values?.[item]) ? data.equipment.values[item] :
                              (data?.skills?.values?.[item]) ?  data.skills.values[item] :
                              (data?.class?.values?.[item]) ?  data.class.values[item] :
                              (data?.stats?.values?.[item]) ?  data.stats.values[item] :
                              "-";
                              
                updateHTML[`${section_id} .sheet-t__${item}`] = value;
            });
            console.log(updateHTML)

            setCharmancerText(updateHTML);

        });

    };

    ["intro", "stats", "class", "skills", "equipment", "review"].forEach(page => on(`page:${page}`, eventInfo => addTopBar(page)));
}
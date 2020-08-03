{
    const onRollStats = (rolls) => {
        const updateHTML = {};
        const updateAttrs = {};    

        rolls.forEach((roll, index) => { 
            updateHTML[`cm-target-${attributes[index]}`] = roll.result;
            updateAttrs[`${attributes[index]}`] = roll.result;
        });
    
        setCharmancerText(updateHTML);
        setAttrs(updateAttrs);

    }

    on(`mancerroll:stats`, eventInfo => onRollStats(eventInfo.roll));
}
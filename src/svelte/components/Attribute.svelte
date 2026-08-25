<script>
    export let field; // The field object from our TS definitions
</script>

<div class="attribute">
    {#if field.uiType !== "hidden"}
        <label class="attribute__label" for="attr_{field.name}">{field.label}</label>
    {/if}

    {#if field.uiType === "textarea"}
        <textarea class="attribute__input attribute__input--textarea" name="attr_{field.name}"></textarea>
    {:else if field.uiType === "select"}
        <select class="attribute__input attribute__input--select" name="attr_{field.name}">
            {#each field.options as option}
                <option value={option}>{option}</option>
            {/each}
        </select>
    {:else if field.uiType === "checkbox"}
        <input class="attribute__input attribute__input--checkbox" type="checkbox" name="attr_{field.name}" value={field.seed} />
    {:else if field.uiType === "number-max"}
        <div class="attribute__minmax-wrapper">
            <input class="attribute__input attribute__input--number" type="number" name="attr_{field.name}" />
            <span class="attribute__separator">/</span>
            <input class="attribute__input attribute__input--number" type="number" name="attr_{field.name}_max" />
        </div>
    {:else if field.uiType === "hidden"}
        <input class="attribute__input attribute__input--hidden" type="hidden" name="attr_{field.name}" value={field.seed} />
    {:else}
        <input class="attribute__input attribute__input--{field.uiType === "number" ? "number" : "text"}" type={field.uiType === "number" ? "number" : "text"} name="attr_{field.name}" />
    {/if}
</div>

<style lang="scss">
    .attribute {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.5rem;
        align-items: center;

        &__label {
            color: var(--color-text, #000000);
            font-weight: bold;
        }

        &__input {
            background-color: var(--color-bg, #ffffff);
            color: var(--color-text, #000000);
            border: 1px solid var(--color-border, #000000);
            padding: 0.25rem 0.5rem;

            &--textarea {
                resize: vertical;
                min-height: 4rem;
            }

            &--select {
                background-color: var(--color-bg, #ffffff);
                color: var(--color-text, #000000);
            }

            &--checkbox {
                accent-color: var(--color-accent, #ff3366);
            }

            &--number {
                width: 100%;
            }
        }

        &__minmax-wrapper {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        &__separator {
            color: var(--color-text-muted, #666666);
            font-weight: bold;
        }
    }
</style>

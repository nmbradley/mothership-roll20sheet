<script>
    import Button from "./components/Button.svelte";
    import Frame from "./components/Frame.svelte";
    import Header from "./components/Header.svelte";
    import Attribute from "./components/Attribute.svelte";
    import {
        ship_name,
        ship_type,
        ship_class,
        systems,
        thrusters,
        battle,
        ship_armor,
        bankruptcy_save,
        ship_hull,
        ship_wounds,
        crew,
        fuel,
        loadout_max,
    } from "../game/fields/shipFields";

    const shipLogoUrl = "https://s3.amazonaws.com/files.d20.io/images/145353993/itv_F4exdWuwHavdksYfCQ/max.png?1592850121";
</script>

<div class="ship-sheet">
    <!-- Header Section -->
    <header class="ship-sheet__header">
        <Frame mode="dark" corner="large">
            <div class="ship-header">
                <div class="ship-header__logo">
                    <img src={shipLogoUrl} alt="Mothership Logo" class="ship-header__img" />
                </div>
                <div class="ship-header__fields">
                    <div class="ship-header__field ship-header__field--name">
                        <Attribute field={ship_name} />
                    </div>
                    <div class="ship-header__field ship-header__field--type">
                        <Attribute field={ship_type} />
                    </div>
                    <div class="ship-header__field ship-header__field--class">
                        <Attribute field={ship_class} />
                    </div>
                </div>
            </div>
        </Frame>
    </header>

    <!-- Main Grid Layout -->
    <div class="ship-sheet__grid">
        <!-- Core Stats & Saves Column -->
        <section class="ship-sheet__stats">
            <Frame mode="light" corner="medium">
                <Header title="Ship Stats (1e)" />
                <div class="ship-stats-list">
                    <div class="ship-stat-row">
                        <div class="ship-stat-row__btn">
                            <Button action="systems_check" label="Systems" />
                        </div>
                        <input class="ship-stat-row__input" type="number" name="attr_systems" placeholder="0" />
                    </div>
                    <div class="ship-stat-row">
                        <div class="ship-stat-row__btn">
                            <Button action="thrusters_check" label="Thrusters" />
                        </div>
                        <input class="ship-stat-row__input" type="number" name="attr_thrusters" placeholder="0" />
                    </div>
                    <div class="ship-stat-row">
                        <div class="ship-stat-row__btn">
                            <Button action="battle_check" label="Battle" />
                        </div>
                        <input class="ship-stat-row__input" type="number" name="attr_battle" placeholder="0" />
                    </div>
                </div>
            </Frame>

            <Frame mode="light" corner="medium">
                <Header title="Saves & Defenses" />
                <div class="ship-stats-list">
                    <div class="ship-stat-row">
                        <label class="ship-stat-row__label" for="attr_ship_armor">Armor</label>
                        <input class="ship-stat-row__input" type="number" name="attr_ship_armor" placeholder="0" />
                    </div>
                    <div class="ship-stat-row">
                        <div class="ship-stat-row__btn">
                            <Button action="bankruptcy_save" label="Bankruptcy Save" />
                        </div>
                        <input class="ship-stat-row__input" type="number" name="attr_bankruptcy_save" placeholder="21" value="21" />
                    </div>
                </div>
            </Frame>

            <Frame mode="light" corner="medium">
                <Header title="Hull & Wounds" />
                <div class="ship-hull-wounds">
                    <div class="ship-minmax-stat">
                        <span class="ship-minmax-stat__label">Wounds</span>
                        <div class="ship-minmax-stat__inputs">
                            <input class="ship-minmax-stat__input" type="number" name="attr_ship_wounds" placeholder="2" />
                            <span class="ship-minmax-stat__sep">/</span>
                            <input class="ship-minmax-stat__input" type="number" name="attr_ship_wounds_max" placeholder="2" />
                        </div>
                    </div>
                    <div class="ship-minmax-stat">
                        <span class="ship-minmax-stat__label">Hull</span>
                        <div class="ship-minmax-stat__inputs">
                            <input class="ship-minmax-stat__input" type="number" name="attr_ship_hull" placeholder="10" />
                            <span class="ship-minmax-stat__sep">/</span>
                            <input class="ship-minmax-stat__input" type="number" name="attr_ship_hull_max" placeholder="10" />
                        </div>
                    </div>
                    <div class="ship-hull-thresholds">
                        <div class="ship-hull-threshold">
                            <span class="ship-hull-threshold__pct">25%</span>
                            <input class="ship-hull-threshold__input" type="number" name="attr_hull_25" placeholder="8" />
                        </div>
                        <div class="ship-hull-threshold">
                            <span class="ship-hull-threshold__pct">50%</span>
                            <input class="ship-hull-threshold__input" type="number" name="attr_hull_50" placeholder="5" />
                        </div>
                        <div class="ship-hull-threshold">
                            <span class="ship-hull-threshold__pct">75%</span>
                            <input class="ship-hull-threshold__input" type="number" name="attr_hull_75" placeholder="3" />
                        </div>
                    </div>
                </div>
            </Frame>
        </section>

        <!-- Operations & Maintenance Column -->
        <section class="ship-sheet__operations">
            <Frame mode="light-grey" corner="medium">
                <Header title="Ship Operations & Maintenance" />
                <div class="ship-operations">
                    <div class="ship-operation-card">
                        <div class="ship-operation-card__header">
                            <Button action="annual_maintenance" label="Annual Maintenance Check" />
                        </div>
                        <p class="ship-operation-card__desc">
                            Rolls a <strong>Systems Check</strong>. Failure rolls once on the <em>Maintenance Issues Table</em> (everyone gains 1 Stress). Critical Failure rolls twice on the table (everyone makes a Panic Check).
                        </p>
                    </div>

                    <div class="ship-operation-card">
                        <div class="ship-operation-card__header">
                            <Button action="bankruptcy_save" label="Bankruptcy Save" />
                        </div>
                        <p class="ship-operation-card__desc">
                            Rolls 1d100 under your <strong>Bankruptcy Save</strong> (defaults to 2d10+10) and resolves consequences from the <em>Bankruptcy Table</em>.
                        </p>
                    </div>
                </div>
            </Frame>

            <Frame mode="light" corner="medium">
                <Header title="Secondary Stats" />
                <div class="ship-secondary-stats">
                    <div class="ship-minmax-stat">
                        <span class="ship-minmax-stat__label">Crew</span>
                        <div class="ship-minmax-stat__inputs">
                            <input class="ship-minmax-stat__input" type="number" name="attr_crew" placeholder="0" />
                            <span class="ship-minmax-stat__sep">/</span>
                            <input class="ship-minmax-stat__input" type="number" name="attr_crew_max" placeholder="0" />
                        </div>
                    </div>
                    <div class="ship-minmax-stat">
                        <span class="ship-minmax-stat__label">Fuel</span>
                        <div class="ship-minmax-stat__inputs">
                            <input class="ship-minmax-stat__input" type="number" name="attr_fuel" placeholder="0" />
                            <span class="ship-minmax-stat__sep">/</span>
                            <input class="ship-minmax-stat__input" type="number" name="attr_fuel_max" placeholder="0" />
                        </div>
                    </div>
                    <div class="ship-stat-row">
                        <label class="ship-stat-row__label" for="attr_loadout_max">Max Cargo</label>
                        <input class="ship-stat-row__input" type="number" name="attr_loadout_max" placeholder="0" />
                    </div>
                </div>
            </Frame>
        </section>

        <!-- Weapons Section -->
        <section class="ship-sheet__weapons">
            <Frame mode="light" corner="medium">
                <Header title="Ship Weapons" />
                <div class="ship-repeating-head ship-repeating-head--weapons">
                    <span>Weapon</span>
                    <span>Damage</span>
                </div>
                <fieldset class="repeating_shipweapons">
                    <div class="ship-weapon-row">
                        <input class="ship-weapon-row__name" type="text" name="attr_shipweapon_name" placeholder="Weapon Name" />
                        <input class="ship-weapon-row__damage" type="text" name="attr_shipweapon_damage" placeholder="Damage" />
                        <textarea class="ship-weapon-row__notes" name="attr_shipweapon_notes" placeholder="Notes"></textarea>
                    </div>
                </fieldset>
            </Frame>
        </section>

        <!-- Officers & Crew Section -->
        <section class="ship-sheet__crew">
            <Frame mode="light" corner="medium">
                <Header title="Officers & Crew" />
                <div class="ship-repeating-head ship-repeating-head--crew">
                    <span>Name</span>
                    <span>Rank / Role</span>
                </div>
                <fieldset class="repeating_shipcrew">
                    <div class="ship-crew-row">
                        <input class="ship-crew-row__name" type="text" name="attr_shipcrew_name" placeholder="Name" />
                        <input class="ship-crew-row__rank" type="text" name="attr_shipcrew_rank" placeholder="Rank / Role" />
                    </div>
                </fieldset>
            </Frame>
        </section>

        <!-- Cargo & Loadout Section -->
        <section class="ship-sheet__cargo">
            <Frame mode="light" corner="medium">
                <Header title="Cargo & Loadout" />
                <div class="ship-repeating-head ship-repeating-head--cargo">
                    <span>Item</span>
                    <span>Amount</span>
                </div>
                <fieldset class="repeating_shiploadout">
                    <div class="ship-cargo-row">
                        <input class="ship-cargo-row__item" type="text" name="attr_shiploadout_item" placeholder="Item" />
                        <input class="ship-cargo-row__number" type="text" name="attr_shiploadout_number" placeholder="#" />
                    </div>
                </fieldset>
            </Frame>
        </section>
    </div>
</div>

<style lang="scss">
    .ship-sheet {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        font-family: var(--font-body, "Century Gothic", "Diadact Gothic", sans-serif);
        color: var(--color-text, #000000);
        background-color: var(--color-bg, #ffffff);

        &__header {
            width: 100%;
        }

        &__grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;

            @media (max-width: 800px) {
                grid-template-columns: 1fr;
            }
        }

        &__stats,
        &__operations,
        &__weapons,
        &__crew,
        &__cargo {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        &__weapons,
        &__crew,
        &__cargo {
            grid-column: 1 / -1;
        }
    }

    .ship-header {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 2rem;
        align-items: center;

        &__logo {
            display: flex;
            align-items: center;
        }

        &__img {
            max-height: 4.5rem;
            width: auto;
        }

        &__fields {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 1rem;
        }

        &__field {
            &--name {
                grid-column: 1 / -1;
            }
        }
    }

    .ship-stats-list,
    .ship-secondary-stats {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .ship-stat-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 1rem;
        align-items: center;

        &__label {
            font-weight: bold;
            text-transform: uppercase;
            font-size: 1.1rem;
        }

        &__input {
            width: 4.5rem;
            height: 2.5rem;
            text-align: center;
            font-size: 1.3rem;
            font-weight: bold;
            border: 2px solid var(--color-border, #000000);
            border-radius: 4px;
        }
    }

    .ship-minmax-stat {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 1rem;
        align-items: center;

        &__label {
            font-weight: bold;
            text-transform: uppercase;
            font-size: 1.1rem;
        }

        &__inputs {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        &__input {
            width: 3.5rem;
            height: 2.5rem;
            text-align: center;
            font-size: 1.2rem;
            font-weight: bold;
            border: 2px solid var(--color-border, #000000);
            border-radius: 4px;
        }

        &__sep {
            font-weight: bold;
            font-size: 1.2rem;
        }
    }

    .ship-hull-wounds {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .ship-hull-thresholds {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 0.75rem;
        margin-top: 0.5rem;
    }

    .ship-hull-threshold {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;

        &__pct {
            font-weight: bold;
            font-size: 0.9rem;
            text-transform: uppercase;
            color: var(--color-text-muted, #666666);
        }

        &__input {
            width: 100%;
            height: 2.25rem;
            text-align: center;
            font-weight: bold;
            border: 2px solid var(--color-border, #000000);
            border-radius: 4px;
        }
    }

    .ship-operations {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .ship-operation-card {
        padding: 1rem;
        border: 2px solid var(--color-border, #000000);
        border-radius: 8px;
        background-color: var(--color-bg, #ffffff);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        &__header {
            display: flex;
            align-items: center;
        }

        &__desc {
            margin: 0;
            font-size: 0.95rem;
            line-height: 1.4;
            color: var(--color-text, #000000);
        }
    }

    .ship-repeating-head {
        display: grid;
        font-weight: bold;
        text-transform: uppercase;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--color-border, #000000);
        margin-bottom: 0.5rem;

        &--weapons {
            grid-template-columns: 2fr 1fr;
            gap: 1rem;
        }

        &--crew {
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        &--cargo {
            grid-template-columns: 3fr 1fr;
            gap: 1rem;
        }
    }

    .ship-weapon-row {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 0.75rem;
        margin-bottom: 0.75rem;

        &__name,
        &__damage {
            padding: 0.4rem;
            border: 1px solid var(--color-border, #000000);
            border-radius: 4px;
        }

        &__notes {
            grid-column: 1 / -1;
            padding: 0.4rem;
            border: 1px solid var(--color-border, #000000);
            border-radius: 4px;
            min-height: 3rem;
            resize: vertical;
        }
    }

    .ship-crew-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        margin-bottom: 0.75rem;

        &__name,
        &__rank {
            padding: 0.4rem;
            border: 1px solid var(--color-border, #000000);
            border-radius: 4px;
        }
    }

    .ship-cargo-row {
        display: grid;
        grid-template-columns: 3fr 1fr;
        gap: 0.75rem;
        margin-bottom: 0.75rem;

        &__item,
        &__number {
            padding: 0.4rem;
            border: 1px solid var(--color-border, #000000);
            border-radius: 4px;
        }
    }
</style>

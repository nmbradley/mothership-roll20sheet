<script lang="ts">
  import RepeatingClass from "#svelte/charactermancer/components/RepeatingClass.svelte";
  import RepeatingFloatingChoice from "#svelte/charactermancer/components/RepeatingFloatingChoice.svelte";
  import RepeatingSkillSelection from "#svelte/charactermancer/components/RepeatingSkillSelection.svelte";
  import ClassSlide from "#svelte/charactermancer/slides/ClassSlide.svelte";
  import EquipmentSlide from "#svelte/charactermancer/slides/EquipmentSlide.svelte";
  import FinalSlide from "#svelte/charactermancer/slides/FinalSlide.svelte";
  import IntroSlide from "#svelte/charactermancer/slides/IntroSlide.svelte";
  import ReviewSlide from "#svelte/charactermancer/slides/ReviewSlide.svelte";
  import SkillsSlide from "#svelte/charactermancer/slides/SkillsSlide.svelte";
  import StatsSlide from "#svelte/charactermancer/slides/StatsSlide.svelte";
</script>

<IntroSlide />
<StatsSlide />
<ClassSlide />
<RepeatingClass />
<RepeatingSkillSelection />
<RepeatingFloatingChoice />
<SkillsSlide />
<EquipmentSlide />
<ReviewSlide />
<FinalSlide />

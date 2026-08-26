<script lang="ts">
  import RepeatingClass from "#svelte/charactermancer/components/RepeatingClass.svelte";
  import RepeatingSkillSelection from "#svelte/charactermancer/components/RepeatingSkillSelection.svelte";
  import ClassSlide from "#svelte/charactermancer/slides/ClassSlide.svelte";
  import EquipmentSlide from "#svelte/charactermancer/slides/EquipmentSlide.svelte";
  import FinalSlide from "#svelte/charactermancer/slides/FinalSlide.svelte";
  import IntroSlide from "#svelte/charactermancer/slides/IntroSlide.svelte";
  import ReviewSlide from "#svelte/charactermancer/slides/ReviewSlide.svelte";
  import SkillsSlide from "#svelte/charactermancer/slides/SkillsSlide.svelte";
  import StatsSlide from "#svelte/charactermancer/slides/StatsSlide.svelte";
</script>

<!--
  No wrapper element. Roll20 reads each <charmancer> as a page of the
  charactermancer and only recognises them as top-level elements of the sheet;
  nested inside a div they are dropped, which is what left the block empty in
  the rendered sheet. The official Mothership sheet emits them the same way,
  after the roll templates.
-->
<IntroSlide />
<StatsSlide />
<ClassSlide />
<RepeatingClass />
<RepeatingSkillSelection />
<SkillsSlide />
<EquipmentSlide />
<ReviewSlide />
<FinalSlide />

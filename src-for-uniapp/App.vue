<template>
	<div id="app">
		<home-main></home-main>
	</div>
</template>

<script lang="ts">
import { createComponent } from "@vue/composition-api";
import homeMain from "./components/Home/main.vue";
export default createComponent({
	name: "app",
	components: {
		homeMain
	}
});
</script>

<style lang="less" scoped></style>

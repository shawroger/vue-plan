<template>
	<div id="app-nav">
		<mu-appbar :title="title"></mu-appbar>
	</div>
</template>

<script lang="ts">
import { createComponent } from "@vue/composition-api";
import { title } from "../utils/config";

export default createComponent({
	name: "app-nav",
	setup() {
		return {
			title
		};
	}
});
</script>

<style lang="less" scoped>
#app-nav {
	.mu-appbar {
		color: @textColor;
		width: 100%;
		padding-left: 15px;
	}
}
</style>

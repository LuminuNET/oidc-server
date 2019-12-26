<template>
	<lm-footer :partners="partners" />
</template>

<script lang="ts">
import Vue from "vue";
import { LmFooter } from "@luminu/components";

export default Vue.extend({
	name: "LmCustomFooter",
	components: {
		LmFooter
	},
	data: () => ({
		partners: [
			{
				to: "https://cytooxien.de",
				image: require("@/assets/cytooxien_banner.png")
			},
			{
				to: "https://nitra.do/luminu",
				image: require("@/assets/nitrado_banner.png")
			}
		]
	})
});
</script>

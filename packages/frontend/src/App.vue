<template>
	<div id="app">
		<lm-header :image="require('@/assets/style-logo.png')" />
		<lm-custom-sticky-header
			:links="[
				{
					name: 'overview',
					to: 'hi',
					external: false,
					hasChildren: false
				}
			]"
		/>
		<router-view class="view" />
		<lm-custom-footer />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";

import { LmHeader } from "@luminu/components";
import LmCustomStickyHeader from "@/components/layout/CustomStickyHeader.vue";
import LmCustomFooter from "@/components/layout/CustomFooter.vue";

import { ENTER_OIDC } from "./store/actions.type";
import { GET_OIDC, GET_VALIDITY } from "./store/getters.type";

export default Vue.extend({
	components: {
		LmCustomStickyHeader,
		LmHeader,
		LmCustomFooter
	},
	methods: {
		...mapActions([ENTER_OIDC]),
		...mapGetters([GET_OIDC, GET_VALIDITY])
	},
	created() {
		this[ENTER_OIDC]();
		// eslint-disable-next-line no-console
		console.log(this[GET_OIDC]());
		// eslint-disable-next-line no-console
		console.log(this[GET_VALIDITY]());
	},
	data: () => ({
		partners: [
			{
				to: "https://cytooxien.de",
				image: require("@/assets/cytooxien_banner.png")
			}
		]
	})
});
</script>

<style lang="scss">
@import "~@luminu/core/scss/_globals.scss";
</style>

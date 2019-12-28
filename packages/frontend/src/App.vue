<template>
	<div id="app">
		<div :class="{ loader: loading }">
			<div class="overlay-loader">
				<lm-loader class="lm-loader" :mtop="20" :mbottom="20" :size="24" :justifyCenter="true" />
				<h3>{{ $t('global.buildingWebsite') }}...</h3>
			</div>

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
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";

import { LmHeader, LmLoader } from "@luminu/components";
import LmCustomStickyHeader from "@/components/layout/CustomStickyHeader.vue";
import LmCustomFooter from "@/components/layout/CustomFooter.vue";

import { ENTER_OIDC, ENTER_PROMPT } from "./store/actions.type";
import { GET_OIDC, GET_VALIDITY } from "./store/getters.type";
import { UPDATE_LOADING_STATE } from "./store/mutations.type";

export default Vue.extend({
	components: {
		LmCustomStickyHeader,
		LmHeader,
		LmCustomFooter,
		LmLoader
	},
	methods: {
		...mapActions([ENTER_OIDC, ENTER_PROMPT]),
		...mapGetters([GET_OIDC, GET_VALIDITY])
	},
	created() {
		this[ENTER_OIDC]();
		this[ENTER_PROMPT]();

		this.$store.subscribe((mutation, state) => {
			if (mutation.type === UPDATE_LOADING_STATE) {
				this.loading = state.loading;
			}
		});
	},
	data: () => ({
		loading: true
	})
});
</script>

<style lang="scss">
@import "~@luminu/core/scss/_globals.scss";

.overlay-loader {
	display: none;

	* {
		display: none;
	}
}

.loader {
	* {
		display: none;
	}

	.overlay-loader {
		display: unset;
		height: 100vh;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		z-index: 1000000;
		background: $background;
		flex-direction: column;

		h3 {
			font-weight: 400;
			color: #555;
		}

		* {
			display: unset;
		}
	}
}
</style>

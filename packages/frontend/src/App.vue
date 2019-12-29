<template>
	<div id="app">
		<div class="overlay-loader" :class="{ active: loading }">
			<lm-loader class="lm-loader" :mtop="20" :mbottom="20" :size="24" :justifyCenter="true" />
			<h3>{{ $t('global.buildingWebsite') }}...</h3>
		</div>

		<div :class="{ loader: loading }">
			<lm-header :image="require('@/assets/style-logo.png')" />
			<lm-custom-sticky-header />
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

import {
	ENTER_OIDC,
	ENTER_PROMPT,
	CHECK_LOGGED_IN
} from "./store/actions.type";
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
			switch (mutation.type) {
				case UPDATE_LOADING_STATE:
					this.loading = state.loading;
					break;
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
	transition: all 0.35s ease;
	height: 100vh;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	z-index: -1;
	background: $background;
	flex-direction: column;
	opacity: 0;

	&.active {
		opacity: 1;
		z-index: 100000;
	}

	h3 {
		font-weight: 400;
		color: #555;
	}
}

.loader {
	* {
		display: none;
	}
}
</style>

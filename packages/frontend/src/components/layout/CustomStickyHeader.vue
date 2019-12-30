<template>
	<lm-sticky-header
		:links="links"
		:isLoggedIn="isLoggedIn"
		:username="username"
		:userId="userId"
		:hasAvatar="hasAvatar"
		:notLoggedInAction="{action: () => $router.push({path: '/login', query: {...$route.query}})}"
		:dropdownItems="[
			{
				name: 'preferences',
				action: () => {
					openExternalLink('https://luminu.net/account/preferences')
				}
			},
			{
				name: 'logout',
				fn,
				action: () => {
					removeItem('access_token');
					this[fn]();
				}
			}
		]"
	/>
</template>

<style lang="scss" scoped>
.user-auth {
	.user-auth__avatar {
		width: 21px;
		height: 21px;
		background-color: #fff;
		border-radius: 50%;
		margin-right: 5px;
		margin-bottom: -5px;
	}
}
</style>

<script lang="ts">
import Vue from "vue";
import { LmStickyHeader } from "@luminu/components";
import { CHECK_LOGGED_IN } from "../../store/actions.type";
import { mapActions } from "vuex";
import { SET_LOGGED_IN_STATUS } from "../../store/mutations.type";
import { removeItem } from "../../common/localStorage.service";

export default Vue.extend({
	name: "LmCustomStickyHeader",
	components: {
		LmStickyHeader
	},
	methods: {
		...mapActions([CHECK_LOGGED_IN]),
		removeItem,
		openExternalLink(link: string) {
			window.open(link, "_blank");
		}
	},
	created() {
		this.$store.subscribe((mutation, state) => {
			switch (mutation.type) {
				case SET_LOGGED_IN_STATUS:
					this.isLoggedIn = state.isLoggedIn;
					this.userId = state.userId;
					this.username = state.username;
					this.hasAvatar = state.hasAvatar;
					break;
			}
		});
	},
	mounted() {
		this[CHECK_LOGGED_IN]();
	},
	data: () => ({
		isLoggedIn: false,
		userId: -1,
		username: "",
		hasAvatar: false,
		links: [
			{
				name: "home",
				to: "https://luminu.net/",
				isExternal: true,
				hasChildren: false
			},
			{
				name: "forum",
				to: "https://luminu.net/forums",
				isExternal: true,
				hasChildren: false
			}
		],
		fn: CHECK_LOGGED_IN
	})
});
</script>

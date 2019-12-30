<template>
	<lm-sticky-header :links="links">
		<li class="user-auth">
			<p
				v-if="!isLoggedIn"
				@click="isLoggedIn ? '' : $router.push({path:'login', query: {...$route.query}})"
			>{{ $t('navigation.login') }}</p>
			<p v-else>
				<img
					class="user-auth__avatar"
					:src="hasAvatar ? `https://luminu.net/data/avatars/m/0/${userId}.jpg` : 'https://luminu.net/img/noAvatar.png'"
					alt
				/>
				<span class="user-auth__name">{{ username }}</span>
			</p>
		</li>
	</lm-sticky-header>
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

export default Vue.extend({
	name: "LmCustomStickyHeader",
	components: {
		LmStickyHeader
	},
	methods: {
		...mapActions([CHECK_LOGGED_IN])
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
		]
	})
});
</script>

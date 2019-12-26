<template>
	<div class="home">
		<lm-notification :message="$t('response.' + notification.message)" :active="notification.active" />
		<div class="container">
			<lm-card class="allow-permissions">
				<p class="title">{{ name }}</p>
				<p class="description">{{ $t('modal.wantsAccessFollowingPartsFromYourAccount') }}</p>
				<lm-seperator :mtop="15" :mbottom="13" />
				<div class="permissions">
					<div v-show="permissions.basic.length !== 0" class="permission--basic">
						<p
							v-for="(scope, index) in permissions.basic"
							:key="index"
							class="permission"
						>{{ $t('permissions.basic.' + scope) }}</p>
					</div>
					<div v-show="permissions.advanced.length !== 0" class="permission--advanced">
						<p
							v-for="(scope, index) in permissions.advanced"
							:key="index"
							class="permission"
						>{{ $t('permissions.advanced.' + scope) }}</p>
					</div>
				</div>
				<lm-seperator :mtop="15" :mbottom="13" />
				<div class="btn-group">
					<lm-button :text="$t('modal.deny')" type="error" />
					<lm-button :text="$t('modal.accept')" type="success" />
				</div>
			</lm-card>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
	LmCard,
	LmSeperator,
	LmButton,
	LmNotification
} from "@luminu/components";
import { mapGetters } from "vuex";
import { GET_OIDC } from "../store/getters.type";
import { TOidcInput } from "@luminu/types";
import { AxiosResponse, AxiosError } from "axios";

export default Vue.extend({
	name: "home",
	components: {
		LmCard,
		LmSeperator,
		LmButton,
		LmNotification
	},
	methods: {
		...mapGetters([GET_OIDC]),
		sendNotification(message: string) {
			this.notification.message = message;
			this.notification.active = true;
			setTimeout(() => {
				this.notification.active = false;
			}, 0);
		}
	},
	data: () => ({
		name: "",
		permissions: {
			basic: [],
			advanced: []
		},
		notification: {
			message: "",
			active: false
		}
	}),
	created() {
		const oidc: TOidcInput = this[GET_OIDC]();

		// handle illegal request
		if (
			!oidc.clientId ||
			!oidc.responseType ||
			!oidc.redirectUri ||
			!oidc.scope ||
			!oidc.state ||
			!oidc.nonce
		) {
		} else {
			(this as any).$http
				.get(
					`information?client_id=${oidc.clientId}&scope=${oidc.scope}`
				)
				.then((response: AxiosResponse) => {
					this.permissions.basic = response.data.permission_basic;
					this.permissions.advanced =
						response.data.permission_advanced;

					this.name = response.data.name;
				})
				.catch((error: AxiosError) => {
					if (error.response) {
						this.sendNotification(error.response.data.message);
					} else {
						this.sendNotification("serviceUnavailable");
					}
				});
		}
	}
});
</script>

<style lang="scss" scoped>
@import "~@luminu/core/scss/_variables.scss";

.home {
	.allow-permissions {
		width: 420px;
		margin: 0 auto;
		position: relative;

		.permissions {
			.permission {
				font-size: 16px;
				width: 100%;
				user-select: none;
			}

			.permission--basic,
			.permission--advanced {
				margin-bottom: 10px;
				background-color: $background;
				border-radius: 5px;
				padding-top: 4px;
				padding-bottom: 5px;
				box-shadow: 0px 1px 1px rgba($color: #000000, $alpha: 0.2);
				color: #333;

				padding-left: 10px;
				padding-right: 10px;
			}

			.permission--basic {
				border-top: 2px solid $lmSuccess;
			}

			.permission--advanced {
				border-top: 2px solid $lmError;
			}
		}

		.btn-group {
			display: flex;
			justify-content: flex-end;

			> div {
				margin-left: 5px;
			}
		}
	}

	@media screen and (max-width: 475px) {
		.allow-permissions {
			width: 90%;
		}
	}
}
</style>

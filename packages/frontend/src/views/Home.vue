<template>
	<div class="home">
		<lm-notification :message="$t('response.' + notification.message)" :active="notification.active" />

		<div class="container">
			<lm-card class="allow-permissions">
				<p class="title">{{ name }}</p>
				<p class="description">{{ $t('modal.wantsAccessFollowingPartsFromYourAccount') }}</p>

				<lm-seperator :mtop="15" :mbottom="13" />

				<div class="permissions">
					<div v-if="permissions.basic.length" class="permission--basic">
						<p
							v-for="(scope, index) in permissions.basic"
							:key="index"
							class="permission"
						>{{ $t('permissions.basic.' + scope) }}</p>
					</div>

					<div v-if="permissions.advanced.length" class="permission--advanced">
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
					<lm-button :text="$t('modal.accept')" type="success" @click.native="consentGiven(null)" />
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
import { mapGetters, mapActions } from "vuex";
import { GET_OIDC, GET_PROMPT } from "../store/getters.type";
import { TOidcInput } from "@luminu/types";
import Axios, { AxiosResponse, AxiosError } from "axios";
import { api } from "../plugins/axios";
import { REGISTER_LOADING, FINISHED_LOADING } from "../store/actions.type";
import { getItem } from "../common/localStorage.service";

export default Vue.extend({
	name: "home",
	components: {
		LmCard,
		LmSeperator,
		LmButton,
		LmNotification
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
	mounted() {
		const oidc: TOidcInput = this[GET_OIDC]();

		if (
			!oidc.clientId ||
			!oidc.responseType ||
			!oidc.redirectUri ||
			!oidc.scope ||
			!oidc.state ||
			!oidc.nonce
		) {
			this.sendNotification("oidcRequiredParametersNotGiven");
			setTimeout(() => {
				this[FINISHED_LOADING]();
			}, 0);
		} else {
			const prompt = this[GET_PROMPT]();

			switch (prompt) {
				case "none":
					this.consentGiven(oidc, prompt);
					break;
				case "consent":
					this.getInformation(oidc);
					break;
				default:
					this.getInformation(oidc);
			}
		}
	},
	methods: {
		...mapGetters([GET_OIDC, GET_PROMPT]),
		...mapActions([FINISHED_LOADING, REGISTER_LOADING]),
		sendNotification(message: string) {
			this.notification.message = message;
			this.notification.active = true;
			setTimeout(() => {
				this.notification.active = false;
			}, 0);
		},
		successfulResponse(oidc: TOidcInput, data: any) {
			window.location.href = `${oidc.redirectUri}
									?state=${data.state}
									&access_token=${data.access_token}
									&id_token=${data.id_token}
									&expires_in=${data.expires_in}
									&token_type=${data.token_type}`;
		},
		consentGiven(oidc: TOidcInput, prompt?: string) {
			if (oidc === null) {
				oidc = this[GET_OIDC]();
			}

			api.post(
				`/authorize?response_type=${oidc.responseType}
						&client_id=${oidc.clientId}
						&redirect_uri=${oidc.redirectUri}
						&scope=${oidc.scope}
						&state=${oidc.state}
						&nonce=${oidc.nonce}
						&prompt=${prompt}`,
				null,
				{
					headers: {
						Authorization: "Bearer " + getItem("access_token")
					}
				}
			).catch((error: AxiosError) => {
				if (error.response) {
					const statusCode = error.response.status;

					switch (statusCode) {
						case 302:
							this.successfulResponse(oidc, error.response.data);
							break;
						default:
							this.sendNotification(error.response.data.message);
					}
				} else {
					this.sendNotification("serviceUnavailable");
				}
			});
		},
		getInformation(oidc: TOidcInput) {
			this[REGISTER_LOADING]();

			setTimeout(() => {
				api.get(
					`/information?client_id=${oidc.clientId}&scope=${oidc.scope}`
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
					})
					.finally(() => {
						this[FINISHED_LOADING]();
					});
			}, 500);
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

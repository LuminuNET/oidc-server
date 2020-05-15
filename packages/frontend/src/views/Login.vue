<template>
	<div class="login">
		<lm-notification :message="$t('response.' + notification.message)" :active="notification.active" />
		<div class="container">
			<lm-card class="login-card">
				<p class="title">{{ $t('navigation.login') }}</p>
				<lm-seperator :mbottom="10" />
				<label for="user">{{ $t('login.username') }} / {{ $t('login.email') }}</label>
				<br />
				<input
					autofocus
					maxlength="64"
					@keydown.enter="login"
					v-model="user"
					type="text"
					name="user"
					id="user"
				/>
				<br />
				<label for="password">{{ $t('login.password') }}</label>
				<br />
				<input
					maxlength="256"
					@keydown.enter="login"
					v-model="password"
					type="password"
					name="password"
					id="password"
					ref="password"
				/>
				<lm-seperator :mbottom="14" />
				<div class="btn-group">
					<lm-button @click.native="login" :text="$t('navigation.login')" type="success" />
				</div>
			</lm-card>
			<div class="help-group">
				<a
					href="https://luminu.net/lost-password/"
					target="_blank"
					class="help__item"
				>Forgot your password</a>
				<a href="https://luminu.net/register" target="_blank" class="help__item">Register</a>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import {
	LmCard,
	LmButton,
	LmSeperator,
	LmNotification
} from "@luminu/components";
import { api } from "../plugins/neojax";
import { mapActions } from "vuex";
import { FINISHED_LOADING, CHECK_LOGGED_IN } from "../store/actions.type";
import { setItem } from "../common/localStorage.service";
import { NeojaxResponse, NeojaxError } from "neojax";

export default Vue.extend({
	name: "login",
	components: {
		LmCard,
		LmButton,
		LmSeperator,
		LmNotification
	},
	data: () => ({
		user: "",
		password: "",
		notification: {
			message: "",
			active: false
		}
	}),
	mounted() {
		setTimeout(() => {
			this[FINISHED_LOADING]();
		}, 0);
	},
	methods: {
		...mapActions([FINISHED_LOADING, CHECK_LOGGED_IN]),
		async login(): Promise<void> {
			// Basic typechecking
			if (!this.user.length) {
				this.sendNotification("noUsernameOrEmailSpecified");
			} else if (!this.password.length) {
				this.sendNotification("noPasswordSpecified");
			}

			// Send request to server
			api.post("/login", {
				user: this.user,
				password: this.password
			})
				.then((response: NeojaxResponse) => {
					setItem("access_token", response.data.accessToken);
					this.sendNotification(response.data.message);
					this[CHECK_LOGGED_IN]();
					this.$router.push({
						path: "/",
						query: { ...this.$route.query }
					});
				})
				.catch((error: NeojaxError) => {
					this.sendNotification(error.response.data.message);
					// @ts-ignore
					this.$refs.password.value = "";
				});
		},
		sendNotification(message: string) {
			this.notification.message = message;

			this.notification.active = true;
			setTimeout(() => {
				this.notification.active = false;
			}, 0);
		}
	}
});
</script>

<style lang="scss" scoped>
@import "~@luminu/core/scss/_variables.scss";

.login {
	.container {
		// Setting the card width on the container instead of the lm-card
		// as no content must overflow and we require a parent with a fixed
		// width for login-card
		width: 420px;
	}

	.help-group {
		display: flex;
		justify-content: space-between;

		.help__item {
			font-size: 14px;
		}
	}

	.login-card {
		position: relative;
		margin: 0 auto;
		margin-bottom: 15px;

		.seperator {
			margin-top: 10px;
			margin-bottom: 15px;

			hr {
				position: absolute;
				width: 100%;
				margin-left: -10px;
				border: none;
				border-top: 1px solid rgba($color: #000000, $alpha: 0.3);
			}
		}

		input {
			border: none;
			box-shadow: none;

			width: 100%;
			height: 28px;
			border: 1px solid black;
			border-radius: 2px;
			text-indent: 5px;

			transition: box-shadow 0.1s ease-out;

			margin-top: 5px;
			margin-bottom: 10px;
			font-size: 14px;
			text-indent: 5px;

			&:focus {
				outline: none;
				box-shadow: 0px 0px 0px 3px rgba($color: $lmColor3, $alpha: 0.5);
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
}
</style>

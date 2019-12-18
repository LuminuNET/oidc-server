<template>
	<div class="login">
		<div class="container">
			<lm-card class="login-card">
				<p class="title">{{ $t('navigation.login') }}</p>
				<div class="seperator">
					<hr />
				</div>
				<label for="user">{{ $t('login.username') }} / {{ $t('login.email') }}</label>
				<br />
				<input @keydown.enter="login" v-model="user" type="text" name="user" id="user" />
				<br />
				<label for="password">{{ $t('login.password') }}</label>
				<br />
				<input @keydown.enter="login" v-model="password" type="password" name="password" id="password" />
				<div style="margin-bottom: 20px;" class="seperator">
					<hr />
				</div>
				<div class="btn-group">
					<div @click="login" class="btn success">
						<p class="btn__content">{{ $t('navigation.login') }}</p>
					</div>
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
import { LmCard } from "@luminu/components";

export default Vue.extend({
	name: "login",
	components: {
		LmCard
	},
	data: () => ({
		user: "",
		password: ""
	}),
	methods: {
		async login(): Promise<void> {}
	}
});
</script>

<style lang="scss" scoped>
@import "~@luminu/ui-kit/scss/_variables.scss";

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

			transition: box-shadow 0.1s ease-out;

			margin-top: 5px;
			margin-bottom: 10px;

			&:focus {
				outline: none;
				font-size: 14px;
				text-indent: 5px;
				box-shadow: 0px 0px 0px 2px rgba($color: $lmColor3, $alpha: 0.5);
			}
		}

		.btn-group {
			display: flex;
			justify-content: flex-end;

			> div {
				margin-left: 5px;
			}

			.btn {
				padding: 2px 10px;
				border-radius: 5px;
				user-select: none;
				font-size: 14px;

				cursor: pointer;
				color: white;

				background-color: $lmColor2;
				box-shadow: 0px 2px rgba($color: $lmColor3, $alpha: 1);
				transition: background-color 0.1s ease-out;

				&:hover {
					background-color: $lmColor3;
				}

				&.success {
					background-color: $lmSuccess;
					box-shadow: 0px 3px
						rgba($color: $lmSuccessDarken, $alpha: 1);

					&:hover {
						background-color: $lmSuccessDarken;
					}
				}
			}
		}
	}
}
</style>

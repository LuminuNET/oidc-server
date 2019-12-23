<template>
	<div class="home">
		<div class="container">
			<lm-card class="allow-permissions">
				<p class="title">Luminu Chat,</p>
				<p class="description">{{ $t('modal.wantsAccessFollowingPartsFromYourAccount') }}</p>
				<lm-seperator :mtop="15" :mbottom="13" />
				<div class="permissions">
					<div class="permission--basic">
						<p class="permission">Basic Profile</p>
						<p class="permission">Global Player Rank</p>
					</div>
					<div class="permission--advanced">
						<p class="permission">Modify Email</p>
					</div>
				</div>
				<lm-seperator :mtop="15" :mbottom="13" />
				<div class="btn-group">
					<div class="btn error">
						<p class="btn__content">{{ $t('modal.deny') }}</p>
					</div>
					<div class="btn success">
						<p class="btn__content">{{ $t('modal.accept') }}</p>
					</div>
				</div>
			</lm-card>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { LmCard, LmSeperator } from "@luminu/components";

export default Vue.extend({
	name: "home",
	components: {
		LmCard,
		LmSeperator
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

				&.error {
					background-color: $lmError;
					box-shadow: 0px 3px rgba($color: $lmErrorDarken, $alpha: 1);

					&:hover {
						background-color: $lmErrorDarken;
					}
				}
			}
		}

		.seperator {
			margin-top: 15px;
			margin-bottom: 30px;

			hr {
				position: absolute;
				width: 100%;
				margin-left: -10px;
				border: none;
				border-top: 1px solid rgba($color: #000000, $alpha: 0.3);
			}
		}
	}
}
</style>

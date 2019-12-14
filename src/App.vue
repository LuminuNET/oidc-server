<template>
	<div id="app">
		<lm-header :image="require('@/assets/style-logo.png')" />
		<lm-sticky-header
			:links="[
				{
					name: 'overview',
					to: 'hi',
					external: false,
					hasChildren: false
				}
			]"
		/>
		<router-view />
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import LmStickyHeader from '@bit/kennytv.luminu.sticky-header';
import LmHeader from '@bit/kennytv.luminu.lm-header';

export default Vue.extend({
	components: {
		LmStickyHeader,
		LmHeader
	}
});
</script>

<style lang="scss">
@import '~@keimeno/scss/_globals.scss';
</style>

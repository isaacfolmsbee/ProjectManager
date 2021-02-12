<template >
<div id="app">
	<div>
		<TheNavbar :darkMode="darkMode" @changeTheme="darkMode = !darkMode" />
		<router-view class="pt-16 xl:pt-0 xl:px-36" />
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import TheNavbar from './components/TheNavbar.vue';

export default Vue.extend({
	name: 'App',
	components: {
		TheNavbar,
	},
	data() {
		return {
			darkMode: false,
		}
	},
	watch: {
		darkMode: function () {
			const html = document.getElementsByTagName('html')[0];
			if (this.darkMode) {
				html.setAttribute('class', 'dark');
			} else {
				html.setAttribute('class', '');
			}
			
			
		}
	}
});
</script>

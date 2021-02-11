<template >
<div id="app" :class="{ 'dark': darkMode }">
	<div class="bg-gray-100 dark:bg-gray-700 transition-colors duration-300">
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
	}
});
</script>

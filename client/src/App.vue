<template>
<div id="app">
	<TheNavbar />
	<router-view class="pt-16 xl:pt-0 xl:px-36" />
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import TheNavbar from './components/TheNavbar.vue';

export default Vue.extend({
name: 'App',
components: {
	TheNavbar,
}
});
</script>

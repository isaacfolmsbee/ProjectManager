<template>
<div>

</div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	created() {
		sessionStorage.removeItem('authtoken');
		this.$router.push('/login');
	}
})
</script>
<template>
<div>

</div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	created() {
		this.$emit('updateJWT', undefined);
		this.$router.push('/login');
	}
})
</script>
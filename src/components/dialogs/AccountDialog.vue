<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '../../stores/settings'

const visible = ref(false);
const settings = useSettingsStore();
</script>

<template>
  <Button icon="pi pi-user" severity="primary" outlined @click="visible = true" />
  <Dialog v-model:visible="visible" modal header="Sign In">
    <Account v-if="settings.session" :session="settings.session" />
    <Auth v-else />
  </Dialog>
</template>

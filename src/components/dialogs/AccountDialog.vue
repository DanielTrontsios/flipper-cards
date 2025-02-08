<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '../../stores/settings'
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const visible = ref(false);
const settings = useSettingsStore();
const confirm = useConfirm();
const toast = useToast();

const items = [
  {
    label: 'Upload Questions',
    icon: 'pi pi-cloud-upload',
    command: () => {
      console.log('Account');
    }
  },
  {
    label: 'Download Questions',
    icon: 'pi pi-cloud-download',
    command: () => {
      downloadQuestions();
    }
  },
];

const downloadQuestions = () => {
  confirm.require({
    message: 'Are you sure you want to retrieve all the questions saved to your Account?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Sync'
    },
    accept: async () => {
      await settings.downloadQuestions();
      toast.add({ severity: 'success', summary: 'Success', detail: 'Your questions have been retrieved from the cloud.', life: 3000 });
    }
  });
}
</script>

<template>
  <Toast></Toast>
  <ConfirmDialog style="margin: 0 auto; max-width: 90%;"></ConfirmDialog>

  <SplitButton icon="pi pi-user" dropdown-icon="pi pi-cloud" severity="primary" @click="visible = true" :model="items"
    text />
  <Dialog v-model:visible="visible" modal :header="settings.session ? 'Account Info' : 'Sign In'">
    <Account v-if="settings.session" :session="settings.session" />
    <Auth v-else />
  </Dialog>
</template>

<script setup>
import { supabase } from '../../plugins/supabaseClient'
import { onMounted, ref, toRefs } from 'vue'

const props = defineProps(['session'])
const { session } = toRefs(props)

const loading = ref(true)
const username = ref('')
const website = ref('')
const avatar_url = ref('')

onMounted(() => {
  getProfile()
})

async function getProfile() {
  try {
    loading.value = true
    const { user } = session.value

    const { data, error, status } = await supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()

    if (error && status !== 406) throw error

    if (data) {
      username.value = data.username
      website.value = data.website
      avatar_url.value = data.avatar_url
    }
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function updateProfile() {
  try {
    loading.value = true
    const { user } = session.value

    const updates = {
      id: user.id,
      username: username.value,
      website: website.value,
      avatar_url: avatar_url.value,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function signOut() {
  try {
    loading.value = true
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="form-widget" @submit.prevent="updateProfile">
    <div class="flex align-items-center justify-content-between gap-4 mb-4">
      <label for="email">Email</label>
      <InputText id="email" type="text" :value="session.user.email" disabled />
    </div>
    <div class="flex align-items-center justify-content-between gap-4 mb-4">
      <label for="username">Name</label>
      <InputText id="username" type="text" v-model="username" />
    </div>
    <div class="flex align-items-center justify-content-between gap-4 mb-6">
      <label for="website">Website</label>
      <InputText id="website" type="url" v-model="website" />
    </div>

    <div class="flex justify-content-end gap-2">
      <Button type="submit" :label="loading ? 'Loading ...' : 'Update'" :disabled="loading" />
      <Button @click="signOut" :disabled="loading">Sign Out</Button>
    </div>
  </form>
</template>
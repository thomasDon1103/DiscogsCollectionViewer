<template>
  <div class="user-list-container">
    <h2>Users</h2>
    <div v-if="loading" class="loading">Loading users...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="user-list">
      <div v-for="user in users" :key="user.id" class="user-item">
        <div class="user-info">
          <h3>{{ user.name }}</h3>
          <p>{{ user.email }}</p>
        </div>
        <div class="user-actions">
          <button @click="$emit('edit', user)">Edit</button>
          <button @click="$emit('delete', user.id)" class="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '../types/User';

defineProps<{
  users: User[];
  loading: boolean;
  error: string | null;
}>();

defineEmits<{
  edit: [user: User];
  delete: [id: number];
}>();
</script>

<style scoped>
.user-list-container {
  margin: 2em 0;
}

.loading {
  padding: 2em;
  color: #888;
}

.delete-btn {
  background-color: #ff6b6b;
}

.delete-btn:hover {
  background-color: #ff5252;
}
</style>
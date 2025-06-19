
<template>
  <div>
    <h1>Login Admin</h1>
    <input v-model="senha" type="password" placeholder="Senha" />
    <button @click="login">Entrar</button>
    <p v-if="erro" style="color:red">{{ erro }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const senha = ref('');
const erro = ref('');
const router = useRouter();

const login = async () => {
  try {
    await api.post('/admin/login', { senha: senha.value });
    localStorage.setItem('logado', 'true');
    router.push('/admin');
  } catch {
    erro.value = 'Senha incorreta.';
  }
};
</script>

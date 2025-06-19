<template>
  <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px;">
  <h1>Painel Administrativo</h1>
  <button @click="logout" style="background-color: #34495e;">Sair</button>
</div>
<div>
    <div class="grid">
      <div v-for="item in presentes" :key="item.id" class="card">
        <img :src="item.imagem" alt="Imagem" />
        <h3>{{ item.nome }}</h3>
        <p>{{ item.descricao }}</p>

        <p v-if="item.reservado">
          ✅ Reservado por: {{ item.reservado_por_nome }} ({{ item.reservado_por_email }})
        </p>
        <p v-else>Disponível</p>

        <button @click="excluir(item.id)">Excluir</button>

        <button 
          v-if="item.reservado" 
          @click="removerReserva(item.id)" 
          class="btn-cancelar">
          Remover Reserva
        </button>
      </div>
    </div>

    <div class="form">
      <h2>Adicionar Novo Presente</h2>
      <input v-model="novo.nome" placeholder="Nome do presente" />
      <input v-model="novo.descricao" placeholder="Descrição" />
      <input type="file" @change="uploadImagem" />
      <button @click="adicionar">Adicionar</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const presentes = ref([]);

const novo = ref({
  nome: '',
  descricao: '',
  imagem: ''
});

const carregar = async () => {
  const res = await api.get('/presentes');
  presentes.value = res.data;
};

const excluir = async (id) => {
  if (confirm('Tem certeza que deseja excluir?')) {
    await api.delete(`/admin/presentes/${id}`);
    carregar();
  }
};

const logout = () => {
  localStorage.removeItem('logado');
  router.push('/login');
};

const uploadImagem = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    novo.value.imagem = response.data.imageUrl;
    alert('Imagem enviada com sucesso!');
  } catch (error) {
    console.error('Erro no upload:', error);
    alert('Erro no upload da imagem.');
  }
};

const adicionar = async () => {
  if (!novo.value.nome || !novo.value.descricao || !novo.value.imagem) {
    alert('Preencha todos os campos!');
    return;
  }

  try {
    await api.post('/admin/presentes', {
      nome: novo.value.nome,
      descricao: novo.value.descricao,
      imagem: novo.value.imagem
    });
    alert('Presente adicionado com sucesso!');
    novo.value.nome = '';
    novo.value.descricao = '';
    novo.value.imagem = '';
    carregar();
  } catch (error) {
    alert('Erro ao adicionar presente.');
  }
};

const removerReserva = async (id) => {
  if (confirm('Tem certeza que deseja remover a reserva desse presente?')) {
    try {
      await api.post(`/admin/remover-reserva/${id}`);
      alert('Reserva removida com sucesso!');
      carregar();
    } catch (error) {
      alert('Erro ao remover reserva.');
      console.error(error);
    }
  }
};

onMounted(() => {
  if (localStorage.getItem('logado') !== 'true') {
    router.push('/login');
  } else {
    carregar();
  }
});
</script>

<style scoped>
body {
  background-color: #f5f5f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
}

h1 {
  text-align: center;
  color: #333;
  margin-top: 20px;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  width: 260px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
}

.card h3 {
  margin: 10px 0 5px;
}

.card p {
  text-align: center;
  color: #666;
}

button {
  padding: 8px 14px;
  margin-top: 6px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

button:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

button:active {
  transform: scale(0.98);
}

button:nth-of-type(1) {
  background-color: #e74c3c; /* Excluir */
}

.btn-cancelar {
  background-color: #f39c12; /* Remover reserva */
}

.form {
  background: white;
  padding: 20px;
  margin: 20px auto;
  border-radius: 12px;
  max-width: 600px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.form h2 {
  text-align: center;
  color: #333;
}

.form input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.form input:focus {
  outline: none;
  border-color: #4CAF50;
}

.form input[type="file"] {
  border: none;
}

.form button {
  background-color: #27ae60; /* Adicionar */
  width: 100%;
}

</style>

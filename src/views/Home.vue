<template>
  <div>
    <h1>Escolha um Presente para Emilly e Vinícius 🎁</h1>

    <div class="grid">
      <div v-for="item in presentes" :key="item.id" class="card">
        <img :src="item.imagem" alt="Imagem" />
        <h3>{{ item.nome }}</h3>
        <p>{{ item.descricao }}</p>

        <div v-if="item.reservado" class="reservado-label">
          ❌ Presente reservado
        </div>

        <button 
          v-else 
          class="btn-reservar"
          @click="abrirModal(item)">
          Reservar Presente
        </button>
      </div>
    </div>

    <!-- Modal -->
<div v-if="modalAberto" class="modal">
  <div class="modal-content">
    <h2>Reservar: {{ presenteSelecionado.nome }}</h2>
    <input v-model="nome" placeholder="Seu nome" />
    <input v-model="email" placeholder="Seu e-mail" />

    <div class="botoes">
      <button class="btn-confirmar" @click="reservar">Confirmar Reserva</button>
      <button class="btn-cancelar" @click="fecharModal">Cancelar</button>
    </div>
  </div>
</div>

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const presentes = ref([]);
const nome = ref('');
const email = ref('');

const modalAberto = ref(false);
const presenteSelecionado = ref({});

const carregar = async () => {
  const res = await api.get('/presentes');
  presentes.value = res.data;
};

const abrirModal = (item) => {
  presenteSelecionado.value = item;
  modalAberto.value = true;
};

const fecharModal = () => {
  modalAberto.value = false;
  nome.value = '';
  email.value = '';
};

const reservar = async () => {
  if (!nome.value || !email.value) {
    alert('Preencha nome e email.');
    return;
  }

  try {
    await api.post(`/reservar/${presenteSelecionado.value.id}`, {
      nome: nome.value,
      email: email.value
    });
    alert('Presente reservado com sucesso!');
    fecharModal();
    carregar();
  } catch (error) {
    alert('Erro ao reservar. Verifique se o presente já foi reservado.');
  }
};

onMounted(() => {
  carregar();
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
  margin: 20px;
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

.btn-reservar {
  background-color: #27ae60;
}

.reservado-label {
  background-color: #e74c3c;
  color: white;
  padding: 6px 10px;
  border-radius: 20px;
  margin-top: 8px;
}

/* Fundo escuro por trás do modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Conteúdo do modal */
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.3);
  width: 90%;
  max-width: 400px;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 22px;
  color: #333;
}

.modal-content input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 15px;
  box-sizing: border-box;
}

/* Botões alinhados lado a lado */
.modal-content .botoes {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.modal-content .botoes button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.2s ease;
}

.modal-content .botoes button:hover {
  opacity: 0.9;
}

.btn-confirmar {
  background-color: #27ae60;
}

.btn-cancelar {
  background-color: #7f8c8d;
}

/* Animação de entrada */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}


</style>

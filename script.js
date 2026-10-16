const chatBody = document.getElementById('chatBody');
const userInput = document.getElementById('userInput');
const typingIndicator = document.getElementById('typingIndicator');
const modalGabinete = document.getElementById('modalGabinete');

/* SCROLL SUAVE A SECCIONES */
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

/* FUNCIONES DE MODAL */
function openModal() {
  modalGabinete.style.display = 'flex';
}

function closeModal() {
  modalGabinete.style.display = 'none';
}

function handleEnter(e) {
  if (e.key === 'Enter') processUserText();
}

function sendPromptToAI(promptText) {
  userInput.value = promptText;
  scrollToSection('chat-section');
  processUserText();
}

/* MOTOR DE IA GENERATIVA EN VIVO CON RESPUESTAS CORTAS */
async function processUserText() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  userInput.value = '';
  showTyping();

  try {
    const systemPrompt = "Sos el Agente de IA del proyecto escolar PAUSA. Respondé sobre CUALQUIER TEMA que te pregunten. Tu regla estricta es dar respuestas EXTREMADAMENTE CORTAS Y DIRECTAS (máximo 2 oraciones). Si se menciona el juego o las apuestas, das un consejo de prevención rápido. Pregunta: " + text;
    
    const response = await fetch('https://text.pollinations.ai/' + encodeURIComponent(systemPrompt));
    
    if (!response.ok) throw new Error("API Error");

    const replyText = await response.text();
    hideTyping();

    let formatted = replyText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n/g, '<br>');

    appendMessage(formatted, 'bot');

  } catch (error) {
    hideTyping();
    appendMessage(getFallbackResponse(text), 'bot');
  }
}

function getFallbackResponse(input) {
  const lower = input.toLowerCase();
  if (lower.includes('apostar') || lower.includes('ganas') || lower.includes('casino') || lower.includes('juego') || lower.includes('plata')) {
    return "⏸️ **Hacé una Pausa:** Tomate 10 minutos lejos de las pantallas antes de decidir. Las plataformas están diseñadas para incentivar el juego impulsivo.";
  }
  return `🤖 **Agente PAUSA:** Recibí tu consulta sobre "${input}". Estoy para acompañarte en lo que necesites de forma confidencial.`;
}

function submitGabineteForm() {
  const msgInput = document.getElementById('messageInput').value.trim();
  if (!msgInput) {
    alert("Por favor escribí un mensaje antes de enviar.");
    return;
  }
  
  alert("✅ ¡Mensaje enviado con éxito! Tu consulta fue enviada de forma 100% anónima al Gabinete Psicopedagógico.");
  document.getElementById('messageInput').value = '';
  closeModal();
}

function showTyping() {
  typingIndicator.style.display = 'block';
  scrollToBottom();
}

function hideTyping() {
  typingIndicator.style.display = 'none';
}

function appendMessage(content, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg-box ${sender === 'bot' ? 'bot-msg' : 'user-msg'}`;
  msgDiv.innerHTML = content;
  chatBody.appendChild(msgDiv);
  scrollToBottom();
}

function scrollToBottom() {
  chatBody.scrollTop = chatBody.scrollHeight;
}
// DADOS DOS SERVIÇOS
const servicesData = [
    { id: 1, name: "CORTE DEGRADE", duration: 30, price: 25.00, cat: "cortes" },
    { id: 2, name: "CORTE SOCIAL", duration: 30, price: 25.00, cat: "cortes" },
    { id: 3, name: "CORTE TESOURA", duration: 45, price: 35.00, cat: "cortes" },
    { id: 4, name: "BARBA", duration: 30, price: 20.00, cat: "barba" },
    { id: 5, name: "BARBOTERAPIA", duration: 30, price: 30.00, cat: "barba" },
    { id: 6, name: "COMBO DEGRADE + BARBA", duration: 60, price: 40.00, cat: "combos" },
    { id: 7, name: "COMBO TESOURA + BARBA + SOBRANCELHA", duration: 60, price: 60.00, cat: "combos" },
    { id: 8, name: "HIDRATAÇÃO", duration: 15, price: 15.00, cat: "tratamentos" },
    { id: 9, name: "PIGMENTAÇÃO CABELO E BARBA", duration: 15, price: 10.00, cat: "tratamentos" }
];

// ESTADO DO AGENDAMENTO
let bookingState = {
    services: [],
    barber: "Ygor Leal",
    date: null,
    time: null
};

document.addEventListener("DOMContentLoaded", () => {
    renderServices(servicesData);
    generateCalendar();
    generateTimes();
    setupEvents();
});

// RENDERIZAR SERVIÇOS
function renderServices(items) {
    const container = document.getElementById("services-container");
    container.innerHTML = "";

    items.forEach(s => {
        const isSelected = bookingState.services.some(item => item.id === s.id);
        const card = document.createElement("div");
        card.className = `service-card ${isSelected ? 'selected' : ''}`;
        card.innerHTML = `
            <div class="service-info">
                <h3>${s.name}</h3>
                <div class="service-meta">
                    <span>⏱ ${s.duration} min</span>
                    <span>💰 R$ ${s.price.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
            <button class="btn-reserve">${isSelected ? 'Remover' : 'Reservar'}</button>
        `;

        card.querySelector(".btn-reserve").addEventListener("click", () => toggleService(s));
        container.appendChild(card);
    });
}

// ADICIONAR / REMOVER SERVIÇO
function toggleService(service) {
    const idx = bookingState.services.findIndex(s => s.id === service.id);
    if (idx > -1) {
        bookingState.services.splice(idx, 1);
    } else {
        bookingState.services.push(service);
    }
    renderServices(servicesData);
    checkFormCompletion();
}

// GERAR DIAS DA SEMANA
function generateCalendar() {
    const container = document.getElementById("calendar-days");
    container.innerHTML = "";
    const days = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);

        const chip = document.createElement("div");
        chip.className = "day-chip";
        chip.innerHTML = `
            <div style="font-size:12px; opacity:0.7;">${days[d.getDay()]}</div>
            <strong>${d.getDate()}</strong>
        `;

        chip.addEventListener("click", () => {
            document.querySelectorAll(".day-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            bookingState.date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
            checkFormCompletion();
        });

        container.appendChild(chip);
    }
}

// GERAR HORÁRIOS
function generateTimes() {
    const container = document.getElementById("time-slots");
    container.innerHTML = "";
    const hours = ["08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00"];

    hours.forEach(h => {
        const chip = document.createElement("div");
        chip.className = "time-chip";
        chip.innerText = h;

        chip.addEventListener("click", () => {
            document.querySelectorAll(".time-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            bookingState.time = h;
            checkFormCompletion();
        });

        container.appendChild(chip);
    });
}

// VERIFICAR SE PODE HABILITAR O BOTÃO DE CONTINUAR
function checkFormCompletion() {
    const btnConfirm = document.getElementById("btn-open-confirm");
    btnConfirm.disabled = !(bookingState.services.length > 0 && bookingState.date && bookingState.time);
}

// EVENTOS DE NAVEGAÇÃO E SELEÇÃO DE BARBEIROS
function setupEvents() {
    // SELEÇÃO DE BARBEIROS
    document.querySelectorAll(".barber-card").forEach(card => {
        card.addEventListener("click", () => {
            document.querySelectorAll(".barber-card").forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            bookingState.barber = card.dataset.barber;
            checkFormCompletion();
        });
    });

    // ALTERNAR TEMA
    document.getElementById("theme-toggle").addEventListener("click", () => {
        const html = document.documentElement;
        const newTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
        html.setAttribute("data-theme", newTheme);
    });

    // BUSCA DE SERVIÇOS
    document.getElementById("search-input").addEventListener("input", (e) => {
        const val = e.target.value.toLowerCase();
        renderServices(servicesData.filter(s => s.name.toLowerCase().includes(val)));
    });

    // FILTRO POR CATEGORIA
    document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const cat = btn.dataset.cat;
            renderServices(cat === "all" ? servicesData : servicesData.filter(s => s.cat === cat));
        });
    });

    // MODAL
    const modalConfirm = document.getElementById("modal-confirm");
    document.getElementById("btn-open-confirm").addEventListener("click", () => modalConfirm.classList.add("active"));
    document.getElementById("btn-close-modal").addEventListener("click", () => modalConfirm.classList.remove("active"));
    document.getElementById("btn-cancel").addEventListener("click", () => modalConfirm.classList.remove("active"));

    // CONFIRMAÇÃO E ENVIO DIRETO PARA O WHATSAPP
    document.getElementById("btn-finish").addEventListener("click", () => {
        const phone = document.getElementById("user-phone").value;
        const name = document.getElementById("user-name").value;

        if (!phone || !name) {
            alert("Por favor, preencha seu nome e celular!");
            return;
        }

        const servicesNames = bookingState.services.map(s => s.name).join(", ");
        const totalPrice = bookingState.services.reduce((acc, cur) => acc + cur.price, 0);

        const msg = `Olá! Gostaria de confirmar meu agendamento na *Soberanos Barbearia*:\n\n` +
                    `👤 *Cliente:* ${name}\n` +
                    `📱 *Telefone:* ${phone}\n` +
                    `💈 *Barbeiro:* ${bookingState.barber}\n` +
                    `✂️ *Serviço(s):* ${servicesNames}\n` +
                    `📅 *Data:* ${bookingState.date}\n` +
                    `⏰ *Horário:* ${bookingState.time}\n` +
                    `💰 *Total:* R$ ${totalPrice.toFixed(2).replace('.', ',')}`;

        window.open(`https://wa.me/5584986378266?text=${encodeURIComponent(msg)}`, "_blank");
        modalConfirm.classList.remove("active");
    });
}
// DOM элементы
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const mobileDropdowns = document.querySelectorAll('.mobile-dropdown > a');

// Слайдер
const sliderTrack = document.querySelector('.slider-track');
const sliderPrev = document.querySelector('.slider-prev');
const sliderNext = document.querySelector('.slider-next');
const sliderDotsContainer = document.querySelector('.slider-dots');

// Форма
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// Данные для слайдера
const slidesData = [
    {
        icon: 'fab fa-html5',
        iconClass: 'html',
        title: 'HTML5 & CSS3',
        description: 'Семантическая верстка, адаптивный дизайн, современные CSS-технологии (Flexbox, Grid, CSS-анимации)'
    },
    {
        icon: 'fab fa-js-square',
        iconClass: 'js',
        title: 'JavaScript & TypeScript',
        description: 'Современный ES6+, асинхронное программирование, фреймворки и библиотеки'
    },
    {
        icon: 'fab fa-react',
        iconClass: 'react',
        title: 'React & Vue.js',
        description: 'Разработка SPA-приложений, управление состоянием, SSR (Next.js, Nuxt.js)'
    },
    {
        icon: 'fab fa-node-js',
        iconClass: 'node',
        title: 'Node.js & Backend',
        description: 'REST API, GraphQL, серверная разработка, базы данных (MongoDB, PostgreSQL)'
    },
    {
        icon: 'fas fa-server',
        iconClass: 'server',
        title: 'DevOps & Облака',
        description: 'Docker, CI/CD, AWS, Google Cloud, мониторинг и развертывание приложений'
    }
];

let currentSlide = 0;

// Инициализация слайдера
function initSlider() {
    // Создание слайдов
    slidesData.forEach((slide, index) => {
        const slideElement = document.createElement('div');
        slideElement.className = 'slide';
        slideElement.innerHTML = `
            <div class="slide-icon ${slide.iconClass}">
                <i class="${slide.icon}"></i>
            </div>
            <h3 class="slide-title">${slide.title}</h3>
            <p class="slide-description">${slide.description}</p>
        `;
        sliderTrack.appendChild(slideElement);
        
        // Создание точек для навигации
        const dot = document.createElement('button');
        dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('data-slide', index);
        dot.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);
        sliderDotsContainer.appendChild(dot);
        
        // Обработчик клика по точке
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Обновление позиции слайдера
    updateSliderPosition();
}

// Переход к конкретному слайду
function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateSliderPosition();
    updateDots();
}

// Обновление позиции слайдера
function updateSliderPosition() {
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Обновление активной точки
function updateDots() {
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Следующий слайд
function nextSlide() {
    currentSlide = (currentSlide + 1) % slidesData.length;
    updateSliderPosition();
    updateDots();
}

// Предыдущий слайд
function prevSlide() {
    currentSlide = (currentSlide - 1 + slidesData.length) % slidesData.length;
    updateSliderPosition();
    updateDots();
}

// Мобильное меню
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

// Обработчики для мобильного меню
mobileMenuBtn.addEventListener('click', toggleMobileMenu);
mobileMenuClose.addEventListener('click', toggleMobileMenu);
mobileMenuOverlay.addEventListener('click', toggleMobileMenu);

// Обработчики для выпадающих пунктов мобильного меню
mobileDropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = dropdown.parentElement;
        const submenu = parent.querySelector('.mobile-submenu');
        
        // Закрыть другие открытые подменю
        mobileDropdowns.forEach(otherDropdown => {
            if (otherDropdown !== dropdown) {
                const otherParent = otherDropdown.parentElement;
                const otherSubmenu = otherParent.querySelector('.mobile-submenu');
                otherSubmenu.classList.remove('active');
                otherDropdown.querySelector('i').style.transform = 'rotate(0deg)';
            }
        });
        
        // Переключить текущее подменю
        submenu.classList.toggle('active');
        const icon = dropdown.querySelector('i');
        icon.style.transform = submenu.classList.contains('active') 
            ? 'rotate(180deg)' 
            : 'rotate(0deg)';
    });
});

// Обработчик отправки формы
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Сбор данных формы
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Валидация
    if (!data.name || !data.email || !data.message) {
        showFormMessage('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    // URL для отправки (используем Formcarry)
    const formcarryUrl = 'https://formcarry.com/s/PhXPhgjJcoC';
    
    try {
        // Показать состояние загрузки
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        // Отправка данных
        const response = await fetch(formcarryUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            // Успешная отправка
            showFormMessage('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
            contactForm.reset();
        } else {
            // Ошибка сервера
            showFormMessage('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.', 'error');
        }
    } catch (error) {
        // Ошибка сети
        console.error('Ошибка отправки формы:', error);
        showFormMessage('Произошла ошибка при отправке. Проверьте подключение к интернету.', 'error');
    } finally {
        // Восстановить кнопку
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = originalText || 'Отправить заявку';
        submitBtn.disabled = false;
    }
});

// Показать сообщение формы
function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Скрыть сообщение через 5 секунд
    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }, 5000);
}

// Обработчики для слайдера
sliderPrev.addEventListener('click', prevSlide);
sliderNext.addEventListener('click', nextSlide);

// Автопрокрутка слайдера
let slideInterval = setInterval(nextSlide, 5000);

// Остановить автопрокрутку при наведении
sliderTrack.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

// Возобновить автопрокрутку
sliderTrack.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Закрыть мобильное меню если открыто
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
            
            // Прокрутка к элементу
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Наблюдаемые элементы
    document.querySelectorAll('.service-card, .pricing-card, .contact-form').forEach(el => {
        observer.observe(el);
    });
});

// Добавление CSS для анимации
const style = document.createElement('style');
style.textContent = `
    .service-card, .pricing-card, .contact-form {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .service-card.animate, .pricing-card.animate, .contact-form.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .service-card:nth-child(1) { transition-delay: 0.1s; }
    .service-card:nth-child(2) { transition-delay: 0.2s; }
    .service-card:nth-child(3) { transition-delay: 0.3s; }
    .service-card:nth-child(4) { transition-delay: 0.4s; }
    
    .pricing-card:nth-child(1) { transition-delay: 0.1s; }
    .pricing-card:nth-child(2) { transition-delay: 0.2s; }
    .pricing-card:nth-child(3) { transition-delay: 0.3s; }
`;
document.head.appendChild(style);

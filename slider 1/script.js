// Класс для управления слайдером с изображениями
class ImageSlider {
    constructor() {
        this.slides = [
            {
                id: 1,
                title: 'Горный пейзаж',
                description: 'Величественные горы на закате',
                image: './mountains.jpg',
                color: 'slide-1'
            },
            {
                id: 2,
                title: 'Океанские волны',
                description: 'Кристально чистая вода океана',
                image: './ocean.jpg',
                color: 'slide-2'
            },
            {
                id: 3,
                title: 'Лесная тропа',
                description: 'Тайная тропа через зеленый лес',
                image: './forest.jpg',
                color: 'slide-3'
            },
            {
                id: 4,
                title: 'Городские огни',
                description: 'Ночной город в огнях',
                image: './city.jpg',
                color: 'slide-4'
            },
            {
                id: 5,
                title: 'Пустынный закат',
                description: 'Бескрайние пески под заходящим солнцем',
                image: './desert.jpg',
                color: 'slide-5'
            }
        ];
        
        this.currentSlide = 0;
        this.isAnimating = false;
        this.animationDuration = 600;
        this.imagesLoaded = 0;
        
        this.initializeElements();
        this.createSlides();
        this.bindEvents();
        this.updateIndicator();
    }

    // Инициализация DOM элементов
    initializeElements() {
        this.slider = document.getElementById('slider');
        this.slideIndicator = document.getElementById('slideIndicator');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('dotsContainer');
    }

    // Создание слайдов
    createSlides() {
        // Добавляение клона последнего слайда в начало и клона первого слайда в конец
        const slidesHTML = [
            this.createSlideHTML(this.slides[this.slides.length - 1], -1),
            ...this.slides.map((slide, index) => this.createSlideHTML(slide, index)),
            this.createSlideHTML(this.slides[0], this.slides.length)
        ].join('');

        this.slider.innerHTML = slidesHTML;
        
        // Создание точки-индикаторы
        this.createDots();
        
        // Устанавка начальной позицию
        this.goToSlide(1, false);
        
        // Предзагрузка изображений
        this.preloadImages();
    }

    // Создание HTML для слайда
    createSlideHTML(slide, index) {
        return `
            <div class="slide ${slide.color}" data-index="${index}">
                <img 
                    src="${slide.image}" 
                    alt="${slide.title}" 
                    class="slide-image"
                    onerror="this.style.display='none'; this.parentNode.innerHTML += '<div style=\'color: white; text-align: center; padding: 20px;\'>Изображение не загружено</div>'"
                >
                <div class="slide-content">
                    <div class="slide-title">${slide.title}</div>
                    <div class="slide-description">${slide.description}</div>
                    
                </div>
            </div>
        `;
    }

    // Предзагрузка изображений
    preloadImages() {
        this.slides.forEach(slide => {
            const img = new Image();
            img.src = slide.image;
            img.onerror = () => {
                console.error(`Не удалось загрузить изображение: ${slide.image}`);
            };
        });
    }

   
    createDots() {
        this.dotsContainer.innerHTML = this.slides.map((_, index) => 
            `<div class="dot" data-index="${index}" aria-label="Перейти к изображению ${index + 1}"></div>`
        ).join('');
        
        this.dots = this.dotsContainer.querySelectorAll('.dot');
        this.dots[0].classList.add('active');
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        this.dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('dot')) {
                const targetIndex = parseInt(e.target.dataset.index);
                this.goToSlide(targetIndex + 1);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        this.setupTouchEvents();
    }

    setupTouchEvents() {
        let startX = 0;
        let endX = 0;

        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
        };

        const handleTouchEnd = (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        };

        this.slider.addEventListener('touchstart', handleTouchStart, { passive: true });
        this.slider.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    handleSwipe(startX, endX) {
        const diff = startX - endX;
        const swipeThreshold = 50;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }

    nextSlide() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentSlide++;
        
        this.slider.style.transition = `transform ${this.animationDuration}ms ease`;
        this.slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        this.handleSlideChange();
    }

    previousSlide() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentSlide--;
        
        this.slider.style.transition = `transform ${this.animationDuration}ms ease`;
        this.slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        this.handleSlideChange();
    }

    goToSlide(index, animate = true) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentSlide = index;
        
        if (animate) {
            this.slider.style.transition = `transform ${this.animationDuration}ms ease`;
        } else {
            this.slider.style.transition = 'none';
        }
        
        this.slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        this.handleSlideChange(!animate);
    }

    handleSlideChange(instant = false) {
        if (instant) {
            this.finalizeSlideChange();
        } else {
            setTimeout(() => {
                this.finalizeSlideChange();
            }, this.animationDuration);
        }
    }

    finalizeSlideChange() {
        if (this.currentSlide === 0) {
            this.slider.style.transition = 'none';
            this.currentSlide = this.slides.length;
            this.slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        } else if (this.currentSlide === this.slides.length + 1) {
            this.slider.style.transition = 'none';
            this.currentSlide = 1;
            this.slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }

        this.updateIndicator();
        this.isAnimating = false;
    }

    updateIndicator() {
        const realIndex = this.getRealSlideIndex();
        const currentSlide = this.slides[realIndex];
        
        this.slideIndicator.textContent = `Изображение ${realIndex + 1} из ${this.slides.length}`;
        this.slideIndicator.setAttribute('aria-label', `Текущее изображение: ${currentSlide.title}`);
        
        if (this.dots) {
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === realIndex);
                dot.setAttribute('aria-current', index === realIndex ? 'true' : 'false');
            });
        }
    }

    getRealSlideIndex() {
        if (this.currentSlide === 0) {
            return this.slides.length - 1;
        } else if (this.currentSlide === this.slides.length + 1) {
            return 0;
        } else {
            return this.currentSlide - 1;
        }
    }
}

// Инициализация слайдера
document.addEventListener('DOMContentLoaded', () => {
    new ImageSlider();
});
# Top Music Production — Сайт продюсерского центра

## Структура
```
garvishensky/
├── index.html              # Главная страница
├── pages/
│   └── services.html       # Страница услуг
├── assets/
│   ├── css/
│   │   ├── main.css        # Стили главной страницы
│   │   └── services.css    # Стили страницы услуг
│   ├── js/
│   │   ├── main.js         # JS главной страницы
│   │   └── services.js     # JS страницы услуг
│   ├── media/
│   │   ├── video/
│   │   │   └── studio.mp4  # Видео для блока "О нас"
│   │   └── images/
│   │       ├── lola.jpg    # Логотип артиста LOLA
│   │       └── andraw.jpg  # Логотип артиста ANDRAW
│   └── icons/
│       └── logo.svg        # SVG логотип Top Music Production
└── .vscode/
    ├── settings.json       # Настройки VS Code
    └── extensions.json     # Рекомендуемые расширения
```

## Запуск в VS Code
1. Открой папку `garvishensky/` в VS Code
2. Установи расширение **Live Server** (появится в рекомендациях)
3. Нажми **Go Live** внизу справа
4. Сайт откроется на http://localhost:5500

## Правка контента

### Артисты в тикере
Файл: `assets/css/main.css` или прямо в `index.html`
Чтобы добавить PNG логотип:
```html
<div class="t-item"><img src="assets/media/images/artist.jpg" alt="ARTIST"></div>
```

### Имена артистов (bento-сетка)
В `index.html` найди `.bc-name` — замени «АРТИСТ 1» на реальное имя

### Треки
В `index.html` найди `<!-- TRACKS -->` — замени названия и исполнителей

### Контакты
В `index.html` найди `<!-- CONTACT -->` — замени email и Telegram

### Цвета
В `assets/css/main.css` строка `:root` — здесь все переменные цветов
- `--red: #e63232` — акцентный красный
- `--bg: #111` — цвет фона
- `--w: #f0ede6` — основной белый

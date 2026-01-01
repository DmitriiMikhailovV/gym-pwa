# PWA Setup Instructions

Поздравляю! Ваш проект настроен как Progressive Web App.
Однако, для полноценной работы (особенно на iOS), вам нужно добавить файлы иконок в папку `public/`.

## Необходимые файлы иконок
Пожалуйста, сгенерируйте иконки (например, через сервисы типа [RealFaviconGenerator](https://realfavicongenerator.net/)) и положите их в папку `public/`:

1. `pwa-192x192.png` - Ikonka 192x192
2. `pwa-512x512.png` - Ikonka 512x512
3. `apple-touch-icon.png` - Ikonka 180x180 (для iPhone)
4. `favicon.ico` - Фавиконка (уже есть, но можно обновить)

## Как проверить PWA
1. Запустите проект: `npm run dev`
2. Откройте в браузере.
3. В Chrome DevTools -> Application -> Manifest вы должны увидеть ваши настройки.
4. В Service Workers вы должны увидеть активный воркер (после сборки `npm run build` и `npm run preview`). 
   *Примечание: В режиме `dev` сервис-воркеры могут не работать по умолчанию без специальной настройки, поэтому лучше проверять через `build` + `preview`.*

## Структура
- `vite.config.js`: Конфигурация PWA плагина.
- `index.html`: Мета-теги для мобильных устройств.

// Telegram WebApp API - відправка події при відкритті
(function() {
  let retryCount = 0;
  const maxRetries = 50; // Максимум 5 секунд (50 * 100ms)
  
  // Функція для перевірки та ініціалізації
  function initTelegramWebApp() {
    // Перевіряємо чи доступний Telegram WebApp API
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Ініціалізуємо WebApp
      tg.ready();
      console.log('Telegram WebApp ініціалізовано');
      
      // Відправляємо подію про відкриття міні-додатку
      function sendActivityEvent(eventType) {
        try {
          const data = JSON.stringify({
            type: eventType,
            timestamp: new Date().toISOString()
          });
          console.log('Відправка події:', eventType, data);
          tg.sendData(data);
          console.log('Подію відправлено успішно');
        } catch (error) {
          console.error('Помилка відправки даних:', error);
        }
      }
      
      // Чекаємо на готовність WebApp перед відправкою
      tg.onEvent('viewportChanged', function() {
        console.log('WebApp готовий, відправляємо подію відкриття');
        sendActivityEvent('mini_app_opened');
      });
      
      // Також відправляємо при завантаженні сторінки
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          setTimeout(function() {
            sendActivityEvent('mini_app_opened');
          }, 500);
        });
      } else {
        setTimeout(function() {
          sendActivityEvent('mini_app_opened');
        }, 500);
      }
      
      // Відстежуємо видимість сторінки
      document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
          console.log('Сторінка стала видимою, відправляємо подію');
          sendActivityEvent('mini_app_visible');
        }
      });
      
      // Відправляємо подію при будь-якій взаємодії
      document.addEventListener('click', function() {
        sendActivityEvent('mini_app_interaction');
      }, { once: false });
      
    } else {
      // Якщо API не доступний - чекаємо трохи і пробуємо ще раз
      retryCount++;
      if (retryCount < maxRetries) {
        console.log('Telegram WebApp API ще не завантажений, чекаємо... (спроба ' + retryCount + '/' + maxRetries + ')');
        setTimeout(initTelegramWebApp, 100);
      } else {
        console.warn('Telegram WebApp API не доступний після ' + maxRetries + ' спроб');
      }
    }
  }
  
  // Запускаємо перевірку
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTelegramWebApp);
  } else {
    initTelegramWebApp();
  }
})();
// Telegram WebApp API - відправка події при відкритті
// Перевіряємо чи працюємо в Telegram WebApp
if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp;
  
  // Ініціалізуємо WebApp
  tg.ready();
  
  // Відправляємо подію про відкриття міні-додатку
  function sendActivityEvent(eventType) {
    try {
      const data = JSON.stringify({
        type: eventType,
        timestamp: new Date().toISOString()
      });
      tg.sendData(data);
    } catch (error) {
      console.error('Помилка відправки даних:', error);
    }
  }
  
  // Відправляємо подію при відкритті
  sendActivityEvent('mini_app_opened');
  
  // Відстежуємо видимість сторінки (коли користувач повертається до міні-додатку)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      sendActivityEvent('mini_app_visible');
    }
  });
}
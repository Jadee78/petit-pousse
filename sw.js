const CACHE = 'petit-pousse-v1';

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(list => {
    if (list.length) return list[0].focus();
    return clients.openWindow('/petit-pousse/');
  }));
});

// Vérification des rappels toutes les heures
self.addEventListener('periodicsync', e => {
  if (e.tag === 'check-reminders') e.waitUntil(checkReminders());
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'CHECK_REMINDERS') checkReminders();
});

async function checkReminders() {
  const allClients = await clients.matchAll();
  allClients.forEach(c => c.postMessage({ type: 'SW_CHECK' }));
}

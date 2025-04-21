(function() {
    const API_URL = '/api';
  
    document.addEventListener('DOMContentLoaded', async () => {
      // 1) Leer `id` de la query string
      const params = new URLSearchParams(window.location.search);
      const id     = params.get('id');
      if (!id) return window.location.href = 'appointments.html';
  
      // 2) Cargar datos de la cita existente
      const token = sessionStorage.getItem('token');
      const res   = await fetch(`${API_URL}/appointments/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const appt  = await res.json();
      if (!res.ok) {
        alert(appt.message);
        return window.location.href = 'appointments.html';
      }
  
      // 3) Rellenar el formulario
      document.getElementById('appointmentType').value  = appt.type;
      document.getElementById('appointmentDate').value  = appt.date.slice(0,16);
      document.getElementById('appointmentNotes').value = appt.notes || '';
  
      // 4) Manejar el envío para hacer PUT
      document.getElementById('appointmentForm')
        .addEventListener('submit', async e => {
          e.preventDefault();
          const type  = document.getElementById('appointmentType').value;
          const date  = document.getElementById('appointmentDate').value;
          const notes = document.getElementById('appointmentNotes').value;
  
          const resp = await fetch(`${API_URL}/appointments/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ type, date, notes })
          });
          const data = await resp.json();
          if (!resp.ok) {
            alert(data.message);
          } else {
            window.location.href = 'success.html?action=update';
          }
        });
    });
  })();
  
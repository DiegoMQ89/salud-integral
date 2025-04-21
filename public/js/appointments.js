(function() {
    const API_URL = '/api';
  
    document.addEventListener('DOMContentLoaded', function() {
      const appointmentsList    = document.getElementById('appointmentsList');
      const appointmentsMessage = document.getElementById('appointmentsMessage');
      const appointmentForm     = document.getElementById('appointmentForm');
      const appointmentMessage  = document.getElementById('appointmentMessage');
  
      checkAuth();
  
      if (appointmentsList) loadAppointments();
      if (appointmentForm) appointmentForm.addEventListener('submit', handleAppointmentSubmit);
  
      function checkAuth() {
        const token = sessionStorage.getItem('token');
        if (!token) window.location.href = 'login.html';
      }
  
      async function loadAppointments() {
        try {
          const token = sessionStorage.getItem('token');
          const res   = await fetch(`${API_URL}/appointments`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
  
          if (data.length === 0) {
            appointmentsList.innerHTML = '<p>No tienes citas programadas.</p>';
            return;
          }
          renderAppointments(data);
        } catch (err) {
          showMessage(appointmentsMessage, err.message, 'error');
        }
      }
  
      function renderAppointments(appointments) {
        appointmentsList.innerHTML = '';
        appointments.forEach(appointment => {
          const dt = new Date(appointment.date);
          const formattedDate = dt.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          const type   = appointment.type === 'medicina_general'
                           ? 'Medicina General'
                           : 'Odontología';
          const status = appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1);
  
          const card = document.createElement('div');
          card.className = 'appointment-card';
          card.innerHTML = `
            <h3>${type}</h3>
            <p><strong>Fecha:</strong> ${formattedDate}</p>
            <p><strong>Estado:</strong>
              <span class="status ${appointment.status}">${status}</span>
            </p>
            ${appointment.notes ? `<p><strong>Notas:</strong> ${appointment.notes}</p>` : ''}
            <div class="appointment-actions">
              <button class="btn primary" onclick="editAppointment('${appointment.id}')">
                Editar
              </button>
              <button class="btn secondary" onclick="cancelAppointment('${appointment.id}')">
                Cancelar
              </button>
            </div>
          `;
          appointmentsList.appendChild(card);
        });
      }
  
      async function handleAppointmentSubmit(e) {
        e.preventDefault();
        const type  = document.getElementById('appointmentType').value;
        const date  = document.getElementById('appointmentDate').value;
        const notes = document.getElementById('appointmentNotes').value;
  
        try {
          const token = sessionStorage.getItem('token');
          const res   = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ type, date, notes })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          window.location.href = 'success.html?action=create';
        } catch (err) {
          showMessage(appointmentMessage, err.message, 'error');
        }
      }
  
      function showMessage(el, msg, type) {
        el.textContent = msg;
        el.className   = `message ${type}`;
      }
    });
  
    // Exponer al global las funciones que usa el HTML en buttons
    window.editAppointment   = function(id) {
      // Aquí podrías redirigir a edit-appointment.html?id=...
      window.location.href = `edit-appointment.html?id=${id}`;
    };
    window.cancelAppointment = async function(id) {
      try {
        if (!confirm('¿Deseas cancelar esta cita?')) return;
        const token = sessionStorage.getItem('token');
        const res   = await fetch(`/api/appointments/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        window.location.href = 'success.html?action=cancel';
      } catch (err) {
        alert(err.message);
      }
    };
  })();
  

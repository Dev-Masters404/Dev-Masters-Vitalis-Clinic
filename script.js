document.addEventListener('DOMContentLoaded', () => {

  // ===== Mobile menu toggle (all pages) =====
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // ===== Shared doctors data =====
  const doctorsData = {
    cardiology:  [{ id: 'ahmed-mostafa', name: 'Dr. Ahmed Mostafa' }],
    dental:      [{ id: 'nourhan-samir', name: 'Dr. Nourhan Samir' }],
    neurology:   [{ id: 'omar-adel',     name: 'Dr. Omar Adel' }],
    orthopedics: [{ id: 'karim-mansour', name: 'Dr. Karim Mansour' }],
    pediatrics:  [{ id: 'sara-youssef',  name: 'Dr. Sara Youssef' }],
    dermatology: [{ id: 'laila-hassan',  name: 'Dr. Laila Hassan' }]
  };

  // ===== Doctors page: filter by department =====
  const filterBar = document.getElementById('filterBar');
  const doctorGrid = document.getElementById('doctorGrid');
  if (filterBar && doctorGrid) {
    const filterButtons = filterBar.querySelectorAll('.filter-btn');
    const doctorCards = doctorGrid.querySelectorAll('.doctor-full-card');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        doctorCards.forEach(card => {
          if (filter === 'all' || card.dataset.department === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Pre-filter if arriving from departments.html?dept=xxx
    const urlDept = new URLSearchParams(window.location.search).get('dept');
    if (urlDept) {
      const matchingBtn = filterBar.querySelector(`[data-filter="${urlDept}"]`);
      if (matchingBtn) matchingBtn.click();
    }
  }

  // ===== Booking page =====
  const deptSelect = document.getElementById('deptSelect');
  const doctorSelect = document.getElementById('doctorSelect');
  const timeSlots = document.getElementById('timeSlots');
  const bookingForm = document.getElementById('bookingForm');

  if (deptSelect && doctorSelect) {
    deptSelect.addEventListener('change', () => {
      const dept = deptSelect.value;
      const doctors = doctorsData[dept] || [];

      doctorSelect.innerHTML = '<option value="" disabled selected>Select a doctor</option>';
      doctors.forEach(doc => {
        const opt = document.createElement('option');
        opt.value = doc.id;
        opt.textContent = doc.name;
        doctorSelect.appendChild(opt);
      });
      doctorSelect.disabled = false;
    });

    // Pre-fill from doctors.html?doctor=xxx&dept=xxx
    const params = new URLSearchParams(window.location.search);
    const urlDept = params.get('dept');
    const urlDoctor = params.get('doctor');
    if (urlDept) {
      deptSelect.value = urlDept;
      deptSelect.dispatchEvent(new Event('change'));
      if (urlDoctor) {
        setTimeout(() => { doctorSelect.value = urlDoctor; }, 0);
      }
    }
  }

  if (timeSlots) {
    const slots = timeSlots.querySelectorAll('.time-slot');
    slots.forEach(slot => {
      slot.addEventListener('click', () => {
        slots.forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
      });
    });
  }

  if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const deptLabel = deptSelect.options[deptSelect.selectedIndex]?.text || '';
    const doctor = doctorSelect.options[doctorSelect.selectedIndex]?.text || '';
    const date = document.getElementById('apptDate').value;
    const selectedSlot = timeSlots.querySelector('.time-slot.selected');
    const time = selectedSlot ? selectedSlot.textContent : 'Not selected';
    const name = document.getElementById('patientName').value;
    const age = document.getElementById('patientAge').value;
    const phone = document.getElementById('patientPhone').value;

    const scriptURL = 'https://script.google.com/macros/s/AKfycbzM-6MOi04lU5zhD8DK44fqnmNjZ1Op6Nd89Msc8accj7GxtSzXUsYUSP1ol9l8a8hj/exec';

    fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ department: deptLabel, doctor, date, time, name, age, phone })
    });

    const confirmation = document.getElementById('bookingConfirmation');
    const details = document.getElementById('confirmationDetails');

    details.textContent = `${name}, your appointment with ${doctor} (${deptLabel}) is set for ${date} at ${time}.`;
    bookingForm.style.display = 'none';
    confirmation.style.display = 'block';
  });
}

  // ===== Contact page form =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.reset();
      document.getElementById('contactSuccess').style.display = 'block';
    });
  }

});
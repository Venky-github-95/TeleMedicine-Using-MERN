const fs = require('fs');

const specialties = ['Cardiologist', 'Orthopedic', 'Pediatrician', 'Dermatologist', 'Neurologist', 'Gynecologist', 'ENT', 'General Physician', 'Psychiatrist', 'Oncologist'];
const doctors = [];

for (let i = 1; i <= 50; i++) {
  const specialty = specialties[Math.floor(Math.random() * specialties.length)];
  const available = Math.random() > 0.3; // 70% available
  doctors.push({
    name: `Dr. Test Doctor ${i}`,
    specialty,
    available,
    availableTime: available ? `${9 + (i % 5)}:00 AM - ${12 + (i % 5)}:00 PM` : null,
    nextAvailableDate: available ? null : `2025-05-${15 + (i % 10)} ${(10 + (i % 4))}:00 AM - ${(1 + (i % 4))}:00 PM`
  });
}

fs.writeFileSync('doctors_generated.json', JSON.stringify(doctors, null, 2));
console.log('✅ doctors_generated.json file created!');

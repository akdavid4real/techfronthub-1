
async function createInstructor() {
  const res = await fetch('http://localhost:3000/api/instructors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'instructor@techfronthub.ng',
      password: 'Instructor123!',
      name: 'Main Instructor'
    })
  });
  
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Data:', JSON.stringify(data, null, 2));
}

createInstructor();

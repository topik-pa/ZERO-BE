console.log('login');

const form = document.forms[0];
form.addEventListener('submit', formSubmit);

async function formSubmit(event) {
  event.preventDefault();
  const data = {
    email: document.querySelector('input[type="text"]').value,
    password: document.querySelector('input[type="password"]').value
  };
  try {
    const response = await fetch('/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    if(response.status === 200) {
      document.location = '/';
    }
    document.querySelector('.errors').innerHTML = '<b>' + data.email + '</b>';
  } catch (error) {
    document.querySelector('.errors').innerText = 'Something wrong';
  }
}
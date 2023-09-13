import { io } from 'socket.io-client'

const API_URL = 'http://localhost:8080'

let socket = undefined

let token = ''

async function loginDesktop(data) {
  const response = await fetch(API_URL + '/api/auth/login-desktop', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });

  return response.json();
}

async function logoutDesktop() {
  const response = await fetch(API_URL + '/api/auth/logout-desktop', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  return response.json();
}

async function postPrint() {
  const data = {
    invoices: [
      {
        "invoice_uuid": "ef16dad6-b5f0-4161-8f93-03c5c255ab27",
        "is_billing": true, // boolean
        "is_do": true // boolean
      }
    ]
  }

  const response = await fetch(API_URL + '/api/print', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return response.json();
}

const formLogin = document.getElementById('form')
formLogin.addEventListener('submit', async (event) => {
  event.preventDefault()
  const formData = new FormData(event.target);
  const formProps = Object.fromEntries(formData);

  const loginResponse = await loginDesktop(formProps)

  socket = io(API_URL, {
    query: {
      role_id: loginResponse.data.user.role_id,
      uuid: loginResponse.data.user.uuid,
      login_type: 2
    }
  })

  socket.on('notification', () => {
    console.log('Notif masuk');
  })

  // disable these socket listener line below if you wanted to reproduce
  // negative case 
  socket.on('print-invoice', (data, callback) => {
    console.log('Print Invoice');
    callback({ isReceived: true })
  })

  token = loginResponse.data.user.token
  alert('berhasil')
})

document.getElementById('printButton')
printButton.addEventListener('click', async (event) => {
  const printResponse = await postPrint()
  alert(printResponse.body.message)
})

document.getElementById('logoutButton')
logoutButton.addEventListener('click', async (event) => {
  const logoutResponse = await logoutDesktop()
  alert(logoutResponse.body.message)
})
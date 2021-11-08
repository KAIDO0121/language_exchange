import axios from 'axios'

const userRequest = axios.create({
  baseURL: 'http://localhost:1337',
  headers: { 'Content-Type': 'application/json' },
})

export const userLogin = data => userRequest.post('/api/login', data)
export const registerUser = data => userRequest.post('/api/login', data)
export const getAllLang = () => userRequest.get('/api/getAllLang')
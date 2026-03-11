import axios from 'axios';

const BASE = 'http://localhost:5000/api';  //use http not https

const api = axios.create({
  baseURL: BASE,
});

// (Master)
export const getAllConfigs = () =>
  api.get('/config').then(r => r.data);

export const getAllTypes=()=>
  api.get('/config/types/all').then(r => r.data);

export const getConfigByType = (applicationType) =>
  api.get(`/config/${applicationType}`).then(r => r.data);

export const updateConfig = (applicationType, documents) =>
  api.put(`/config/${applicationType}`, { documents }).then(r => r.data);

export const createType      = (type)       => api.post('/config/create', { applicationType: type }).then(r => r.data);
export const deleteType      = (type)       => api.delete(`/config/${type}`).then(r => r.data);

// export const createType= (type)=> 
//   api.post('/config/create', { applicationType: type }).then(r => r.data);

// export const deleteType= (type)=> 
//   api.delete(`/config/${type}`).then(r => r.data);

// (User)
// export const uploadDocuments = (formData) =>
//   api.post('/documents/upload', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   }).then(r => r.data);

// export const getAllSubmissions = () =>
//   api.get('/documents').then(r => r.data);

export const uploadDocuments  = (formData)  => api.post('/documents/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
}).then(r => r.data);

export const getAllSubmissions = ()          => api.get('/documents').then(r => r.data);
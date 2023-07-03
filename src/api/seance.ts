import { defaultHeaders } from './api.js'
import $fetch from './refreshToken.js'

export async function getCreneauSeances(id_creneau: number, page = 1): Promise<Seance[]> {
  const api_url = import.meta.env.VITE_API_URL
  const url = new URL(`${api_url}/api/creneau/${id_creneau}/reservations`)
  url.searchParams.append('page', page.toString());

  const response = await $fetch(url.toString(), {
    method: 'get',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
  if (response.status !== 200) throw response
  return response.json()
}

export async function postSeance(contract: SeanceEditContract): Promise<SeanceEditResponse> {
  const api_url = import.meta.env.VITE_API_URL;
  const url = new URL(`${api_url}/api/seances`);
  
  const response = await $fetch(url.toString(), {
    method: 'post',
    body: JSON.stringify(contract),
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  })

  if(response.status !== 201) throw response;
  return response.json();
}

export async function putSeance(seance_id: number, contract: SeanceEditContract): Promise<Seance> {
  const api_url = import.meta.env.VITE_API_URL;
  const url = new URL(`${api_url}/api/seances/${seance_id}`);
  
  const response = await $fetch(url.toString(), {
    method: 'put',
    body: JSON.stringify(contract),
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  })

  if(response.status !== 200) throw response;
  return response.json();
}

export async function deleteSeance(seance_id: number): Promise<void> {
  const api_url = import.meta.env.VITE_API_URL;
  const url = new URL(`${api_url}/api/reservations/${seance_id}`);
  const response = await $fetch(url.toString(), {
    method: 'delete',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  })

  if(response.status !== 204) throw response;
  return;
}

export async function getQRCode(seance_id: number): Promise<QRCodeResponse> {
  const api_url = import.meta.env.VITE_API_URL;
  const url = new URL(`${api_url}/api/qrcode/seance/${seance_id}`);
  const response = await $fetch(url.toString(), {
    method: 'get',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  })

  if(response.status !== 200) throw response;
  return response.json();
}

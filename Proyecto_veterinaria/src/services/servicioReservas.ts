import type { Reserva } from '../types';
import { ejecutarApi, solicitarApi } from './clienteApi';

const API_PATH = '/api/reservas';

export type NuevaReserva = Omit<Reserva, 'id'>;

export const obtenerReservas = async (): Promise<Reserva[]> => {
  return solicitarApi<Reserva[]>(API_PATH);
};

export const obtenerReservasCliente = async (email: string): Promise<Reserva[]> => {
  return solicitarApi<Reserva[]>(`${API_PATH}/cliente/${encodeURIComponent(email)}`);
};

export const crearReserva = async (reserva: NuevaReserva): Promise<Reserva> => {
  return solicitarApi<Reserva>(API_PATH, {
    method: 'POST',
    body: JSON.stringify(reserva),
  });
};

export const cambiarEstadoReserva = async (id: number, estado: string): Promise<Reserva> => {
  const query = new URLSearchParams({ estado });
  return solicitarApi<Reserva>(`${API_PATH}/${id}/estado?${query.toString()}`, { method: 'PATCH' });
};

export const eliminarReserva = async (id: number): Promise<void> => {
  await ejecutarApi(`${API_PATH}/${id}`, { method: 'DELETE' });
};
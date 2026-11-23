import type { Reserva } from '../types';

const API_URL = 'http://localhost:8084/api/reservas';

export const obtenerReservas = async (): Promise<Reserva[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener las reservas');
  return res.json();
};

export const crearReserva = async (reserva: Reserva): Promise<Reserva> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reserva),
  });
  if (!res.ok) throw new Error('Error al registrar la reserva');
  return res.json();
};

export const cambiarEstadoReserva = async (id: number, estado: string): Promise<Reserva> => {
  const res = await fetch(`${API_URL}/${id}/estado?estado=${estado}`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Error al cambiar estado');
  return res.json();
};

export const eliminarReserva = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar la reserva');
};
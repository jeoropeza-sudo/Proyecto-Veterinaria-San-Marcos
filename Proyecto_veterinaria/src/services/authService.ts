import type { SessionUser } from '../types/auth';

const SESSION_STORAGE_KEY = 'veterinaria.session';

const demoAccounts: Array<{ email: string; password: string; user: SessionUser }> = [
  {
    email: 'admin@sanmarcos.cl',
    password: 'admin1234',
    user: {
      run: '11.111.111-1',
      nombre: 'Alexis',
      apellidos: 'Administrador',
      correo: 'admin@sanmarcos.cl',
      rol: 'Administrador',
      region: 'O’Higgins',
      comuna: 'Rancagua',
      direccion: '',
    },
  },
  {
    email: 'cliente@sanmarcos.cl',
    password: 'cliente1234',
    user: {
      run: '22.222.222-2',
      nombre: 'Cliente',
      apellidos: 'Demostración',
      correo: 'cliente@sanmarcos.cl',
      rol: 'Cliente',
      region: 'O’Higgins',
      comuna: 'Rancagua',
      direccion: '',
    },
  },
];

function isSessionUser(value: unknown): value is SessionUser {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.run === 'string' &&
    typeof user.nombre === 'string' &&
    typeof user.apellidos === 'string' &&
    typeof user.correo === 'string' &&
    (user.rol === 'Administrador' || user.rol === 'Cliente') &&
    typeof user.region === 'string' &&
    typeof user.comuna === 'string' &&
    typeof user.direccion === 'string' &&
    !('password' in user)
  );
}

export function getStoredSession(): SessionUser | null {
  const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (storedSession === null) {
    return null;
  }

  let parsedSession: unknown;
  try {
    parsedSession = JSON.parse(storedSession);
  } catch {
    throw new Error('La sesión guardada está dañada. Limpia los datos del sitio e inténtalo nuevamente.');
  }

  if (!isSessionUser(parsedSession)) {
    throw new Error('La sesión guardada no tiene un formato válido. Limpia los datos del sitio e inténtalo nuevamente.');
  }

  return parsedSession;
}

export function authenticate(email: string, password: string): SessionUser | null {
  const normalizedEmail = email.trim().toLocaleLowerCase();
  const account = demoAccounts.find(
    (candidate) =>
      candidate.email === normalizedEmail &&
      candidate.password === password,
  );

  return account?.user ?? null;
}

export function saveSession(user: SessionUser): void {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

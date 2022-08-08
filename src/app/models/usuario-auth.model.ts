import { VistaModel } from './vista.model';
export class UsuarioAuthModel{
  id: number
  usuario: string
  password: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  correo: string;
  token: string;
  ultimoAcceso: string;
  idRol: number;
  rol: string;
  vistas: VistaModel[];
  expiredTime: any;
}

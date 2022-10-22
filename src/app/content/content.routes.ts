import { Routes } from '@angular/router';
import { CategoriasComponent } from '../pages/categorias/categorias.component';
import { ComprasComponent } from '../pages/compras/compras.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { InformesComponent } from '../pages/informes/informes.component';
import { InventarioComponent } from '../pages/inventario/inventario.component';
import { ProveedoresComponent } from '../pages/proveedores/proveedores.component';
import { SolicitudesComponent } from '../pages/solicitudes/solicitudes.component';
import { TallasComponent } from '../pages/tallas/tallas.component';
import { UbicacionesComponent } from '../pages/ubicaciones/ubicaciones.component';
import { VentasComponent } from '../pages/ventas/ventas.component';
import { MiPerfilComponent } from '../pages/mi-perfil/mi-perfil.component';
import { UsuariosComponent } from '../pages/usuarios/usuarios.component';
import { RolesComponent } from '../pages/roles/roles.component';
import { MaterialesComponent } from '../pages/materiales/materiales.component';
import { CambiosYDevolucionesComponent } from '../pages/cambios-y-devoluciones/cambios-y-devoluciones.component';

export const contentRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'inventory', component: InventarioComponent },
    { path: 'shopping', component: ComprasComponent },
    { path: 'returns', component: CambiosYDevolucionesComponent },
    { path: 'sales', component: VentasComponent },
    { path: 'request', component: SolicitudesComponent },
    { path: 'reports', component: InformesComponent},
    { path: 'locations', component: UbicacionesComponent },
    { path: 'categories', component: CategoriasComponent },
    { path: 'materials', component: MaterialesComponent },
    { path: 'providers', component: ProveedoresComponent },
    { path: 'sizes', component: TallasComponent },
    { path: 'my-profile', component: MiPerfilComponent },
    { path: 'users', component: UsuariosComponent },
    { path: 'roles', component:  RolesComponent},
    {
        path: '**',
        redirectTo: 'dashboard'
    }


];

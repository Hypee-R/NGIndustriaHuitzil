import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContentComponent } from '../content/content.component';
import { SharedModule } from '../shared/shared.module';
import { ContentRoutingModule } from '../content/content-routing.module';


import { DashboardComponent } from './dashboard/dashboard.component';
import { InventarioComponent } from './inventario/inventario.component';
import { ComprasComponent } from './compras/compras.component';
import { VentasComponent } from './ventas/ventas.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { InformesComponent } from './informes/informes.component';
import { UbicacionesComponent } from './ubicaciones/ubicaciones.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { TallasComponent } from './tallas/tallas.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RolesComponent } from './roles/roles.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ContentRoutingModule,
        // StoreModule.forFeature('viewUsers', usersReducer),
    ],
    declarations: [
        ContentComponent,
        DashboardComponent,
        InventarioComponent,
        ComprasComponent,
        VentasComponent,
        SolicitudesComponent,
        InformesComponent,
        UbicacionesComponent,
        CategoriasComponent,
        ProveedoresComponent,
        TallasComponent,
        MiPerfilComponent,
        UsuariosComponent,
        RolesComponent,
    ]
})
export class PagesModule { }

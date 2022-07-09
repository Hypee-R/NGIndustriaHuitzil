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


//PrimeNG
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';

import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { AddUsuarioComponent } from './usuarios/add-usuario/add-usuario.component';
import { AddProveedorComponent } from './proveedores/add-proveedor/add-proveedor.component';
import { AddTallaComponent } from './tallas/add-talla/add-talla.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ContentRoutingModule,
        // StoreModule.forFeature('viewUsers', usersReducer),
        //PrimeNG
        ToastModule,
        CardModule,
        DropdownModule,
        SplitButtonModule,
        SidebarModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        TableModule,
        CalendarModule,
        SliderModule,
        DialogModule,
        MultiSelectModule,
        ContextMenuModule,
        DropdownModule,
        ButtonModule,
        ToastModule,
        InputTextModule,
        ProgressBarModule,
        FileUploadModule,
        ToolbarModule,
        RatingModule,
        FormsModule,
        RadioButtonModule,
        InputNumberModule,
        ConfirmDialogModule,
        InputTextareaModule,
],  providers: [ConfirmationService],
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
        AddUsuarioComponent,
        AddProveedorComponent,
        AddTallaComponent,
    ]
})
export class PagesModule { }

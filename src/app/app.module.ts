import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroUsuariosScreenComponent } from './screens/registro-usuarios-screen/registro-usuarios-screen.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { RegistroAlumnosComponent } from './partials/registro-alumnos/registro-alumnos.component';
import { RegistroMaestrosComponent } from './partials/registro-maestros/registro-maestros.component';
import { RegistroAdminComponent } from './partials/registro-admin/registro-admin.component';


//angular material
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

//ngx-cookies-services
import { CookieService } from 'ngx-cookie-service';

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    RegistroUsuariosScreenComponent,
    DashboardLayoutComponent,
    AuthLayoutComponent,
    RegistroAlumnosComponent,
    RegistroMaestrosComponent,
    RegistroAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    MatRadioModule
    ,MatFormFieldModule
    ,MatInputModule,
    NgxMaskDirective,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  providers: [
    CookieService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'  },
    provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

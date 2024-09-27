import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BottombarComponent } from './components/bottombar/bottombar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AnticiposComponent } from './components/anticipos/anticipos.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { HelpComponent } from './components/help/help.component';
import { NodatosComponent } from './components/nodatos/nodatos.component';
import { PopupComponent } from './components/popup/popup.component';
import { CalificacionComponent } from './components/calificacion/calificacion.component';
import { IngresoComponent } from './components/ingreso/ingreso.component';
import { CombustibleComponent } from './components/combustible/combustible.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    BottombarComponent,
    TopbarComponent,
    LoaderComponent,
    AnticiposComponent,
    GastosComponent,
    HelpComponent,
    NodatosComponent,
    PopupComponent,
    CalificacionComponent,
    IngresoComponent,
    CombustibleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

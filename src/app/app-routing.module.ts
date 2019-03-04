import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubsystemListComponent } from './subsystem-list/subsystem-list.component';
import { SubsystemComponent } from './subsystem/subsystem.component';

const routes: Routes = [
  { path: '', component: SubsystemListComponent },
  // Redirecting old catalogue app links
  { path: ':instance/wsdls', redirectTo: '/:instance', pathMatch: 'full' },
  { path: ':instance', component: SubsystemListComponent },
  { path: ':instance/:class/:member/:subsystem', component: SubsystemComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
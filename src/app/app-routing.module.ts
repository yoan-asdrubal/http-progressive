import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SideNavComponent} from "./side-nav/side-nav.component";
import {UserContainerComponent} from "./components/user-container/user-container.component";
import {UserContainerSyncedComponent} from "./components/user-container-synced/user-container-synced.component";

const routes: Routes = [
  {
    path: '',
    component: SideNavComponent,
    children: [
      {
        path: 'user',
        component: UserContainerComponent
      }, {
        path: 'user-synced',
        component: UserContainerSyncedComponent
      }, {
        path: '**', redirectTo: 'user'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

import { Component } from '@angular/core';

import { HomePage } from '../home/home'
import { ChoresPage } from '../chores/chores';
import { RemindersPage } from '../reminders/reminders';
import { GroceriesPage } from '../groceries/groceries';
import { MorePage } from '../more/more';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ChoresPage;
  tab3Root = RemindersPage;
  tab4Root = GroceriesPage;
  tab5Root = MorePage;

  constructor() {

  }
}

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {FormControl} from "@angular/forms";
import {UserService} from "../../service/user.service";
import {UserData} from "../../service/user-model";
import {debounceTime, distinctUntilChanged, Subject, Subscription, takeUntil} from "rxjs";


/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

@Component({
  selector: 'app-user-container',
  templateUrl: './user-container-synced.component.html',
  styleUrls: ['./user-container-synced.component.scss']
})
export class UserContainerSyncedComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'progress', 'fruit'];
  // @ts-ignore
  dataSource: MatTableDataSource<UserData>;
  data: UserData[] = [];
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator | null;
  @ViewChild(MatSort) sort: MatSort | undefined;

  sizeGenerator = new FormControl(100);
  // @ts-ignore
  subscription: Subscription;
  syncProgress: any = 0;

  unsubscribe = new Subject();
  filterControl = new FormControl('');
  constructor(private userService: UserService) {

  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.unsubscribe.next(true);

  }

  ngOnInit(): void {
    this.syncData();

    this.filterControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300),
        takeUntil(this.unsubscribe.asObservable())
      )
      .subscribe((value) => {
        this.dataSource.filter = value.trim().toLowerCase();
      })
  }

  syncData() {
    const subscrption = this.userService.getUserData()
      .subscribe((data) => {
        // @ts-ignore
        this.data = data;
        this.dataSource = new MatTableDataSource(this.data);
        this.linkPaginator();
        subscrption?.unsubscribe();
      })
  }

  linkPaginator() {
    // @ts-ignore
    this.dataSource?.paginator = this.paginator;
    // @ts-ignore
    this.dataSource?.sort = this.sort;
  }

  ngAfterViewInit() {
    // @ts-ignore
    this.linkPaginator();
  }

}


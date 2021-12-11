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
  templateUrl: './user-container.component.html',
  styleUrls: ['./user-container.component.scss']
})
export class UserContainerComponent implements OnInit, OnDestroy {
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
    this.generate(false);
    this.linkPaginator();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.unsubscribe.next(true);
  }

  ngOnInit(): void {
    this.subscription = this.userService
      .progress$
      .pipe(
        takeUntil(this.unsubscribe.asObservable())
      )
      .subscribe((value) => {
        this.syncProgress = value
      })

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

  linkPaginator() {
    // @ts-ignore
    this.dataSource.paginator = this.paginator;
    // @ts-ignore
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    // @ts-ignore
    this.linkPaginator();
  }

  generate(confirmation = true) {
    if (!!confirmation) {
      const result = confirm(`Esta Seguro que quiere generar ${this.sizeGenerator.value} elementos`);
      if (!result)
        return;
    }
    this.data = Array.from({length: this.sizeGenerator.value}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data);
    this.linkPaginator();
  }

  save() {
    alert('Si no ha generado nuevos usuarios no funcionara la sincrinizacion por el campo id repetido');
    const result = confirm(`Esta Seguro que quiere guardar ${this.sizeGenerator.value} elementos`);
    if (!result)
      return;
    this.userService.syncProgressive(this.data)
  }
}

function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: name + '-' + Math.round(Math.random() * 10000),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
  };
}

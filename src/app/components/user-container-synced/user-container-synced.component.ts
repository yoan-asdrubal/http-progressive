import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {FormControl} from "@angular/forms";
import {UserService} from "../../service/user.service";
import {UserData} from "../../service/user-model";
import {debounceTime, distinctUntilChanged, Subject, Subscription, takeUntil} from "rxjs";
import * as ExcelProper from 'exceljs';


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

  exportExcelDatosFiltrados() {
    this.exportExcel(this.dataSource.filteredData, 'DATA SYNCED FILTERED')
  }

  exportExcelTodosLosDatos() {
    this.exportExcel(this.data)
  }

  exportExcel(dataToExport: any[], name = 'DATA SYNCED') {
    const workbook: ExcelProper.Workbook = new ExcelProper.Workbook();
    workbook.creator = 'Web';
    workbook.lastModifiedBy = 'Web';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.addWorksheet('DATA', {
      views: [
        {
          activeCell: 'A1',
          showGridLines: true
        }
      ]
    });

    const data = dataToExport.map((item: any) => (
      [
        item.id,
        item.name,
        item.progress,
        item.fruit
      ]
    ));

    const sheet = workbook.worksheets[0];
    sheet.views = [
      {state: 'frozen', xSplit: 0, ySplit: 1}
    ];

    sheet.columns = [
      {
        key: 'id',
        width: 20,
        header: 'Id'
      },
      {
        key: 'name',
        width: 30,
        header: 'Name'
      }, {
        key: 'progress',
        width: 20,
        header: 'Progress'
      }, {
        key: 'fruit',
        width: 20,
        header: 'Fruit'
      }
    ]
    sheet.addRows(data);

    sheet.getColumnKey('id')
      .eachCell((cell: ExcelProper.Cell, rowNumber: number) => {
        cell.alignment = {horizontal: 'center'};
        cell.protection = {
          locked: false
        };
      });
    sheet.getColumnKey('progress')
      .eachCell((cell: ExcelProper.Cell, rowNumber: number) => {
        cell.alignment = {horizontal: 'center'};
      });

    const headerMovimientos: ExcelProper.Row = sheet.getRow(1);
    headerMovimientos.eachCell((cell) => {
      cell.alignment = {
        horizontal: 'center'
      };
      cell.font = {
        name: 'Arial Black',
        color: {argb: '000000'},
        family: 2,
        size: 12,
        italic: true
      };
      cell.border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
      // cell.font = {
      // 	bold: true
      // };
    });
    workbook.xlsx.writeBuffer().then(dataw => {
      const blob = new Blob([dataw], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
      let fileN = '';

      fileN = `${name}.xlsx`;

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileN;
      anchor.click();
      setTimeout(function () {
        window.URL.revokeObjectURL(url);
      }, 0);
    });
  }
}


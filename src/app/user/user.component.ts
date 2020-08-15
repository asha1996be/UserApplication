import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UserService } from './user.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  userList: any = [];
  noUserData: boolean = false;
  errMessage: boolean = false;
  pieChartData = [];
  mediaQuery$: Subscription;
  activeMediaQuery: string;
  columnDefinitions: any = [];
  userPercentage: any = 0;
  piOptions: any = {};
  geo: any = [];
  graphOptions = {
    series: [],
    chart: {
      height: 250,
      type: '',
      dataLabels: {
        enabled: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [],
    title: {
      text: '',
      style: {
        fontSize: '15px',
        fontWeight: 'bold',
        fontFamily: undefined,
        color: '#263238',
      },
    },
    xaxis: {
      categories: [],
      title: {
        text: '',
        style: {
          fontWeight: 100,
          fontSize: '14px',
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      title: {
        text: '',
        style: {
          fontWeight: 100,
          fontSize: '15px',
        },
      },
    },
    fill: {
      colors: ['#06B79A', '#4272F5'],
    },
    legend: {
      show: true,
    },
    tooltip: {
      enabled: true,
      onDatasetHover: {
        highlightDataSeries: true,
      },
      marker: {
        show: false,
      },
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5,
      },
    },
  };

  constructor(private userService: UserService, private mediaObserver: MediaObserver) {}

  ngOnInit() {
    this.mediaQuery$ = this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = `${change.mqAlias}`;
      if (this.activeMediaQuery === 'xs') {
        this.columnDefinitions = [
          { def: 'id', label: '', hide: false },
          { def: 'name', label: '', hide: false },
          { def: 'username', label: '', hide: true },
          { def: 'city', label: '', hide: true },
          { def: 'pincode', label: '', hide: true },
          { def: 'company', label: '', hide: false },
        ];
      } else {
        this.columnDefinitions = [
          { def: 'id', label: '', hide: false },
          { def: 'name', label: '', hide: false },
          { def: 'username', label: '', hide: false },
          { def: 'city', label: '', hide: false },
          { def: 'pincode', label: '', hide: false },
          { def: 'company', label: '', hide: false },
        ];
      }
    });
    this.getUsers();
    this.getGraphOptions();
  }


  getUsers() {
    this.userService.getUserList().subscribe((res: any) => {
      if (res.length > 0) {
        this.userList = new MatTableDataSource < any > (res);
        this.userList.paginator = this.paginator;
        this.userList.sort = this.sort;
        res.forEach(element => {
          this.geo.push(element.address.geo);
        });
        let latGZero = this.geo.filter(a => a.lat > 0);
        let latLZero = this.geo.filter(a => a.lat < 0);
        let lngGZero = this.geo.filter(a => a.lng > 0);
        let lngLZero = this.geo.filter(a => a.lng < 0);
        this.pieChartData = [{
            "name": "Latitude > 0 ",
            "value": latGZero.length
          },
          {
            "name": "Latitude < 0 ",
            "value": latLZero.length
          },
          {
            "name": "Longitude > 0 ",
            "value": lngGZero.length
          },
          {
            "name": "Longitude < 0 ",
            "value": lngLZero.length
          }
        ];
        this.userPercentage = (10 / 100) * 100;
        this.piOptions.series = this.pieChartData.map(x => x.value);
        this.piOptions.labels = this.pieChartData.map(x => x.name);
      } else {
        this.noUserData = true;
      }
    }, (err) => {
      this.errMessage = true;
    });
  }
  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  getGraphOptions() {
    this.piOptions = this.graphOptions;
    this.piOptions.chart.type = 'pie';
    this.piOptions.colors = ['#991010', '#ff3184', '#fbd56c', '#AAAAAA'];
    this.piOptions.title.text = '';
  }
}

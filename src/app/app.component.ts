import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { DataService } from './core/data.service';
import { Subscription } from 'rxjs/Subscription';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatListModule, MatListItem } from '@angular/material/list';

export class Quoteprice {
  public Symbol: String;
  public Price: Number;
  public PriceB: Number;
  public LTP: Number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

  selectedRow: Number;
  setClickedRow: Function;

  stockQuote: number;
  sub: Subscription;
  quoteprices: Quoteprice[] = []
  dataSource = new MatTableDataSource();

  constructor(private dataService: DataService, private changeDetector: ChangeDetectorRef, private ngZone: NgZone) { }

  ngOnInit() {

    this.sub = this.dataService.getQuotes()

      .subscribe(quote => {
        this.changeDetector.detach();
        var obj = JSON.parse(quote);
        const result = this.quoteprices.find(qt => qt.Symbol === obj.symbol);
        if (result) {
          var q = new Quoteprice;

          q.PriceB = obj.price_buy;
          q.Price = obj.price_sell;
          q.LTP = obj.LTP;
          q.Symbol = obj.symbol;

          result.PriceB = obj.price_buy;
          result.Price = obj.price_sell;
          result.LTP = obj.LTP;
          result.Symbol = obj.symbol;

          const idx = this.quoteprices.indexOf(result);
          this.quoteprices.splice(idx, 1);
          this.quoteprices.splice(idx, 0, q);
          var tmp = this.quoteprices;
          this.quoteprices = [];
          this.quoteprices = tmp;
          this.changeDetector.detectChanges();
        } else {

          var q = new Quoteprice;
          q.PriceB = obj.price_buy;
          q.Price = obj.price_sell;
          q.LTP = obj.LTP;
          q.Symbol = obj.symbol;
          this.quoteprices.unshift(q);
          this.changeDetector.detectChanges();
        }

      });

    this.setClickedRow = function (index) {
      this.selectedRow = index;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  go(quote) {
    console.log("quote: " + quote.Symbol + ":" + quote.Price);
  }
}


import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import KeenAnalysis from 'keen-analysis';
import { PurchaseGeneratorService } from './services/purchase-generator.service';
import { ChartService } from './services/chart.service';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private purchaseGeneratorService: PurchaseGeneratorService,
    private chartService: ChartService) {}
  ngOnInit() {
    this.chartService.initLinearChart();
    this.purchaseGeneratorService.createPurchases();
    this.getTheAverageCostByGenderFromKeenio();
    this.setTimeIntervalToGetDataFromKeenio(5000);
  }
  clientAnalysis = new KeenAnalysis({
    projectId: environment.keenioClient.projectId,
    readKey: environment.keenioClient.readKey
  });
  averageReport = [];
  getTheAverageCostByGenderFromKeenio() {
    let dateNow = new Date();
    let startDate = new Date(dateNow.getTime() - 20000);
    let endDate = new Date(dateNow.getTime() - 20000 + 5000);
    const averageByGender = new KeenAnalysis.Query("average", {
      event_collection: "purchases",
      filters: [
        {
            "operator": "gte",
            "property_name": "keen.timestamp",
            "property_value": startDate.toISOString()
        },
        {
            "operator":"lt",
            "property_name": "keen.timestamp",
            "property_value": endDate.toISOString()
        }
      ],
      group_by: ["customer.gender"],
      target_property: "cost"
   });
    
    this.clientAnalysis.run(averageByGender, (err, response) => {
      // console.log('err & response', err, response.result)
      if (response.result.length > 0) {
        response.result.map(element => {
          this.averageReport.push(element);
        });
        this.populateMaleAndFemaleData();
      }
    });
  }
  populateMaleAndFemaleData() {
    let maleData: Array<any> = [];
    let femaleData: Array<any> = [];
    this.averageReport
      .forEach(
        (x, i) => {
          if (x["customer.gender"] === 'Female') {
            femaleData.push(
              {
                x: new Date(new Date().setMinutes(0, i)),
                y: x.result
              })
          }
          if (x["customer.gender"] === 'Male') {
            maleData.push(
              {
                x: new Date(new Date().setMinutes(0, i)),
                y: x.result
              })
          }
        }
      )
      this.chartService.initLinearChart(maleData, femaleData);
  }
  setTimeIntervalToGetDataFromKeenio(seconds) {
    setInterval( () => {
      this.getTheAverageCostByGenderFromKeenio()
    }, seconds)
  }
 
}

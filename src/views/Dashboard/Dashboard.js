import React, { useState, useEffect, useContext } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import Datetime from "react-datetime";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

import {
  GetApp,
  People,
  ExitToApp,
  Money,
  BarChart,
  Timeline,
  MultilineChart
} from "@material-ui/icons";
import {

  colouredLineChart,
  multipleBarsChart,
  colouredLinesChart

} from "variables/charts.js";
import DateRange from "@material-ui/icons/DateRange";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { FetchContext } from "variables/authFetch";
import { useSnackbar } from 'notistack';
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
var Chartist = require("chartist");

const useStyles = makeStyles(styles);
const to = new Date();
const from = new Date();
from.setDate(from.getDate() - 6);
const dateRanges = [];
for (let i = 0; i < 7; i++) {
  const current = new Date(from);
  current.setDate(current.getDate() + i);
  dateRanges.push((current.getMonth() + 1) + "/" + current.getDate() + "/" + current.getFullYear());
}
var delays = 80,
  durations = 500;
var delays2 = 80,
  durations2 = 500;
export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState('');
  const [totalVisits, setTotalVisits] = useState('');
  const [totalRevenue, setTotalRevenue] = useState('');
  const [totalRewards, setTotalRewards] = useState('');
  const [fromRevenue, setFromRevenue] = useState(from);  
  const [toRevenue, setToRevenue] = useState(to);
  const [fromToss, setFromToss] = useState(from);
  const [toToss, setToToss] = useState(to);
  const [fromVisit, setFromVisit] = useState(from);
  const [toVisit, setToVisit] = useState(to);
  const [fromRW, setFromRW] = useState(from);
  const [toRW, setToRW] = useState(to);
  const [revenues, setRevenues] = useState({
    data: {
      labels: dateRanges,
      series: [[]]
    },
    options: {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      axisY: {
        showGrid: true,
        offset: 100
      },
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 10,
      showPoint: true,
      height: "300px"
    },
    animation: {
      draw: function (data) {
        if (data.type === "line" || data.type === "area") {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path
                .clone()
                .scale(1, 0)
                .translate(0, data.chartRect.height())
                .stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if (data.type === "point") {
          data.element.animate({
            opacity: {
              begin: (data.index + 1) * delays,
              dur: durations,
              from: 0,
              to: 1,
              easing: "ease"
            }
          });
        }
      }
    }
  });


  const [toss, setToss] = useState({
    data: {
      labels: dateRanges,
      series: [[]]
    },
    options: {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      axisY: {
        showGrid: true,
        offset: 100
      },
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 10,
      showPoint: true,
      height: "300px"
    },
    animation: {
      draw: function (data) {
        if (data.type === "line" || data.type === "area") {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path
                .clone()
                .scale(1, 0)
                .translate(0, data.chartRect.height())
                .stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if (data.type === "point") {
          data.element.animate({
            opacity: {
              begin: (data.index + 1) * delays,
              dur: durations,
              from: 0,
              to: 1,
              easing: "ease"
            }
          });
        }
      }
    }
  });
  const [visits, setVisits] = useState({
    data: {
      labels: dateRanges,
      series: [
        [],
        []
      ]
    },
    options: {
      seriesBarDistance: 10,
      axisX: {
        showGrid: false
      },
      height: "300px"
    },
    responsiveOptions: [
      [
        "screen and (max-width: 640px)",
        {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function(value) {
              return value[0];
            }
          }
        }
      ]
    ],
    animation: {
      draw: function(data) {
        if (data.type === "bar") {
          data.element.animate({
            opacity: {
              begin: (data.index + 1) * delays2,
              dur: durations2,
              from: 0,
              to: 1,
              easing: "ease"
            }
          });
        }
      }
    }
  });
  const [rws, setRWS] = useState({
    data: {
      labels:dateRanges,
      series: [
        [],
        []
      ]
    },
    options: {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      axisY: {
        showGrid: true,
        offset: 40
      },
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 1000,
      showPoint: true,
      height: "300px"
    },
    animation: {
      draw: function(data) {
        if (data.type === "line" || data.type === "area") {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path
                .clone()
                .scale(1, 0)
                .translate(0, data.chartRect.height())
                .stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if (data.type === "point") {
          data.element.animate({
            opacity: {
              begin: (data.index + 1) * delays,
              dur: durations,
              from: 0,
              to: 1,
              easing: "ease"
            }
          });
        }
      }
    }
  });
  const [revenuesDown, setRevenuesDown] = useState('');
  const [tossDown, setTossDown] = useState('');
  const [visitsDown, setVisitsDown] = useState('');
  const [rwsDown, setRWSDown] = useState('');
  const { authAxios } = React.useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const catchFunc = (err) => {
    if (err.response) {
      enqueueSnackbar(err.response.data.message, { variant: 'danger' });

    } else if (err.request) {
      enqueueSnackbar("Server is not responding", { variant: 'danger' });
      // client never received a response, or request never left
    } else {
      // anything else
      enqueueSnackbar("Server is not working", { variant: 'danger' });
    }
  };
  const downRevenue = async () => {
    const element = document.createElement("a");
    const file = new Blob([revenuesDown], { type: 'application/text' });
    element.href = URL.createObjectURL(file);
    element.download = "Revenues.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };
  const downToss = async () => {
    const element = document.createElement("a");
    const file = new Blob([tossDown], { type: 'application/text' });
    element.href = URL.createObjectURL(file);
    element.download = "Toss.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };
  const downVisits=async ()=>{
    const element = document.createElement("a");
    const file = new Blob([visitsDown], { type: 'application/text' });
    element.href = URL.createObjectURL(file);
    element.download = "Visits.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }
  const downRWS=async ()=>{
    const element = document.createElement("a");
    const file = new Blob([rwsDown], { type: 'application/text' });
    element.href = URL.createObjectURL(file);
    element.download = "RWS.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }
  useEffect(() => {
    (async () => {
      try {
        const { data } = await authAxios.get("/admin/total");
        if (data) {
          setTotalUsers(data.users);
          setTotalVisits(data.visits);
          setTotalRevenue(data.revenue);
          setTotalRewards(data.rewards);
        }
      } catch (err) {
        catchFunc(err);
      }
    })();
  }, []);
  useEffect(() => {
    // if(typeof(fromRevenue))
    let fromDate = (new Date(fromRevenue));
    const fromD = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1) + "-" + fromDate.getDate();
    let toDate = new Date(toRevenue);
    const toD = toDate.getFullYear() + "-" + (toDate.getMonth() + 1) + "-" + toDate.getDate();
    const dateRanges = [];
    const dates = Math.ceil((toDate - fromDate) / (3600000 * 24));
    for (let i = 0; i <= dates; i++) {
      const current = new Date(fromDate);
      current.setDate(current.getDate() + i);
      dateRanges.push((current.getMonth() + 1) + "/" + current.getDate() + "/" + current.getFullYear());
    }
    (async () => {
      try {
        const { data } = await authAxios.get(`/admin/revenues/${fromD}/${toD}`);
        if (data) {
          const low = Math.min(...data);
          const high = Math.max(...data);
          await setRevenues({
            ...revenues,
            data: {
              labels: dateRanges,
              series: [data]
            },
            options: {
              ...revenues.options,
              low, high
            }
          });
          let content = `Revenue History\n`;
          content += `Date\t Revenue\n`;
          for (let i = 0; i < data.length; i++) {
            const current = new Date(fromDate);
            current.setDate(current.getDate() + i);
            content += (current.getMonth() + 1) + "/" + current.getDate() + "/" + current.getFullYear() + "\t" + data[i];
            content += "\n";
          }
          setRevenuesDown(content);
        }
        
      } catch (err) {
        catchFunc(err);
      }
    })();
  }, [fromRevenue, toRevenue]);

  useEffect(() => {
    // if(typeof(fromRevenue))
    let fromDate = (new Date(fromToss));
    const fromD = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1) + "-" + fromDate.getDate();
    let toDate = new Date(toToss);
    const toD = toDate.getFullYear() + "-" + (toDate.getMonth() + 1) + "-" + toDate.getDate();
    const dateRanges = [];
    const dates = Math.ceil((toDate - fromDate) / (3600000 * 24));
    for (let i = 0; i <= dates; i++) {
      const current = new Date(fromDate);
      current.setDate(current.getDate() + i);
      dateRanges.push((current.getMonth() + 1) + "/" + current.getDate() + "/" + current.getFullYear());
    }
    (async () => {
      try {
        const { data } = await authAxios.get(`/admin/revenues1/${fromD}/${toD}`);
        if (data) {
          const low = Math.min(...data);
          const high = Math.max(...data);
          await setToss({
            ...toss,
            data: {
              labels: dateRanges,
              series: [data]
            },
            options: {
              ...toss.options,
              low, high
            }
          });
          let content = `Toss History\n`;
          content += `Date\t Toss\n`;
          for (let i = 0; i < data.length; i++) {
            const current = new Date(fromDate);
            current.setDate(current.getDate() + i);
            content += (current.getMonth() + 1) + "/" + current.getDate() + "/" + current.getFullYear() + "\t" + data[i];
            content += "\n";
          }
          setTossDown(content);
        }
        
      } catch (err) {
        catchFunc(err);
      }
    })();
  }, [fromRevenue, toRevenue]);
  useEffect(() => {
    let fromDate = (new Date(fromVisit));
    const fromD = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1) + "-" + fromDate.getDate();
    let toDate = new Date(toVisit);
    const toD = toDate.getFullYear() + "-" + (toDate.getMonth() + 1) + "-" + toDate.getDate();
    const dateRanges = [];
    const dates = Math.ceil((toDate - fromDate) / (3600000 * 24));
    for (let i = 0; i <= dates; i++) {
      const current = new Date(fromDate);
      current.setDate(current.getDate() + i);
      dateRanges.push((current.getMonth() + 1) + "/" + current.getDate() + "/" + current.getFullYear());
    }
    (async () => {
      try {
        const { data } = await authAxios.get(`/admin/visits/${fromD}/${toD}`);
        if (data) {
          const low = Math.min(...data.visits, ...data.users);
          const high = Math.max(...data.visits, ...data.users);
          setVisits({
            ...visits,
            data: {
              labels: dateRanges,
              series: [data.visits, data.users]
            },
            options: {
              ...visits.options,
              low, high
            }
          });
          let content = `Visits/New joiners History\n`;
          content += `Date\t Visits\t New Joiner\n`;
          for (let i = 0; i <= dates; i++) {
            const current = new Date(fromDate);
            current.setDate(current.getDate() + i);
            content += (current.getMonth() + 1) + "/" + current.getDate() + "/" + current.getFullYear() + "\t" + data.visits[i]+ "\t" + data.users[i];
            content += "\n";
          }
          setVisitsDown(content);
        }
      } catch (err) {
        catchFunc(err);
      }
    })();
  }, [fromVisit, toVisit]);
  useEffect(() => {
    let fromDate = (new Date(fromRW));
    const fromD = fromDate.getFullYear() + "-" + (fromDate.getMonth() + 1) + "-" + fromDate.getDate();
    let toDate = new Date(toRW);
    const toD = toDate.getFullYear() + "-" + (toDate.getMonth() + 1) + "-" + toDate.getDate();
    const dateRanges = [];
    const dates = Math.ceil((toDate - fromDate) / (3600000 * 24));
    for (let i = 0; i <= dates; i++) {
      const current = new Date(fromDate);
      current.setDate(current.getDate() + i);
      dateRanges.push((current.getMonth() + 1) + "/" + current.getDate() + "/" + current.getFullYear());
    }
    (async () => {
      try {
        const { data } = await authAxios.get(`/admin/rws/${fromD}/${toD}`);
        if (data) {
          const low = Math.min( ...data.recharges, ...data.withdrawals);
          const high = Math.max( ...data.recharges, ...data.withdrawals);
          setRWS({
            ...rws,
            data: {
              labels: dateRanges,
              series: [data.recharges, data.withdrawals]
            },
            options: {
              ...visits.options,
              low, high
            }
          });
          let content = ` Recharges / Withdrawals History\n`;
          content += `Date\t Recharges\t Withdrawals\n`;
          for (let i = 0; i <= dates; i++) {
            const current = new Date(fromDate);
            current.setDate(current.getDate() + i);
            content += (current.getMonth() + 1) + "/" + current.getDate() + "/" + current.getFullYear() + "\t" + data.recharges[i]+ "\t" + data.withdrawals[i];
            content += "\n";
          }
          setRWSDown(content);
        }
      } catch (err) {
        catchFunc(err);
      }
    })();
  }, [fromRW, toRW]);
  // console.log(visits.data.series[0]);
  // console.log(visits.data.series[0].reduce((all, ele) => all + parseFloat(ele), 0).toFixed(0));
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <People />
              </CardIcon>
              <p className={classes.cardCategory}>Total players</p>
              <h3 className={classes.cardTitle}>
                {totalUsers}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                {to.getFullYear() + "-" + (to.getMonth() + 1) + "-" + to.getDate()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <ExitToApp />
              </CardIcon>
              <p className={classes.cardCategory}>Total visits</p>
              <h3 className={classes.cardTitle}>{totalVisits}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                {to.getFullYear() + "-" + (to.getMonth() + 1) + "-" + to.getDate()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Money />
              </CardIcon>
              <p className={classes.cardCategory}>Total Revenue</p>
              <h3 className={classes.cardTitle}>$ {totalRevenue}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                {to.getFullYear() + "-" + (to.getMonth() + 1) + "-" + to.getDate()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Money />
              </CardIcon>
              <p className={classes.cardCategory}>Total Rewards</p>
              <h3 className={classes.cardTitle}>$ {totalRewards}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                {to.getFullYear() + "-" + (to.getMonth() + 1) + "-" + to.getDate()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="info" icon>
              <CardIcon color="info">
                <Timeline />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Enjoy <small>- $ {revenues.data.series[0].reduce((all, ele) => all + parseFloat(ele), 0).toFixed(2)}</small>
                <span className={classes.datePickers}>
                  <Datetime
                    timeFormat={false}
                    inputProps={{ placeholder: "From" }}
                    className={classes.datePicker}
                    closeOnSelect={true}
                    value={fromRevenue}
                    onChange={(e) => { setFromRevenue(e) }}
                  />
                  <Datetime
                    timeFormat={false}
                    inputProps={{ placeholder: "To" }}
                    className={classes.datePicker}
                    closeOnSelect={true}
                    value={toRevenue}
                    onChange={(e) => { setToRevenue(e) }}
                  />
                  <Button justIcon color="info" simple onClick={downRevenue}>
                    <GetApp />
                  </Button>
                </span>
              </h4>
              <div>

              </div>
            </CardHeader>
            <CardBody>
              <ChartistGraph
                data={revenues.data}
                type="Line"
                options={revenues.options}
                listener={revenues.animation}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="info" icon>
              <CardIcon color="info">
                <Timeline />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Toss <small>- $ {toss.data.series[0].reduce((all, ele) => all + parseFloat(ele), 0).toFixed(2)}</small>
                <span className={classes.datePickers}>
                  <Datetime
                    timeFormat={false}
                    inputProps={{ placeholder: "From" }}
                    className={classes.datePicker}
                    closeOnSelect={true}
                    value={fromToss}
                    onChange={(e) => { setFromToss(e) }}
                  />
                  <Datetime
                    timeFormat={false}
                    inputProps={{ placeholder: "To" }}
                    className={classes.datePicker}
                    closeOnSelect={true}
                    value={toToss}
                    onChange={(e) => { setToToss(e) }}
                  />
                  <Button justIcon color="info" simple onClick={downToss}>
                    <GetApp />
                  </Button>
                </span>
              </h4>
              <div>

              </div>
            </CardHeader>
            <CardBody>
              <ChartistGraph
                data={toss.data}
                type="Line"
                options={toss.options}
                listener={toss.animation}
              />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <BarChart />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Visitors / New  <small>- {visits.data.series[0].reduce((all, ele) => all + parseInt(ele), 0)} / {visits.data.series[1].reduce((all, ele) => all + parseInt(ele), 0)}</small>
                <span className={classes.datePickers}>
                  <Datetime
                    timeFormat={false}
                    inputProps={{ placeholder: "From" }}
                    className={classes.datePicker}
                    closeOnSelect={true}
                    value={fromVisit}
                    onChange={(e) => { setFromVisit(e) }}
                  />
                  <Datetime
                    timeFormat={false}
                    inputProps={{ placeholder: "To" }}
                    className={classes.datePicker}
                    closeOnSelect={true}
                    value={toVisit}
                    onChange={(e) => { setToVisit(e) }}
                  />
                  <Button justIcon color="info" simple onClick={downVisits}>
                    <GetApp />
                  </Button>
                </span>
              </h4>
            </CardHeader>
            <CardBody>
              <ChartistGraph
                data={visits.data}
                type="Bar"
                options={visits.options}
                listener={visits.animation}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="warning" icon>
              <CardIcon color="warning">
                <MultilineChart />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Recharges / Withdrawals <small>-  $ {rws.data.series[0].reduce((all, ele) => all + parseFloat(ele), 0).toFixed(2)} / $ {rws.data.series[1].reduce((all, ele) => all + parseFloat(ele), 0).toFixed(2)}</small>
                <span className={classes.datePickers}>
                  <Datetime
                    timeFormat={false}
                    inputProps={{ placeholder: "From" }}
                    className={classes.datePicker}
                    closeOnSelect={true}
                    value={fromRW}
                    onChange={(e) => { setFromRW(e) }}
                  />
                  <Datetime
                    timeFormat={false}
                    inputProps={{ placeholder: "To" }}
                    className={classes.datePicker}
                    closeOnSelect={true}
                    value={toRW}
                    onChange={(e) => { setToRW(e) }}
                  />
                  <Button justIcon color="info" simple onClick={downRWS}>
                    <GetApp />
                  </Button>
                </span>
              </h4>
            </CardHeader>
            <CardBody>
              <ChartistGraph
                data={rws.data}
                type="Line"
                options={rws.options}
                listener={rws.animation}
              />
            </CardBody>
          </Card>
        </GridItem>

      </GridContainer>
    </div>
  );
}

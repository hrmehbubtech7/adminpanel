import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// material-ui icons
import ArtTrack from "@material-ui/icons/ArtTrack";
import Button from "components/CustomButtons/Button.js";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";
import { FetchContext } from "variables/authFetch";
import { useSnackbar } from 'notistack';
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";

const styles = {
  ...customCheckboxRadioSwitch,
  innerContent: {
    padding: "5px 20px"
  },
  greenItem:{
    color:'green'
  },
  redItem:{
    color:'red'
  },
  violetItem:{
    color:'violet'
  },
  customCardContentClass: {
    paddingLeft: "0",
    paddingRight: "0"
  },
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  predictButton:{
    padding:"3px 5px"
  }
};

const useStyles = makeStyles(styles);

export default function Playing() {
  const [auto, setAuto] = useState(false);
  const [bets, setBets] = useState('');
  const [period, setPeriod] = useState('');
  const [timer, setTimer] = useState('');
  const [result, setResult] = useState('');
  const classes = useStyles();
  const { authAxios } = React.useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();
  const activeNumber = (no) => {
    if(no<0)
      return (
        <Button
          color="danger"
          className={classes.actionButton+" "+classes.predictButton}
        >
          {no}
        </Button>
      );
    else if(no>0)
      return (
        <Button
          color="success"
          className={classes.actionButton+" "+classes.predictButton}
        >
          {no}
        </Button>
      );
    else
    return (
      <Button
        color="info"
        className={classes.actionButton+" "+classes.predictButton}
        >
        {no}
      </Button>
    );
  };
  const inactiveNumber = (no,level, number) => {
    return (
      <Button
      className={classes.actionButton+" "+classes.predictButton}
      onClick={()=>postNumber(level, number)}
      >
        {no}
      </Button>
    );
  };
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
  useEffect(() => {
    let interval=setInterval(dataRead, 1000);
    return ()=>clearInterval(interval);
  }, []);
  const postAuto=async (event)=>{
    const tmp=event.target.checked;
    try {
      const { data } = await authAxios.post("/enjoy-admin-auto",{
        auto:tmp
      });
      setAuto(tmp);
    }catch (err) {
      console.log(err);
      catchFunc(err);
    }
  }
  const postNumber=async (level, number)=>{
    try {
      const { data } = await authAxios.post("/enjoy-admin",{
        level,number
      });
    }catch(err){
      catchFunc(err);
    }
  };
  const dataRead = async () => {
    try {
      const { data } = await authAxios.get("/enjoy-admin/4");
      if (data) {
        setPeriod(data.log_time);
        const tmp_total = [];
        for (let i = 0; i < 4; i++) {
          const tmp_game = [];
          const tmp_game_total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
         
          for (let k = 0; k < data.bet[i].length; k++) {
            //Player data push
            const tmp_player = [];
            tmp_player.push(data.bet[i][k][0]);
            for (let m = 0; m < 13; m++) {
              tmp_player.push(data.bet[i][k][2][m]);
              tmp_game_total[m] += data.bet[i][k][2][m];
            }
            tmp_game.push(tmp_player);

          }
          let tmp_budget, tmp_price;
          let tmp_profits=[];
          tmp_profits.push("Prediction");
          for (let m = 0; m < 10; m++) {
            if (m % 5 === 0) {
              tmp_price = Math.floor(tmp_game_total[m] * 7.82 + tmp_game_total[12] * 3.41 + tmp_game_total[11 - (m % 2)] * 0.47);
              tmp_budget = 0;
              for (var k = 0; k < 13; k++)
                tmp_budget += tmp_game_total[k];
              tmp_budget = Math.floor(tmp_budget - tmp_price - tmp_game_total[m] - tmp_game_total[12] - tmp_game_total[11 - (m % 2)]);
            } else if (m % 2 === 0) {
              tmp_price = Math.floor(tmp_game_total[m] * 7.82 + tmp_game_total[11] * 0.96);
              tmp_budget = 0;
              for (k = 0; k < 13; k++)
                tmp_budget += tmp_game_total[k];
              tmp_budget = Math.floor(tmp_budget - tmp_price - tmp_game_total[m] - tmp_game_total[11]);
            } else {
              tmp_price = Math.floor(tmp_game_total[m] * 7.82 + tmp_game_total[10] * 0.96);
              tmp_budget = 0;
              for (k = 0; k < 13; k++)
                tmp_budget += tmp_game_total[k];
              tmp_budget = tmp_budget - tmp_price - tmp_game_total[m] - tmp_game_total[10];
            }
            if(m===parseInt(data.number[i])){
              tmp_profits.push(activeNumber(tmp_budget));
            }else{
              tmp_profits.push(inactiveNumber(tmp_budget, i, m));
            }
          }
          
          tmp_game.push(["Total", ...tmp_game_total]);
          tmp_game.push(tmp_profits);
          tmp_total.push(tmp_game);
        }
        setBets(tmp_total);
        setTimer(Math.floor((180000 - parseInt(data.time)) / 1000));
        setResult(data.number);
        setAuto(data.auto);
      }
    } catch (err) {
      catchFunc(err);
    }
  };
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <ArtTrack />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Current Players</h4>
          </CardHeader>
          <CardBody className={classes.customCardContentClass}>
            <div className={classes.innerContent}>
              <FormControlLabel
                control={
                  <Switch
                    checked={auto}
                    onChange={postAuto}
                    value="auto"
                    classes={{
                      switchBase: classes.switchBase,
                      checked: classes.switchChecked,
                      thumb: classes.switchIcon,
                      track: classes.switchBar
                    }}
                  />
                }
                classes={{
                  label: classes.label
                }}
                label="Auto"
              />
              <h5>Period : {period} <small>{Math.floor(timer / 60) + ":" + (timer % 60)}</small></h5>
            </div>
            <div className={classes.innerContent}>
              <h5>Parity</h5>
            </div>
            <Table
              hover
              tableHead={["User", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", (<span className={classes.greenItem}>G</span>), (<span className={classes.redItem}>R</span>), (<span className={classes.violetItem}>V</span>)]}
              tableData={bets[0] ? bets[0] : []}
            />
            <br />
            <div className={classes.innerContent}>
              <h5>Sapre</h5>
            </div>
            <Table
              hover
              tableHead={["User", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", (<span className={classes.greenItem}>G</span>), (<span className={classes.redItem}>R</span>), (<span className={classes.violetItem}>V</span>)]}
              tableData={bets[1] ? bets[1] : []}
            />
            <br />
            <div className={classes.innerContent}>
              <h5>Bcone</h5>
            </div>
            <Table
              hover
              tableHead={["User", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", (<span className={classes.greenItem}>G</span>), (<span className={classes.redItem}>R</span>), (<span className={classes.violetItem}>V</span>)]}
              tableData={bets[2] ? bets[2] : []}
            />
            <br />
            <div className={classes.innerContent}>
              <h5>Emerd</h5>
            </div>

            <Table
              hover
              tableHead={["User", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", (<span className={classes.greenItem}>G</span>), (<span className={classes.redItem}>R</span>), (<span className={classes.violetItem}>V</span>)]}
              tableData={bets[3] ? bets[3] : []}
            />

          </CardBody>
        </Card>
      </GridItem>

    </GridContainer>
  );
}

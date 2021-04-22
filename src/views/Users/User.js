import React, { useEffect, useState } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import AccountCircle from "@material-ui/icons/AccountCircle";
import Dvr from "@material-ui/icons/Dvr";
import {
  ThumbUpAlt,
  ThumbDown,
  DeleteForever
} from "@material-ui/icons/";
import Edit from "@material-ui/icons/Edit";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import { FetchContext } from "variables/authFetch";
import { useSnackbar } from 'notistack';
import CustomInput from "components/CustomInput/CustomInput.js";
import CircularProgress from '@material-ui/core/CircularProgress';
import Warning from "components/Typography/Warning.js";
import Danger from "components/Typography/Danger.js";
import Success from "components/Typography/Success.js";
import Primary from "components/Typography/Primary.js";
import Info from "components/Typography/Info.js";

import { AuthContext } from 'variables/auth';
import ReactTable from "components/ReactTable/ReactTable.js";
import SweetAlert from "react-bootstrap-sweetalert";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import buttonStyle from "assets/jss/material-dashboard-pro-react/components/buttonStyle.js";
const styles = {
  ...buttonStyle,
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  }
};

const useStyles = makeStyles(styles);

export default function User(props) {
  const { authState } = React.useContext(AuthContext);
  const { authAxios } = React.useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();
  const id = props.match.params.id;
  const [user, setUser] = useState('');
  const [recharges, setRecharges] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [enjoys, setEnjoys] = useState([]);
  const [balanceEditable, setBalanceEditable] = useState(false);
  const [balance, setBalance] = useState('');
  const classes = useStyles();
  const [alert, setAlert] = React.useState(null);
  console.log(props);
  const pointUp = async () => {
    try {
      const { data } = await authAxios.put(`/pointUp/${id}`).catch((err) => {
        catchFunc(err);
      });
      console.log(data);
      setUser(data);
    } catch (err) {
      catchFunc(err);
    }
  };

  const pointDown = async () => {
    try {
      const { data } = await authAxios.put(`/pointDown/${id}`).catch((err) => {
        catchFunc(err);
      });
      setUser(data);
    } catch (err) {
      catchFunc(err);
    }
  };

  const remove = () => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure remove this user data?"
        onConfirm={() => successDelete()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
        cancelBtnCssClass={classes.button + " " + classes.danger}
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
      >
        You will not be able to recover this user data!
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  const successDelete = async () => {
    try {
      const { data } = await authAxios.delete(`/remove-user/${id}`).catch((err) => {
        catchFunc(err);
      });
      props.history.push('/admin/users');
    } catch (err) {
      catchFunc(err);
    }

  };

  const postBalance = async () => {
    try {
      const { data } = await authAxios.post(`/balance/${id}`, { balance }
      ).catch((err) => {
        catchFunc(err);
      });
      setUser(data);
      setBalanceEditable(false);
    } catch (err) {
      catchFunc(err);
    }
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
    console.log(props);
    (async () => {
      try {
        const { data } = await authAxios.get(`/user/${id}`).catch(err => {
          catchFunc(err);
        });
        setUser(data.user);
        setBalance(data.user.budget);
        setRecharges(data.recharges);
        setWithdrawals(data.withdrawals);
        setRewards(data.rewards);
        setEnjoys(data.enjoys);
      } catch (err) {
        catchFunc(err);
      }
    })();
  }, []);
  console.log(user)
  return (
    <GridContainer>
      <GridItem xs={12}>
        {alert}
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <AccountCircle />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>User</h4>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12}>
                {
                  authState.userInfo.superAdmin && !user.superAdmin ? (
                    <Button justIcon round color="primary" onClick={pointUp} ><ThumbUpAlt /></Button>
                  ) : ''
                }
                {
                  authState.userInfo.superAdmin && user.admin ? (
                    <Button justIcon round color="info" onClick={pointDown}><ThumbDown /></Button>
                  ) : ''
                }
                {
                  authState.userInfo.superAdmin ? (
                    <Button justIcon round color="danger" onClick={remove} ><DeleteForever /></Button>
                  ) : ''
                }
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} lg={3} md={4} sm={6}>
                <h4>Role</h4>
                <div>{user.superAdmin ? (<Danger>Super Admin</Danger>) : (user.admin ? (<Warning>Admin</Warning>) : 'User')}</div>
              </GridItem>
              <GridItem xs={12} lg={3} md={4} sm={6}>
                <h4>Phone</h4>
                <p>{user.phone}</p>
              </GridItem>
              <GridItem xs={12} lg={3} md={4} sm={6}>
                <h4>Email</h4>
                <p>{user.email}</p>
              </GridItem>
              <GridItem xs={12} lg={3} md={4} sm={6}>
                <h4>Nickname</h4>
                <p>{user.nickname}</p>
              </GridItem>
              <GridItem xs={12} lg={3} md={4} sm={6}>
                <h4>Joined at</h4>
                <p>{user.createdAt}</p>
              </GridItem>
              <GridItem xs={12} lg={3} md={4} sm={6}>
                <h4>Verification</h4>
                <div>{user.phone_verified ? (<Success>Done</Success>) : "Not yet"}</div>
              </GridItem>
              <GridItem xs={12} lg={3} md={4} sm={6}>
                <h4>Balance</h4>
                {
                  authState.userInfo.superAdmin ? (
                    balanceEditable ? (
                      <div>
                        <CustomInput
                          labelText="Balance"
                          id="balance"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "number",
                            value: balance,
                            onChange: (e) => { setBalance(e.target.value) }
                          }}
                        />
                        <Button onClick={postBalance} size="sm" simple color="primary">OK</Button>
                        <Button color="warning" simple onClick={() => { setBalanceEditable(false); setBalance(user.budget) }}>Cancel</Button>
                      </div>
                    ) : (
                        <div>{user.budget}<Button onClick={() => setBalanceEditable(true)} size="sm" simple justIcon color="primary"><Edit /></Button></div>
                      )
                  ) : user.budget

                }
              </GridItem>
              <GridItem xs={12} lg={3} md={4} sm={6}>
                <h4>Referrer 1</h4>
                <p>{user.refer1?.phone}</p>
              </GridItem>
              <GridItem xs={12} lg={3} md={4} sm={6}>
                <h4>Referrer 2</h4>
                <p>{user.refer2?.phone}</p>
              </GridItem>
            </GridContainer>
            <hr />
            <GridContainer>
              <GridItem xs={12} sm={6}>
                <h4>Referral List 1</h4>
                <ReactTable
                  nextBtn={false}
                  columns={[
                    {
                      Header: "No",
                      accessor: "no"
                    },
                    {
                      Header: "Phone",
                      accessor: "phone"
                    }
                  ]}
                  data={user.refered1 && user.refered1.length > 0 ? user.refered1.map((ele, key) => {
                    return {
                      no: (key + 1),
                      phone: ele.phone
                    }
                  }) : []}
                />
              </GridItem>

              <GridItem xs={12} sm={6}>
                <h4>Referral List 2</h4>
                <ReactTable
                  nextBtn={false}
                  columns={[
                    {
                      Header: "No",
                      accessor: "no"
                    },
                    {
                      Header: "Phone",
                      accessor: "phone"
                    }
                  ]}
                  data={user.refered2 && user.refered2.length > 0 ? user.refered2.map((ele, key) => {
                    return {
                      no: (key + 1),
                      phone: ele.phone
                    }
                  }) : []}
                />
              </GridItem>
            </GridContainer>
            <hr />
            <GridContainer>
              <GridItem md={12} lg={6}>
                <h4>Recharge List</h4>
                <ReactTable
                  nextBtn={false}
                  columns={[
                    {
                      Header: "Order No",
                      accessor: "_id"
                    },
                    {
                      Header: "Amount",
                      accessor: "money"
                    },
                    {
                      Header: "Date",
                      accessor: "createdAt"
                    },
                    {
                      Header: "Status",
                      accessor: "status"
                    }
                  ]}
                  data={recharges && recharges.length > 0 ? recharges.map((ele, key) => {
                    return {
                      _id: ele._id,
                      money: ele.money,
                      createdAt: ele.createdAt,
                      status: ele.status == 1 ? (<Success>Done</Success>) : (
                        ele.status == -1 ? (<Danger>Failed</Danger>) : (<Warning>Doing</Warning>)
                      )
                    }
                  }) : []}
                />
                <br />
                <h4>Reward List</h4>
                <ReactTable
                  nextBtn={false}
                  columns={[
                    {
                      Header: "Amount",
                      accessor: "money"
                    },
                    {
                      Header: "Status",
                      accessor: "status"
                    },
                    {
                      Header: "Awarded by",
                      accessor: "awarded"
                    }
                  ]}
                  data={rewards && rewards.length > 0 ? rewards.map((ele, key) => {
                    return {
                      money: ele.money,
                      status: ele.status ? (<Success>Done</Success>) : (<Warning>Not yet</Warning>),
                      awarded: ele.createdBy?.phone
                    }
                  }) : []}
                />
              </GridItem>
              <GridItem md={12} lg={6}>
                <h4>Withdrawal List</h4>
                <ReactTable
                  nextBtn={false}
                  columns={[
                    {
                      Header: "Order No",
                      accessor: "_id"
                    },
                    {
                      Header: "Amount",
                      accessor: "order_amount"
                    },
                    {
                      Header: "Date",
                      accessor: "createdAt"
                    },
                    {
                      Header: "Status",
                      accessor: "status"
                    }
                  ]}
                  data={withdrawals && withdrawals.length > 0 ? withdrawals.map((ele, key) => {
                    return {
                      _id: ele._id,
                      order_amount: ele.order_amount,
                      createdAt: ele.createdAt,
                      status: ele.status == 1 ? (<Primary>Approved</Primary>) : (
                        ele.status == 3 ? (
                          <Success>Completed</Success>
                        ) : (ele.status == 2 ? (<Danger>Declined</Danger>) : (
                          ele.status == 4 ? (<Warning>Failed</Warning>) : (
                            <Info>Waiting</Info>
                          )
                        )
                          )
                      )
                    }
                  }) : []}
                />
                <br />
                <h4>Betting History</h4>
                <ReactTable
                  nextBtn={false}
                  columns={[
                    {
                      Header: "Period",
                      accessor: "period"
                    },
                    {
                      Header: "Select",
                      accessor: "select"
                    },
                    {
                      Header: "Result",
                      accessor: "result"
                    },
                    {
                      Header: "Bet",
                      accessor: "contract"
                    },
                    {
                      Header: "Price",
                      accessor: "amount"
                    }
                  ]}
                  data={enjoys && enjoys.length > 0 ? enjoys : []}
                />
              </GridItem>
            </GridContainer>
            <hr />
            <GridContainer>
              <GridItem xs={12}>
                <h4>Financial History</h4>
                <ReactTable
                  nextBtn={false}
                  columns={[
                    {
                      Header: "Type",
                      accessor: "type"
                    },
                    {
                      Header: "Amount",
                      accessor: "amount"
                    },
                    {
                      Header: "Details",
                      accessor: "details"
                    },
                    {
                      Header: "Date",
                      accessor: "createdAt"
                    }
                  ]}
                  data={user.financials && user.financials.length > 0 ? user.financials.map((ele) => {
                    return {
                      type: ele.type,
                      amount: ele.amount,
                      details: ele.detials ? (ele.details.orderId ? ele.details.orderId : ele.details.period) : '',
                      createdAt: ele.createdAt
                    };
                  }) : []}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer >
  );
}

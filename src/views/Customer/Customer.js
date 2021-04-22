import React, { useContext, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Schedule from "@material-ui/icons/Schedule";
import Info from "@material-ui/icons/Info";
import LocationOn from "@material-ui/icons/LocationOn";
import Gavel from "@material-ui/icons/Gavel";
import HelpOutline from "@material-ui/icons/HelpOutline";
import Visibility from "@material-ui/icons/Visibility";
import Block from "@material-ui/icons/Block";
import CheckBox from "@material-ui/icons/CheckBox";
import Restore from "@material-ui/icons/Restore";
import DeleteForever from "@material-ui/icons/DeleteForever";
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from "@material-ui/icons/Search";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import TablePagination from '@material-ui/core/TablePagination';
import GridItem from "components/Grid/GridItem.js";
import NavPills from "components/NavPills/NavPills.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Close from "@material-ui/icons/Close";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { FetchContext } from "variables/authFetch";
import { useSnackbar } from 'notistack';
import Swal from 'sweetalert2'
const styles = {
  cardTitle,
  pageSubcategoriesTitle: {
    color: "#3C4858",
    textDecoration: "none",
    textAlign: "center"
  },
  cardCategory: {
    margin: "0",
    color: "#999999"
  },
  actionButton: {
    margin: "0 0 0 5px",
    padding: "5px",
    "& svg,& .fab,& .fas,& .far,& .fal,& .material-icons": {
      marginRight: "0px"
    }
  },
};

const useStyles = makeStyles(styles);

export default function Customer() {
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
  }
  const { enqueueSnackbar } = useSnackbar();
  const { authAxios } = useContext(FetchContext);
  const [customers, setCustomers] = useState([[], [], [], []]);
  const [total, setTotal] = useState([0, 0, 0, 0]);
  const [page, setPage] = useState([0, 0, 0, 0]);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState(['', '', '', '']);
  const [started, setStarted] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState([10, 10, 10, 10]);


  useEffect(() => {
    (async () => {
      try {
        const { data } = await authAxios.get("/customers");
        setCustomers(data.customers);
        setTotal(data.total);
        setStarted(true);
      } catch (err) {
        catchFunc(err);
      }
    })();


  }, []);
  useEffect(() => {
    (async () => {
      try {
        if (started === true) {
          let tmp = JSON.parse(JSON.stringify(customers));
          let tmp_total = JSON.parse(JSON.stringify(total));
          const { data } = await authAxios.get(`/customers/${tab}/${page[tab]}/${rowsPerPage[tab]}/${search[tab]}`);
          tmp[tab] = data.customers;
          tmp_total[tab] = data.total;
          setCustomers(tmp);
          setTotal(tmp_total);
        }
      } catch (err) {
        catchFunc(err);
      }
    })();
  }, [search, page, rowsPerPage]);

  const closeCustomer =async (id, type) => {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Message',
      inputPlaceholder: 'Type your message here...',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true
    })
    
    if (text) {
      try {
        const { data } = await authAxios.put(`/customer/${customers[type][id].id}/close`,{
          message:text
        });
        let tmp=JSON.parse(JSON.stringify(customers));
        
        tmp[3].push(tmp[type][id]);
        tmp[type].splice(id,1);
        setCustomers(tmp);
        Swal.fire(
          'Closed!',
          'Seleted customer account has been closed.',
          'success'
        )
      } catch (err) {
        catchFunc(err);
      }

    }
  };
  const showCustomer = (id, type) => {
    console.log(customers[type][id].company);
    window.open(
      '/customer/'+customers[type][id].company,
      '_blank' // <- This is what makes it open in a new window.
    );

  };
  const approveCustomer =async (id, type) => {   
    
    Swal.fire({
      title: 'Are you sure?',
      text: `${customers[type][id].company} will be verified!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await authAxios.put(`/customer/${customers[type][id].id}/approve`);
          let tmp=JSON.parse(JSON.stringify(customers));
          tmp[2].push(tmp[type][id]);
          tmp[type].splice(id,1);
          setCustomers(tmp);
          Swal.fire(
            'Approved!',
            `${customers[type][id].company} is verified.`,
            'success'
          )
        } catch (err) {
          catchFunc(err);
        }
        
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelled',
          `${customers[type][id].company} is not verified :)`,
          'error'
        )
      }
    })
  };
  const declineCustomer =async (id, type) => {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Message',
      inputPlaceholder: 'Type your message here...',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true
    })
    
    if (text) {
      try {
        const { data } = await authAxios.put(`/customer/${customers[type][id].id}/decline`,{
          message:text
        });
        let tmp=JSON.parse(JSON.stringify(customers));
        tmp[type][id].profileDeclined=true;
        setCustomers(tmp);
        Swal.fire(
          'Declined!',
          `Seleted customer's requirement declined.`,
          'success'
        )
      } catch (err) {
        catchFunc(err);
      }

    }
  };
  const cancelCustomer =async (id, type) => {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Message',
      inputPlaceholder: 'Type your message here...',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true
    })
    
    if (text) {
      try {
        const { data } = await authAxios.put(`/customer/${customers[type][id].id}/cancel`,{
          message:text
        });
        let tmp=JSON.parse(JSON.stringify(customers));
        tmp[1].push(tmp[type][id]);
        tmp[type].splice(id,1);
        setCustomers(tmp);
        Swal.fire(
          'Cancelled!',
          `Seleted customer's verification cancelled.`,
          'success'
        )
      } catch (err) {
        catchFunc(err);
      }

    }
  };
  const restoreCustomer =async (id, type) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `${customers[type][id].company} will be alive!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await authAxios.put(`/customer/${customers[type][id].id}/restore`);
          let tmp=JSON.parse(JSON.stringify(customers));
          if(tmp[type][id].profileVerified){
            tmp[2].push(tmp[type][id]);
          }else if(tmp[type][id].profileMade){
            tmp[1].push(tmp[type][id]);
          }else{
            tmp[0].push(tmp[type][id]);
          }
          tmp[type].splice(id,1);
          setCustomers(tmp);
          Swal.fire(
            'Approved!',
            `${customers[type][id].company} is restored.`,
            'success'
          )
        } catch (err) {
          catchFunc(err);
        }
        
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelled',
          `${customers[type][id].company} is closed yet :)`,
          'error'
        )
      }
    });
  };
  const removeCustomer =async (id, type) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `${customers[type][id].company} will be removed forever!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await authAxios.put(`/customer/${customers[type][id].id}/remove`);
          let tmp=JSON.parse(JSON.stringify(customers));
          tmp[type].splice(id,1);
          setCustomers(tmp);
          Swal.fire(
            'Approved!',
            `${customers[type][id].company} is removed forever.`,
            'success'
          )
        } catch (err) {
          catchFunc(err);
        }
        
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelled',
          `${customers[type][id].company} is removed. :)`,
          'error'
        )
      }
    });
  };
  const handleChangePage = (value, type) => {
    setTab(type);
    let tmp = JSON.parse(JSON.stringify(page));
    tmp[type] = value;
    setPage(tmp);
  }
  const handleChangeRowsPerPage = (value, type) => {
    setTab(type);
    let tmp = JSON.parse(JSON.stringify(rowsPerPage));
    tmp[type] = value;
    setRowsPerPage(rowsPerPage);
  }
  const searchCustomers = (value, type) => {
    setTab(type);
    let tmp = JSON.parse(JSON.stringify(search));
    tmp[type] = value;
    setSearch(tmp);
  }
  const classes = useStyles();
  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader>
              <h4 className={classes.cardTitle}>
                Customers
              </h4>
            </CardHeader>
            <CardBody>
              <NavPills
                color="warning"
                tabs={[
                  {
                    tabButton: "New comers",
                    tabContent: (
                      <>
                        <Input
                          startAdornment={
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          }
                          onChange={(e) => searchCustomers(e.target.value, 0)}
                          value={search[0]}
                        />
                        <Table
                          striped
                          tableHead={[
                            "#",
                            "Company name",
                            "Username",
                            "Email",
                            "created at",
                            "Actions"
                          ]}
                          tableData={
                            customers[0].map((ele, key) => [
                              key + 1,
                              ele.company,
                              ele.username,
                              ele.email,
                              ele.created,
                              (
                                <div key={key}>
                                  <Button
                                    color="danger"
                                    simple
                                    className={classes.actionButton}
                                    onClick={()=>closeCustomer(key, 0)}

                                  >
                                    <Close className={classes.icon} />
                                  </Button>

                                </div>
                              )
                            ])
                          }
                          customCellClasses={[classes.center, classes.right, classes.right]}
                          customClassesForCells={[0, 4, 5]}
                          customHeadCellClasses={[
                            classes.center,
                            classes.right,
                            classes.right
                          ]}
                          customHeadClassesForCells={[0, 4, 5]}
                        />
                        <TablePagination
                          component="div"
                          count={total[0]}
                          page={page[0]}
                          onChangePage={(e) => handleChangePage(e.target.value, 0)}
                          rowsPerPage={rowsPerPage[0]}
                          onChangeRowsPerPage={(e) => handleChangeRowsPerPage(e.target.value, 0)}
                        />
                      </>
                    )
                  },
                  {
                    tabButton: "Profiled Customers",
                    tabContent: (
                      <>
                        <Input
                          startAdornment={
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          }
                          onChange={(e) => searchCustomers(e.target.value, 1)}
                          value={search[1]}
                        />
                        <Table
                          striped
                          tableHead={[
                            "#",
                            "Company name",
                            "Username",
                            "Email",
                            "Phone Number",
                            "created at",
                            "Actions"
                          ]}
                          tableData={
                            customers[1].map((ele, key) => [
                              key + 1,
                              ele.company,
                              ele.username,
                              ele.email,
                              ele.phoneNumber,
                              ele.created,
                              (
                                <div key={key}>
                                  <Button
                                    color="info"
                                    simple
                                    className={classes.actionButton}
                                    onClick={()=>showCustomer(key, 1)}

                                  >
                                    <Visibility className={classes.icon} />
                                  </Button>,
                                  <Button
                                    color="success"
                                    simple
                                    className={classes.actionButton}
                                    onClick={()=>approveCustomer(key, 1)}

                                  >
                                    <CheckBox className={classes.icon} />
                                  </Button>,
                                  <Button
                                    color="warning"
                                    className={classes.actionButton}
                                    onClick={()=>declineCustomer(key, 1)}
                                    simple
                                  >
                                    <Block className={classes.icon} />
                                  </Button>,
                                  <Button
                                    color="danger"
                                    simple
                                    className={classes.actionButton}
                                    onClick={()=>closeCustomer(key, 1)}
                                  >
                                    <Close className={classes.icon} />
                                  </Button>
                                </div>
                              )
                            ])
                          }
                          customCellClasses={[classes.center, classes.right, classes.right]}
                          customClassesForCells={[0, 4, 5]}
                          customHeadCellClasses={[
                            classes.center,
                            classes.right,
                            classes.right
                          ]}
                          customHeadClassesForCells={[0, 4, 5]}
                        />
                        <TablePagination
                          component="div"
                          count={total[1]}
                          page={page[1]}
                          onChangePage={(e) => handleChangePage(e.target.value, 1)}
                          rowsPerPage={rowsPerPage[1]}
                          onChangeRowsPerPage={(e) => handleChangeRowsPerPage(e.target.value, 1)}
                        />
                      </>
                    )
                  },
                  {
                    tabButton: "Verified Customers",
                    tabContent: (
                      <>
                        <Input
                          startAdornment={
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          }
                          onChange={(e) => searchCustomers(e.target.value, 2)}
                          value={search[2]}
                        />
                        <Table
                          striped
                          tableHead={[
                            "#",
                            "Company name",
                            "Username",
                            "Email",
                            "Phone Number",
                            "Membership",
                            "created at",
                            "Actions"
                          ]}
                          tableData={
                            customers[2].map((ele, key) => [
                              key + 1,
                              ele.company,
                              ele.username,
                              ele.email,
                              ele.phoneNumber,
                              "Level " + ele.membership,
                              ele.created,
                              (
                                <div key={key}>
                                  <Button
                                    color="info"
                                    simple
                                    className={classes.actionButton}
                                    onClick={()=>showCustomer(key, 2)}

                                  >
                                    <Visibility className={classes.icon} />
                                  </Button>,
                                  <Button
                                    color="warning"
                                    className={classes.actionButton}
                                    onClick={()=>cancelCustomer(key, 2)}
                                    simple
                                  >
                                    <Block className={classes.icon} />
                                  </Button>,
                                  <Button
                                    color="danger"
                                    simple
                                    className={classes.actionButton}
                                    onClick={()=>closeCustomer(key, 2)}

                                  >
                                    <Close className={classes.icon} />
                                  </Button>
                                </div>
                              )
                            ])
                          }
                          customCellClasses={[classes.center, classes.right, classes.right]}
                          customClassesForCells={[0, 4, 5]}
                          customHeadCellClasses={[
                            classes.center,
                            classes.right,
                            classes.right
                          ]}
                          customHeadClassesForCells={[0, 4, 5]}
                        />
                        <TablePagination
                          component="div"
                          count={total[2]}
                          page={page[2]}
                          onChangePage={(e) => handleChangePage(e.target.value, 2)}
                          rowsPerPage={rowsPerPage[2]}
                          onChangeRowsPerPage={(e) => handleChangeRowsPerPage(e.target.value, 2)}
                        />
                      </>
                    )
                  },
                  {
                    tabButton: "Closed Customers",
                    tabContent: (
                      <>
                        <Input
                          startAdornment={
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          }
                          onChange={(e) => searchCustomers(e.target.value, 3)}
                          value={search[3]}
                        />
                        <Table
                          striped
                          tableHead={[
                            "#",
                            "Company name",
                            "Username",
                            "Email",
                            "created at",
                            "Actions"
                          ]}
                          tableData={
                            customers[3].map((ele, key) => [
                              key + 1,
                              ele.company,
                              ele.username,
                              ele.email,
                              ele.created,

                              (
                                <div key={key}>
                                  <Button
                                    color="info"
                                    simple
                                    className={classes.actionButton}
                                    onClick={()=>showCustomer(key, 3)}

                                  >
                                    <Visibility className={classes.icon} />
                                  </Button>,
                                  <Button
                                    color="warning"
                                    className={classes.actionButton}
                                    onClick={()=>restoreCustomer(key, 3)}

                                  >
                                    <Restore className={classes.icon} />
                                  </Button>,
                                  <Button
                                    color="danger"
                                    simple
                                    className={classes.actionButton}
                                    onClick={()=>removeCustomer(key, 3)}

                                  >
                                    <DeleteForever className={classes.icon} />
                                  </Button>

                                </div>
                              )
                            ])
                          }
                          customCellClasses={[classes.center, classes.right, classes.right]}
                          customClassesForCells={[0, 4, 5]}
                          customHeadCellClasses={[
                            classes.center,
                            classes.right,
                            classes.right
                          ]}
                          customHeadClassesForCells={[0, 4, 5]}
                        />
                        <TablePagination
                          component="div"
                          count={total[3]}
                          page={page[3]}
                          onChangePage={(e) => handleChangePage(e.target.value, 3)}
                          rowsPerPage={rowsPerPage[3]}
                          onChangeRowsPerPage={(e) => handleChangeRowsPerPage(e.target.value, 3)}
                        />
                      </>
                    )
                  }
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

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
import Create from "@material-ui/icons/Create";
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
import CardIcon from "components/Card/CardIcon.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Close from "@material-ui/icons/Close";
import ContactSupport from "@material-ui/icons/ContactSupport";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { FetchContext } from "variables/authFetch";
import { useSnackbar } from 'notistack';
import styles from "assets/jss/material-dashboard-pro-react/views/supportStyle.js";
import Swal from 'sweetalert2'

const useStyles = makeStyles(styles);

export default function Support() {
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
  const [support, setSupport] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [started, setStarted] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await authAxios.get("/support");
        setSupport(data.support);
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

          const { data } = await authAxios.get(`/support/${page}/${rowsPerPage}/${search}`);

          setSupport(data.support);
          setTotal(data.total);
        }
      } catch (err) {
        catchFunc(err);
      }
    })();
  }, [search, page, rowsPerPage]);


  const handleChangePage = (value) => {
    setPage(value);
  }
  const handleChangeRowsPerPage = (value) => {
    setRowsPerPage(value);
  }
  const searchSupport = (value) => {
    setSearch(value);
  }
  const showSupport = async (key) => {
    Swal.fire(
      support[key].name,
      support[key].content
    );
    try {
      const { data } = await authAxios.put(`/support/${support[key].id}/show`);
      let tmp = JSON.parse(JSON.stringify(support));
      tmp[key].status = tmp[key].status < 1 ? 1 : tmp[key].status;
      setSupport(tmp);
    } catch (err) {
      catchFunc(err);
    }
  }
  const replySupport = async (key) => {
    const { value: formValues } = await Swal.fire({
      title: 'Reply to ' + support[key].name,
      html:
        'email: <input id="swal-input1" class="swal2-input" disabled value="' + support[key].email + '">' +
        'content: <textArea id="swal-input2" rows=4 class="swal2-input"></textArea>',

      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,

        ]
      }
    })

    if (formValues) {
      try {
        const { data } = await authAxios.put(`/support/${support[key].id}/reply`, {
          content: formValues[0], email: support[key].email
        });
        let tmp = JSON.parse(JSON.stringify(support));
        tmp[key].status = tmp[key].status < 2 ? 2 : tmp[key].status;
        setSupport(tmp);
        enqueueSnackbar("Successfully sent!", { variant: 'success' });
      } catch (err) {
        catchFunc(err);
      }

    }
  }
  const removeSupport = (key) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to remove this item?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {

        try {
          const { data } = await authAxios.delete("/support/" + support[key].id);
          if (data) {
            let tmp = JSON.parse(JSON.stringify(support));
            tmp.splice(key,1);
            setSupport(tmp);
            Swal.fire(
              'Deleted!',
              'Support data has been deleted.',
              'success'
            )
          }
        } catch (err) {
          catchFunc(err);
        }


      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelled',
          'Data is safe :)',
          'error'
        )
      }
    })
  }
  const classes = useStyles();
  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <ContactSupport />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Supports
              </h4>
            </CardHeader>
            <CardBody>
              <Input
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
                onChange={(e) => searchSupport(e.target.value)}
                value={search}
              />
              <Table
                striped
                tableHead={[
                  "#",
                  "Name",
                  "Email",
                  "Phone",
                  "created at",
                  "seen",
                  "Actions"
                ]}
                tableData={
                  support.map((ele, key) => [
                    key + 1,
                    ele.name,
                    ele.email,
                    ele.phone,
                    ele.created,
                    (ele.status == 0 ? (
                      <Button
                        color="danger"
                        simple
                      >
                        new!
                      </Button>
                    ) : ''),
                    (
                      <div key={key}>
                        <Button
                          color="info"
                          simple
                          className={classes.actionButton}
                          onClick={() => showSupport(key)}
                        >
                          <Visibility className={classes.icon} />
                        </Button>
                        <Button
                          color="success"
                          simple
                          className={classes.actionButton}
                          onClick={() => replySupport(key)}
                        >
                          <Create className={classes.icon} />
                        </Button>
                        <Button
                          color="danger"
                          simple
                          className={classes.actionButton}
                          onClick={() => removeSupport(key)}
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
                count={total}
                page={page}
                onChangePage={(e) => handleChangePage(e.target.value)}
                rowsPerPage={rowsPerPage}
                onChangeRowsPerPage={(e) => handleChangeRowsPerPage(e.target.value)}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

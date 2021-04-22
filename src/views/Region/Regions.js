import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Map from "@material-ui/icons/Map";
import Remove from "@material-ui/icons/Remove";
import PlaylistAdd from "@material-ui/icons/PlaylistAdd";
import Add from "@material-ui/icons/Add";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import { FetchContext } from "variables/authFetch";
import { publicFetch, staticURL } from "variables/publicFetch";
import { useSnackbar } from 'notistack';
import styles from "assets/jss/material-dashboard-pro-react/views/regionsStyle.js";
import Swal from 'sweetalert2'
import product1 from "assets/img/product1.jpg";
import product2 from "assets/img/product2.jpg";
import product3 from "assets/img/product3.jpg";

const useStyles = makeStyles(styles);

export default function Countries() {
  const [countries, setCountries] = React.useState([]);
  const [country, setCountry] = React.useState('');
  const [regions, setRegions] = React.useState([]);
  const { authAxios } = React.useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();
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
    (async () => {
      try {
        const { data } = await authAxios.get("/countries");
        if (data) {
          setCountries(data.map(ele => { return { id: ele.id, name: ele.name } }));
        }
      } catch (err) {
        catchFunc(err);
      }

    })();

  }, []);
  const countrySelect=async (e)=>{
    
    setCountry(e.target.value);
    try {
      const { data } = await authAxios.get("/country/"+e.target.value);
      if (data) {
        setRegions(data.regions.map(ele => { return { id: ele.id, name: ele.name,products:ele.products.length,buys:ele.buys.length } }));
      }
    } catch (err) {
      catchFunc(err);
    }
  }
  const classes = useStyles();
  const addRegions = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add Region',
      html:
        'Region Name <input id="swal-input2" class="swal2-input">',

      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input2').value
        ]
      }
    })

    if (formValues) {
      try {
        
        const { data } = await authAxios.post("/region", {
          name:formValues[0],
          country:country
        });
        if (data) {
          let tmp = JSON.parse(JSON.stringify(regions));
          tmp.push({ id: data.id, name: data.name,products:0,buys:0 });
          setRegions(tmp);
        }
      } catch (err) {
        catchFunc(err);
      }

    }
  };
  const editRegions = (key) => async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Region',
      html:
        'Region Name <input id="swal-input2" value="' + regions[key].name + '" class="swal2-input">',

      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input2').value
        ]
      }
    })

    if (formValues) {
      try {
       


        const { data } = await authAxios.put("/region/" + regions[key].id,  {
          name:formValues[0]
        });
        if (data) {
          let tmp = JSON.parse(JSON.stringify(regions));
          tmp[key].name = formValues[0];
          setRegions(tmp);
          enqueueSnackbar("Successfully modified!", { variant: 'success' });
        }
      } catch (err) {
        console.log(err);
        catchFunc(err);
      }

    }
  }
  const removeRegions = (key) => () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true
    })

    swalWithBootstrapButtons.fire({
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
          const { data } = await authAxios.delete("/region/" + regions[key].id);
          if (data) {
            let tmp = JSON.parse(JSON.stringify(regions));
            tmp.splice(key, 1);
            setRegions(tmp);
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Region data has been deleted.',
              'success'
            )
          }
        } catch (err) {
          console.log(err)
          catchFunc(err);
        }


      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Data is safe :)',
          'error'
        )
      }
    })
  }
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <Map />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Regions Table </h4>
          </CardHeader>
          <CardBody>
            <Button disabled={country===''} onClick={addRegions} color="primary" ><PlaylistAdd /> Add Region</Button>
            &nbsp;
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Countries</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={country}
                onChange={countrySelect}
              >
                {
                  countries.map((ele, key) => (
                    <MenuItem key={key} value={ele.id}>{ele.name}</MenuItem>
                  ))
                }

              </Select>
            </FormControl>
            <Table
              striped
              tableHead={[
                "#",
                "Region Name",
                "Products",
                "Buy Leads",
                "Actions"
              ]}
              tableData={
                regions.map((ele, key) => [
                  key + 1,
                  ele.name,
                  ele.products,
                  ele.buys,
                  [
                    <Button
                      color="success"
                      simple
                      className={classes.actionButton}
                      onClick={editRegions(key)}
                      key="0"
                    >
                      <Edit className={classes.icon} />
                    </Button>,
                    <Button
                      color="danger"
                      simple
                      className={classes.actionButton}
                      onClick={removeRegions(key)}
                      key="1"
                    >
                      <Close className={classes.icon} />
                    </Button>

                  ]
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
          </CardBody>
        </Card>
      </GridItem>

    </GridContainer>
  );
}

import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Public from "@material-ui/icons/Public";
import Remove from "@material-ui/icons/Remove";
import PlaylistAdd from "@material-ui/icons/PlaylistAdd";
import Add from "@material-ui/icons/Add";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

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
import styles from "assets/jss/material-dashboard-pro-react/views/countriesStyle.js";
import Swal from 'sweetalert2'
import product1 from "assets/img/product1.jpg";
import product2 from "assets/img/product2.jpg";
import product3 from "assets/img/product3.jpg";

const useStyles = makeStyles(styles);

export default function Countries() {
  const [countries, setCountries] = React.useState([]);
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
          setCountries(data.map(ele => { return { id: ele.id, name: ele.name, regionsCount: ele.regions.length } }));
        }
      } catch (err) {
        catchFunc(err);
      }

    })();

  }, []);

  const classes = useStyles();
  const addCountries = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add Country',
      html:
        'Country Flag <input type="file" accept="image/*" aria-label="Upload the picture" id="swal-input1" class="swal2-input">' +
        'Country Name <input id="swal-input2" class="swal2-input">',

      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').files[0],
          document.getElementById('swal-input2').value
        ]
      }
    })

    if (formValues) {
      try {
        const formData = new FormData();
        formData.append("images", formValues[0]);
        formData.set("name", formValues[1]);


        const { data } = await authAxios.post("/country", formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        if (data) {
          let tmp = JSON.parse(JSON.stringify(countries));
          tmp.push({ id: data.id, name: data.name, regionsCount: data.regions.length });
          setCountries(tmp);
          const reader = new FileReader()
          reader.onload = (e) => {
            Swal.fire({
              title: 'A New Country Added',
              imageUrl: e.target.result,
              imageAlt: formValues[1]
            })
          }
          reader.readAsDataURL(formValues[0])
        }
      } catch (err) {
        catchFunc(err);
      }

    }
  };
  const editCountries = (key) => async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Country',
      html:
        'Country Flag <input type="file" accept="image/*" aria-label="Upload the picture" id="swal-input1" class="swal2-input">' +
        'Country Name <input id="swal-input2" value="' + countries[key].name + '" class="swal2-input">',

      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').files[0],
          document.getElementById('swal-input2').value
        ]
      }
    })

    if (formValues) {
      try {
        const formData = new FormData();
        formData.append("images", formValues[0]);
        formData.set("name", formValues[1]);


        const { data } = await authAxios.put("/country/" + countries[key].id, formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        if (data) {

          if (formValues[0]) {
            const reader = new FileReader()
            reader.onload = (e) => {
              Swal.fire({
                title: 'A Country modified',
                imageUrl: e.target.result,
                imageAlt: formValues[1]
              });
              let tmp = JSON.parse(JSON.stringify(countries));
              tmp[key].name = formValues[1];
              tmp[key].src = e.target.result;
              setCountries(tmp);
            }
            reader.readAsDataURL(formValues[0])
          } else {
            let tmp = JSON.parse(JSON.stringify(countries));
            tmp[key].name = formValues[1];
            setCountries(tmp);
            enqueueSnackbar("Successfully modified!", { variant: 'success' });
          }

        }
      } catch (err) {
        console.log(err);
        catchFunc(err);
      }

    }
  }
  const removeCountries = (key) => () => {
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
          const { data } = await authAxios.delete("/country/" + countries[key].id);
          if (data) {
            let tmp = JSON.parse(JSON.stringify(countries));
            tmp.splice(key,1);
            setCountries(tmp);
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Countries data has been deleted.',
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
              <Public />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Countries Table <Button onClick={addCountries} className={classes.titleButton} justIcon link size="sm"><PlaylistAdd /></Button></h4>
          </CardHeader>
          <CardBody>
            <Table
              striped
              tableHead={[
                "#",
                "Flag",
                "Country Name",
                "Regions Count",
                "Actions"
              ]}
              tableData={
                countries.map((ele, key) => [
                  key + 1,                  
                    ele.src ? (
                      <img src = {ele.src} className={classes.flagImage} />

                    ): (
                        <img src = {staticURL+ "/countries/" + ele.id + ".png"} className={classes.flagImage} />
                    )
                  ,
                  ele.name,
                  ele.regionsCount,
                  [
                    <Button
              color="success"
              simple
              className={classes.actionButton}
              onClick={editCountries(key)}
              key="0"
            >
              <Edit className={classes.icon} />
            </Button>,
                    <Button
              color="danger"
              simple
              className={classes.actionButton}
              onClick={removeCountries(key)}
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

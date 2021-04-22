import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Category from "@material-ui/icons/Category";
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
import styles from "assets/jss/material-dashboard-pro-react/views/categoriesStyle.js";
import Swal from 'sweetalert2'
import product1 from "assets/img/product1.jpg";
import product2 from "assets/img/product2.jpg";
import product3 from "assets/img/product3.jpg";

const useStyles = makeStyles(styles);

export default function Categories() {
  const [categories, setCategories] = React.useState([]);
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
        const { data } = await authAxios.get("/categories");
        if (data) {
          setCategories(data.map(ele => { return { id: ele.id, name: ele.name, subsCount: ele.subCategories.length, companyCount: ele.users.length } }));
        }
      } catch (err) {
        catchFunc(err);
      }

    })();

  }, []);

  const classes = useStyles();
  const addCategories = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add Category',
      html:
        'Category Image <input type="file" accept="image/*" aria-label="Upload the picture" id="swal-input1" class="swal2-input">' +
        'Category Name <input id="swal-input2" class="swal2-input">',

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
        if (!formValues[0]) {
          enqueueSnackbar("Featured Image is missing!", { variant: 'danger' });
          return;
        }
        const formData = new FormData();
        formData.append("images", formValues[0]);
        formData.set("name", formValues[1]);


        const { data } = await authAxios.post("/category", formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        if (data) {
          let tmp = JSON.parse(JSON.stringify(categories));
          tmp.push({ id: data.id, name: data.name, subsCount: data.subCategories.length, companyCount: data.users.length });
          setCategories(tmp);
          const reader = new FileReader()
          reader.onload = (e) => {
            Swal.fire({
              title: 'A New Category Added',
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
  const editCategories = (key) => async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Category',
      html:
        'Category Image <input type="file" accept="image/*" aria-label="Upload the picture" id="swal-input1" class="swal2-input">' +
        'Category Name <input id="swal-input2" value="' + categories[key].name + '" class="swal2-input">',

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


        const { data } = await authAxios.put("/category/" + categories[key].id, formData,
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
                title: 'A Category modified',
                imageUrl: e.target.result,
                imageAlt: formValues[1]
              });
              let tmp = JSON.parse(JSON.stringify(categories));
              tmp[key].name = formValues[1];
              tmp[key].src = e.target.result;
              setCategories(tmp);
            }
            reader.readAsDataURL(formValues[0])
          } else {
            let tmp = JSON.parse(JSON.stringify(categories));
            tmp[key].name = formValues[1];
            setCategories(tmp);
            enqueueSnackbar("Successfully modified!", { variant: 'success' });
          }

        }
      } catch (err) {
        console.log(err);
        catchFunc(err);
      }

    }
  }
  const removeCategories = (key) => () => {
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
          const { data } = await authAxios.delete("/category/" + categories[key].id);
          if (data) {
            let tmp = JSON.parse(JSON.stringify(categories));
            tmp.splice(key, 1);
            setCategories(tmp);
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Category data has been deleted.',
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
              <Category />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Categories Table <Button onClick={addCategories} className={classes.titleButton} justIcon link size="sm"><PlaylistAdd /></Button></h4>
          </CardHeader>
          <CardBody>
            <Table
              striped
              tableHead={[
                "#",
                "Image",
                "Category Name",
                "Sub Category Count",
                "Company Count",
                "Actions"
              ]}
              tableData={
                categories.map((ele, key) => [
                  key + 1,
                  ele.src ? (
                    <img src={ele.src} className={classes.featuredImage} />

                  ) : (
                      <img src={staticURL + "/categories/" + ele.id + ".png"} className={classes.featuredImage} />
                    )
                  ,
                  ele.name,
                  ele.subsCount,
                  ele.companyCount,
                  [
                    <Button
                      color="success"
                      simple
                      className={classes.actionButton}
                      onClick={editCategories(key)}
                      key="0"
                    >
                      <Edit className={classes.icon} />
                    </Button>,
                    <Button
                      color="danger"
                      simple
                      className={classes.actionButton}
                      onClick={removeCategories(key)}
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

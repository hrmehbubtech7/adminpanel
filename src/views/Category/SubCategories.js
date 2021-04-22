import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Class from "@material-ui/icons/Class";
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
import styles from "assets/jss/material-dashboard-pro-react/views/subCategoriesStyle.js";
import Swal from 'sweetalert2'
import product1 from "assets/img/product1.jpg";
import product2 from "assets/img/product2.jpg";
import product3 from "assets/img/product3.jpg";

const useStyles = makeStyles(styles);

export default function SubCategories() {
  const [categories, setCategories] = React.useState([]);
  const [category, setCategory] = React.useState('');
  const [subCategories, setSubCategories] = React.useState([]);
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
          setCategories(data.map(ele => { return { id: ele.id, name: ele.name } }));
        }
      } catch (err) {
        catchFunc(err);
      }

    })();

  }, []);
  const categorySelect = async (e) => {

    setCategory(e.target.value);
    try {
      const { data } = await authAxios.get("/category/" + e.target.value);
      if (data) {
        setSubCategories(data.subCategories.map(ele => { return { id: ele.id, name: ele.name, products: ele.products.length, buys: ele.buys.length } }));
      }
    } catch (err) {
      console.log(err);
      catchFunc(err);
    }
  }
  const classes = useStyles();
  const addSubCategories = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add Sub Category',
      html:
        'Featured Image <input type="file" accept="image/*" aria-label="Upload the picture" id="swal-input1" class="swal2-input">' +
        'Name <input id="swal-input2" class="swal2-input">',

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
        formData.set("category", category);
        const { data } = await authAxios.post("/sub_category", formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        if (data) {
          let tmp = JSON.parse(JSON.stringify(subCategories));
          tmp.push({ id: data.id, name: data.name, products: 0, buys: 0 });
          setSubCategories(tmp);
          const reader = new FileReader()
          reader.onload = (e) => {
            Swal.fire({
              title: 'A New Sub Category Added',
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
  const editSubCategories = (key) => async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Sub Categories',
      html:
        'Featured Image <input type="file" accept="image/*" aria-label="Upload the picture" id="swal-input1" class="swal2-input">' +
        'Name <input id="swal-input2" value="' + subCategories[key].name + '" class="swal2-input">',

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

        const { data } = await authAxios.put("/sub_category/" + subCategories[key].id, formData,
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
                title: 'A Sub Category modified',
                imageUrl: e.target.result,
                imageAlt: formValues[1]
              });
              let tmp = JSON.parse(JSON.stringify(subCategories));
              tmp[key].name = formValues[1];
              tmp[key].src = e.target.result;
              setSubCategories(tmp);
            }
            reader.readAsDataURL(formValues[0])
          } else {
            let tmp = JSON.parse(JSON.stringify(subCategories));
            tmp[key].name = formValues[1];
            setSubCategories(tmp);
            enqueueSnackbar("Successfully modified!", { variant: 'success' });
          }         
        }
      } catch (err) {
        console.log(err);
        catchFunc(err);
      }

    }
  }
  const removeSubCategories = (key) => () => {
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
          const { data } = await authAxios.delete("/sub_category/" + subCategories[key].id);
          if (data) {
            let tmp = JSON.parse(JSON.stringify(subCategories));
            tmp.splice(key, 1);
            setSubCategories(tmp);
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Sub Category data has been deleted.',
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
              <Class />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Sub Category Table </h4>
          </CardHeader>
          <CardBody>
            <Button disabled={category === ''} onClick={addSubCategories} color="primary" ><PlaylistAdd /> Add Sub Category</Button>
            &nbsp;
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Categories</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                onChange={categorySelect}
              >
                {
                  categories.map((ele, key) => (
                    <MenuItem key={key} value={ele.id}>{ele.name}</MenuItem>
                  ))
                }

              </Select>
            </FormControl>
            <Table
              striped
              tableHead={[
                "#",
                "Image",
                "Sub Category Name",
                "Products",
                "Buy Leads",
                "Actions"
              ]}
              tableData={
                subCategories.map((ele, key) => [
                  key + 1,
                  ele.src ? (
                    <img src={ele.src} className={classes.featuredImage} />

                  ) : (
                      <img src={staticURL + "/sub_categories/" + ele.id + ".png"} className={classes.featuredImage} />
                    )
                  ,
                  ele.name,
                  ele.products,
                  ele.buys,
                  [
                    <Button
                      color="success"
                      simple
                      className={classes.actionButton}
                      onClick={editSubCategories(key)}
                      key="0"
                    >
                      <Edit className={classes.icon} />
                    </Button>,
                    <Button
                      color="danger"
                      simple
                      className={classes.actionButton}
                      onClick={removeSubCategories(key)}
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

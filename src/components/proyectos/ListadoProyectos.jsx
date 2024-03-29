import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
const ListadoProyectos = ({ onProyectoSeleccionado,onProyectoKeySeleccionado }) => {
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState('');
  const [tokenVar, setToken] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [bucketKey, setBucketKey] = useState('');

  const fetchFilters = async () => {
    if (tokenVar) {
        try {
            const response = await fetch('http://localhost:3001/api/bucketsProyectos', {
                headers: {
                    Authorization: `${tokenVar}`
                }
            });
            const data = await response.json();
            console.log(data);
            if (data.length > 0) {
                console.log(data[0]?.bucketKey);
                setBucketKey(data[0]?.bucketKey);
            }
            setProyectos(data);
        } catch (error) {
            console.error('Error al buscar los filtros:', error);
        }
    }
};

  useEffect(() => {
    const fetchToken = async () => {
      try {
        
        const response = await fetch('http://localhost:3001/api/gettoken');
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error('Error al obtener el token:', error);
      }
    };

    fetchToken();
  }, []);

  const handleListItemClick = (proyectoKey, urn) => {
    toast.info('Abriendo Proyecto...'); // Duración en milisegundos
    setProyectoSeleccionado(proyectoKey);
    console.log("URN del proyecto:", urn);
    onProyectoSeleccionado(proyectoKey, urn); // Llamar a la función onProyectoSeleccionado

    // Llamar a translateObject para forzar la traducción del archivo
    translateObject({ id: urn, parents: [bucketKey] });
    onProyectoKeySeleccionado(proyectoKey);
  };

  const handleDeleteButtonClick = () => {
    if (proyectoSeleccionado) {
      console.log('Proyecto seleccionado:', proyectoSeleccionado);
      
        const objectKey = proyectoSeleccionado;
        console.log("datos borrado");
        console.log(bucketKey);
        console.log(objectKey);

          fetch('http://localhost:3001/api/deleteObject', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 'bucketKey': bucketKey, 'objectName': objectKey })
          })
          .then(response => {
              if (response.ok) {
                  return response.json();
              } else {
                  throw new Error('Error al eliminar el objeto');
              }
          })
          .then(data => {
              console.log('Éxito:', data);
              toast.success(`${objectKey} ha sido borrado exitosamente`);
              fetchFilters();
              // Aquí puedes agregar lógica adicional si es necesario
          })
          .catch(error => {
              console.error('Error:', error);
              toast.error(`Error al intentar borrar ${objectKey}`);
              fetchFilters();
              // Aquí puedes agregar lógica adicional si es necesario
          });
      }
          
      

     else {
      toast.error('Debe seleccionar un proyecto antes de eliminarlo');
    }
  };
  
  useEffect(() => {
    const fetchFilters = async () => {
      if (tokenVar) {
        try {
          const response = await fetch('http://localhost:3001/api/bucketsProyectos', {
            headers: {
              Authorization: `${tokenVar}`
            }
          });
          const data = await response.json();
          console.log(data);
          if (data.length > 0) {
            console.log(data[0]?.bucketKey);
            setBucketKey(data[0]?.bucketKey);
          }
          setProyectos(data);
        } catch (error) {
          console.error('Error al buscar los filtros:', error);
        }
      }
    };

    fetchFilters();
  }, [tokenVar]);

  const cardStyle = {
    marginTop: '25px',
    marginLeft: '20px',
    marginRight: '25px',
    borderRadius: '20px',
  };

  const buttonStyle = {
    backgroundColor: '#DA291C',
    color: '#FFF',
    flex: '1',
    marginRight: '5px',
    borderRadius: '10px'
  };
  const handleFileUpload = () => {
    console.log(bucketKey);
    console.log("entro");
    toast.success(` Inicio de proceso de carga`);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.dwg'; // Ajusta los tipos de archivo según tu necesidad
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      // Aquí puedes mostrar un mensaje de carga
      //  showProgress("Ha iniciado el Proceso de carga.. Puede tardar algunos minutos","inprogress");

      const formData = new FormData();
      formData.append('fileToUpload', file);
      formData.append('bucketKey', bucketKey); // Ajusta esto según tu lógica de obtención de la clave del bucket

      try {
        const response = await fetch('http://localhost:3001/api/objects', {
          method: 'POST',
          body: formData,
          processData: false,
          contentType: false
        });
        console.log("respuesta");
        console.log(response);
        if (response.ok) {
          // Aquí puedes actualizar la interfaz o mostrar un mensaje de éxito
          console.log('Archivo subido exitosamente');
          toast.success(`Se ha cargado exitosamente`);
          fetchFilters();
        } else {
          // Aquí puedes manejar el caso de error
          console.error('Error al subir el archivo:', response.statusText);
          toast.error(` Error en el proceso de carga`);
        }
      } catch (error) {
        console.error('Error al subir el archivo:', error);
        toast.error(` Error en el proceso de carga`);
      }
    };
    input.click();
  };

  const translateObject = async (node) => {

   
    var bucketKey = node.parents[0];
    var objectKey = node.id;
    console.log(bucketKey);
    console.log(objectKey);
    try {
      const response = await fetch('http://localhost:3001/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'bucketKey': bucketKey, 'objectName': objectKey })
      });
      console.log(response);
      if (response.ok) {
     
       console.log('Traducción Iniciada, espere unos instantes..');
      } else {
        console.error('Error al intentar traducir:', response.statusText);
      }
    } catch (error) {
      console.error('Error al intentar traducir:', error);
    }
  };

  return (
    <Card style={cardStyle}>
       <ToastContainer />
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="images/proyectosListadoIcn.svg" alt="Icono" style={{ marginRight: '10px' }} />
          <Typography variant="h6" style={{ fontSize: 14, fontWeight: 'bold' }}>
            Proyectos
          </Typography>
        </div>
        <Typography variant="body2" style={{ marginTop: '10px', marginBottom: '35px' }}>
          Directorio de Proyectos Disponibles
        </Typography>
        <div style={{ marginTop: '10px' }}>
          <Button variant="contained" style={buttonStyle} onClick={handleFileUpload}>
            <img src="images/uploadIcn.svg" alt="Upload" style={{ marginRight: '5px' }} />
            Upload
          </Button>
          <Button variant="contained" style={buttonStyle}>
            <img src="images/uploadIcn.svg" alt="Traducir" style={{ marginRight: '5px' }} />
            Traducir
          </Button>
          <Button variant="contained" style={buttonStyle} onClick={handleDeleteButtonClick}>
            <img src="images/uploadIcn.svg" alt="Eliminar" style={{ marginRight: '5px' }} />
            Eliminar
          </Button>
        </div>
        <List>
          {proyectos.map((proyecto, index) => (
            <ListItem
              key={index}
              button
              selected={proyectoSeleccionado === proyecto.objectKey}
              onClick={() => handleListItemClick(proyecto.objectKey, proyecto.urn)}
              style={{
                backgroundColor: proyectoSeleccionado === proyecto.objectKey ? '#DA291C' : 'transparent',
                color: proyectoSeleccionado === proyecto.objectKey ? '#FFF' : 'inherit'
              }}
            >
              <ListItemText primary={proyecto.objectKey} style={{ fontSize: '12px !important' }} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ListadoProyectos;

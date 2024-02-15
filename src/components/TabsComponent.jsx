import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Button } from 'react-bootstrap';
import Select from 'react-select';
import { useVisibility } from '../context/VisibilityContext';
import { useActions } from '../context/ActionContext';
import axios from 'axios';

const customStyles = {
    multiValue: (base) => ({
        ...base,
        backgroundColor: '#DA291C',
        color: 'white',
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: 'white',
    }),
};
const menuStyles = {
    menuPortal: base => ({ ...base, zIndex: 9999 }) // Asegura que el menú sea siempre visible
   , overflowY: 'hidden'
};

const TabComponent = () => {
    //const actions = useActions();
   // const filtrar = actions.filtrar;
    const { filtrar ,cleanModel} = useActions(); // Desestructura directamente la acción "filtrar"
    const { isVisible } = useVisibility();
    const [activeKey, setActiveKey] = useState('filtrosVisuales');
    const [selectedParticionHA, setSelectedParticionHA] = useState([]);
    const [selectedPiso, setSelectedPiso] = useState([]);
    const [opcionesParticionHA, setOpcionesParticionHA] = useState([]);
    const [opcionesPiso, setOpcionesPiso] = useState([]);

    const handleApplyFilterClick = () => {
        if (filtrar) {
            filtrar(selectedParticionHA, selectedPiso);
        } else {
            console.error('La función filtrar no está disponible');
        }
    };

    const handCleanClick =()=>{
        cleanModel();
        setSelectedParticionHA([]);
        setSelectedPiso([]);
    }

    useEffect(() => {
        const fetchFiltros = async () => {
            try {
                // Aquí debes colocar la URN específica que deseas consultar
                const urnEspecifica = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cDJfcHJveWVjdG9zL1BfUnZ0XzIwMjQucnZ0';
                const response = await axios.get(`http://localhost:3001/api/filtrosPorUrn/${urnEspecifica}`);
                console.log("Respuesta Filtros");
                console.log(response.data);
                const filtros = response.data;
                if (filtros.length >= 2) {
                    // Asumiendo que los dos primeros registros contienen los datos para las opciones
                    const opciones1 = Object.keys(filtros[1].filtros).map(key => ({
                        value: key,
                        label: key,
                        isFixed: false
                    }));
                    const opciones2 = Object.keys(filtros[0].filtros).map(key => ({
                        value: key,
                        label: key,
                        isFixed: false
                    }));
                    setOpcionesParticionHA(opciones1);
                    setOpcionesPiso(opciones2);
                }
            } catch (error) {
                console.error('Error al obtener los filtros:', error);
            }
        };

        fetchFiltros();
    }, []); // El array vacío asegura que este efecto se ejecute una vez tras el montaje del componente

    const onSelect = (k) => {
        setActiveKey(k);
    };

    const getTabIcon = (key) => {
        if (key === 'filtrosVisuales') {
            return activeKey === 'filtrosVisuales' ? 'images/eyered.svg' : 'images/eyewhite.svg';
        } else if (key === 'barrasPedidos') {
            return activeKey === 'barrasPedidos' ? 'images/barrasred.svg' : 'images/barraswhite.svg';
        }
    };

    const tabStyle = {
        position: 'fixed',
        top: '35%',
        right: '50px',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        width: '450px',
        height: '385px',
        overflow: 'auto',
        paddingBottom: '520px',
        overflowY: 'hidden'
    };

    const tabContentStyle = {
        backgroundColor: 'white',
        borderRadius: '0 20px 20px 20px',
        padding: '15px',
        height: '100%',
        overflowY: 'hidden'
    };

    const tabHeaderStyle = {
        borderRadius: '30px 30px 0 0',
    };

    const filasContenido = {
        marginTop: '15px'
    };

    const botonFiltroStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px',
    };

    const labelStyle = {
        marginBottom: '10px' // Estilo para el margen inferior de los labels
    };

    return isVisible ? (
        <div style={tabStyle}>
            <Tabs defaultActiveKey="filtrosVisuales" id="tab-component" onSelect={onSelect} style={tabHeaderStyle}>
                <Tab eventKey="filtrosVisuales" title={<span><img src={getTabIcon('filtrosVisuales')} alt="Icono Filtros Visuales" /> Filtros visuales</span>}>
                    <div style={tabContentStyle}>
                        <div className="filasContenido" style={filasContenido}>
                            <label htmlFor="particionHA" style={labelStyle}>Valores para AEC partición HA</label>
                            <Select
                                isMulti
                                options={opcionesParticionHA}
                                value={selectedParticionHA}
                                onChange={setSelectedParticionHA}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={{ ...customStyles, ...menuStyles }}
                                menuPortalTarget={document.body}
                            />
                        </div>
                        <div className="filasContenido" style={filasContenido}>
                            <label htmlFor="piso" style={labelStyle}>Valores para AEC Piso</label>
                            <Select
                                isMulti
                                options={opcionesPiso}
                                value={selectedPiso}
                                onChange={setSelectedPiso}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={{ ...customStyles, ...menuStyles }}
                                menuPortalTarget={document.body}
                            />
                        </div>
                        <div className="filasContenido boton-filtro" style={botonFiltroStyle}>
                            <Button onClick={handleApplyFilterClick} variant="contained" style={{ backgroundColor: '#DA291C', color: 'white' }}>
                                <img src='images/btnfiltrored.svg' alt="Icono Filtros Visuales" />
                               Filtrar
                            </Button>&nbsp;&nbsp;
                            <Button onClick={handCleanClick} variant="contained" style={{ backgroundColor: '#DA291C', color: 'white' }}>
                                <img src='images/btnfiltrored.svg' alt="Icono Filtros Visuales" />
                                Limpiar
                            </Button>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="barrasPedidos" title={<span><img src={getTabIcon('barrasPedidos')} alt="Icono Barras y Pedidos" /> Barras & Pedidos</span>}>
                    <div style={tabContentStyle}>
                        {/* Contenido de la pestaña Barras & Pedidos */}
                    </div>
                </Tab>
            </Tabs>
        </div>
    ) : null;
};

export default TabComponent;

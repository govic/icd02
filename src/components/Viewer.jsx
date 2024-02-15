import React from 'react';
import PropTypes from 'prop-types';
import '../extensions/FiltrosVisuales.js';  
import '../extensions/HandleSelectionExtension.js';
import { ActionsContext } from '../context/ActionContext'; // Ajusta la ruta según sea necesario
import { buscaKeys ,transformJsonToArray,printConsola,consulta_filtro2} from '../utils/ViewerUtils';
const { Autodesk } = window;
var {filtroPiso} ="";
var {filtroHa} ="";

class Viewer extends React.Component {
    static contextType = ActionsContext;
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            identificadoresActual: [],
            runtime: {
                options: null,
                ready: null
            }
        };
        this.container = React.createRef();
        this.viewer = null;
        this.refViewer2 = props.refViewer2
    }

    getForgeToken = () => {
        return fetch('http://localhost:3001/api/gettoken')
            .then(res => res.json())
            .then(data => {
                this.setState({ token: data.token });
                return data.token;
            });
    }
    initializeViewerRuntime = (options, token) => {
        const { runtime } = this.state;
        if (!runtime.ready) {
            runtime.options = { 
                ...options,
                getAccessToken: (callback) => callback(token, 3600)
            };
            runtime.ready = new Promise((resolve) => Autodesk.Viewing.Initializer(runtime.options, resolve));
            this.setState({ runtime });
        } else {
            if (['accessToken', 'getAccessToken', 'env', 'api', 'language'].some(prop => options[prop] !== runtime.options[prop])) {
                return Promise.reject('Cannot initialize another viewer runtime with different settings.');
            }
        }
        return runtime.ready;
    };
    componentDidMount() {
        this.getForgeToken()
            .then(token => {
                return this.initializeViewerRuntime(this.props.runtime || {}, token);
            })
            .then(_ => {
                this.setupViewer();
               
                this.context.registerAction('filtrar', this.filtrar);
                this.context.registerAction('cleanModel', this.cleanModel);
                this.context.registerAction('despliegaSavedVista', this.cleanModel);
               // registerAction('despliegaSavedVista', this.despliegaSavedVista.bind(this));
            })
            .catch(err => console.error(err));
    }
    setupViewer = () => {
        this.viewer = new Autodesk.Viewing.GuiViewer3D(this.container.current);
        this.viewer.start();
        this.viewer.loadExtension('FiltrosVisuales');
        this.viewer.loadExtension('HandleSelectionExtension');
        this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this.onModelLoaded);
        this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onViewerCameraChange);
        this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onViewerSelectionChange);
        this.updateViewerState({});
    }
    onModelLoaded = () => {
        // El modelo ha sido cargado, ahora es seguro llamar a fetchAndProcessFiltros
        this.fetchAndProcessFiltros();
    };
    despliegaSavedVista = (identificadores) => {
        // Lógica para desplegar la vista en el visor utilizando los identificadores
        if (this.viewer) {
            this.viewer.isolate(identificadores);
            this.viewer.fitToView(identificadores, this.viewer.model);
            console.log("Desplegando vista en Viewer con identificadores:", identificadores);
        } else {
            console.error("El visor no está inicializado.");
        }
    };
    cleanModel =() =>{
        this.viewer.isolate();
        this.props.guardarIdentificadores([]);
        this.viewer.fitToView(this.viewer.model);
    }
    filtrar = (parametro1, parametro2) => {
        console.log("FiltrosEnviados");
        let referencia = [];
        let referencia2 = [];
        if(parametro1.length >0 && parametro2.length == 0){ // busca por partición HA
                var resultado_ids =Array();
                resultado_ids.length = 0;
                consulta_filtro2([filtroHa],this.viewer).then((data) => {
                let keys = Object.keys(data);
                let elementos =Array();
                elementos.length = 0;
                let filtros_selec_ha = transformJsonToArray(parametro1);
                elementos = buscaKeys(filtros_selec_ha,keys);
                console.log(filtros_selec_ha);
                console.log(keys);
                console.log(filtroHa);
            // console.log("ELEMENTOS PREVIO PROCESO");
            // console.log(elementos);
                var identificadores=Array();
                identificadores.length = 0;
                referencia.length = 0;
                referencia2.length = 0;
                let dbIds = Array();
                dbIds.length = 0;
        
            if(elementos.length == 0 && elementos.length && elementos){
            //    // // // // // // // // // alert("No hay resultados");
            }else{
                //  console.log("FILTRADOS PINTAR "+elementos.length);
                for(var a = 0; a<elementos.length;a++){
                    if(a==0){
                        dbIds = data[keys[elementos[a]]].dbIds;              
                        referencia.push(dbIds);
                        referencia2.push(dbIds);
                        identificadores = dbIds;
                    }
                    else{
                        referencia.push((data[keys[elementos[a]]].dbIds));
                        referencia2.push((data[keys[elementos[a]]].dbIds));
                        identificadores = dbIds.concat(data[keys[elementos[a]]].dbIds);
        
                        dbIds = identificadores;
                    }
                }
                resultado_ids = referencia;
            }
            this.viewer.isolate(identificadores);
            console.log(identificadores);
            this.props.guardarIdentificadores(identificadores);
            console.log(typeof identificadores);
            /// console.log("IDENTIFICADORES");
            /// console.log(identificadores);
            this.viewer.fitToView(identificadores, this.viewer.model);
                  })
        }
        if(parametro1.length==0 && parametro2.length > 0){ // busca por partición piso
            console.log("filtro piso");
            var resultado_ids =Array();
            resultado_ids.length = 0;
            consulta_filtro2([filtroPiso],this.viewer).then((data) => {
                console.log(data);
            let keys = Object.keys(data);
            let elementos =Array();
            elementos.length = 0;
            let filtros_selec_piso = transformJsonToArray(parametro2);
            console.log(keys);
            elementos = buscaKeys(filtros_selec_piso,keys);
            console.log(filtros_selec_piso);
            console.log(keys);
            console.log(filtroPiso);
        // console.log("ELEMENTOS PREVIO PROCESO");
        // console.log(elementos);
            var identificadores=Array();
            identificadores.length = 0;
            referencia.length = 0;
            referencia2.length = 0;
            let dbIds = Array();
            dbIds.length = 0;
    
        if(elementos.length == 0 && elementos.length && elementos){
        //    // // // // // // // // // alert("No hay resultados");
        }else{
            //  console.log("FILTRADOS PINTAR "+elementos.length);
            for(var a = 0; a<elementos.length;a++){
                if(a==0){
                    dbIds = data[keys[elementos[a]]].dbIds;              
                    referencia.push(dbIds);
                    referencia2.push(dbIds);
                    identificadores = dbIds;
                }
                else{
                    referencia.push((data[keys[elementos[a]]].dbIds));
                    referencia2.push((data[keys[elementos[a]]].dbIds));
                    identificadores = dbIds.concat(data[keys[elementos[a]]].dbIds);
    
                    dbIds = identificadores;
                }
            }
            resultado_ids = referencia;
        }
        this.viewer.isolate(identificadores);
        console.log(identificadores);
        this.props.guardarIdentificadores(identificadores);
        /// console.log("IDENTIFICADORES");
        /// console.log(identificadores);
        this.viewer.fitToView(identificadores, this.viewer.model);
              })

        }
        if(parametro1.length>0 && parametro2.length > 0){ // busqueda mixta
            var resultado_ids;
            let filtros_selec_piso = transformJsonToArray(parametro2);
            let filtros_selec_ha = transformJsonToArray(parametro1);
            console.log(filtros_selec_piso);
            console.log(filtros_selec_ha);
            consulta_filtro2([filtroPiso,filtroHa],this.viewer,filtros_selec_ha,filtros_selec_piso).then((data) => {
             let keys = Object.keys(data);
             let elementos =[];
             console.log(data);
             console.log( keys);
             elementos = buscaKeys(filtros_selec_piso,keys);
             var identificadores =0;
             let dbIds =0;
            
             if(elementos.length == 0){
           //    // // // // // // // // // alert("No hay resultados");
             }else{
               for(var a = 0; a<elementos.length;a++){
                    if(a==0){
                      dbIds = data[keys[elementos[a]]].dbIds;              
                      referencia.push(dbIds);
                      referencia2.push(dbIds);
                      identificadores = dbIds;
                    }
                    else{
                      referencia.push((data[keys[elementos[a]]].dbIds));
                      referencia2.push((data[keys[elementos[a]]].dbIds));
                      identificadores = dbIds.concat(data[keys[elementos[a]]].dbIds);
       
                      dbIds = identificadores;
                    }
               }
       
               resultado_ids = referencia;
       
             }
             this.viewer.isolate(identificadores);
             console.log(identificadores);
             this.props.guardarIdentificadores(identificadores);
             this.viewer.fitToView(identificadores, this.viewer.model);
        }
        )}
        
    };
    fetchAndProcessFiltros = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/filtros');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const filtrosData = await response.json();
            
            for (const filtro of filtrosData) {
                let resultadoFiltro,resultadoFiltro2;
                console.log(filtro);
               

                if (filtro.filtro_2) {
                    console.log("Filtro 2");
                    console.log(filtro.filtro_2);
                    resultadoFiltro2 = await this.consultaFiltro([filtro.filtro_2]);
                    filtroPiso = filtro.filtro_2;
                    console.log("Resultado Filtro creacion");
                    console.log( resultadoFiltro2);
                    const objetoAInsertar = {
                        id: filtro.id, // Asume que tienes un campo 'id' en filtrosData
                        nombre: filtro.filtro_2, // Asume que tienes un campo 'nombre' en filtrosData
                        urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cDJfcHJveWVjdG9zL1BfUnZ0XzIwMjQucnZ0', // Asume que tienes un campo 'urn' en filtrosData
                        filtros: resultadoFiltro2
                    };
                    console.log("objeto 1");
                    console.log(objetoAInsertar);
                    // Insertar en la base de datos
                    await fetch('http://localhost:3001/api/filtrosOpcionesProyecto', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(objetoAInsertar),
                    });

                }
                if (filtro.filtro_1) {
                    filtroHa = filtro.filtro_1;
                    console.log("Filtro 1");
                    console.log(filtro.filtro_1);
                    resultadoFiltro = await this.consultaFiltro([filtro.filtro_1]);
                    console.log("Resultado Filtro creacion");
                    console.log(resultadoFiltro);
                   
                    console.log();
                    const objetoAInsertar2 = {
                        id: 102, // Asume que tienes un campo 'id' en filtrosData
                        nombre: ''+filtro.filtro_1, // Asume que tienes un campo 'nombre' en filtrosData
                        urn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cDJfcHJveWVjdG9zL1BfUnZ0XzIwMjQucnZ0', // Asume que tienes un campo 'urn' en filtrosData
                        filtros: resultadoFiltro
                    };
                    console.log("objeto 2");
                    console.log(objetoAInsertar2);
                    // Insertar en la base de datos
                    await fetch('http://localhost:3001/api/filtrosOpcionesProyecto', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(objetoAInsertar2),
                    });
                }
                // Preparar el objeto a insertar
                
            }
        } catch (error) {
            console.error('Error al obtener o procesar filtros:', error);
        }
    };
    

    consultaFiltro = (filtros) => {
        return new Promise((resolve, reject) => {
            if (!this.viewer || !this.viewer.model) {
                reject(new Error("El modelo del visualizador no está cargado."));
                return;
            }
            this.viewer.model.getBulkProperties([], filtros, (result) => {
                let data = {};
                // ... procesamiento de los resultados
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    };

    componentWillUnmount() {
        if (this.viewer) {
            this.viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this.onModelLoaded);
            this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onViewerCameraChange);
            this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onViewerSelectionChange);
            this.viewer.finish();
            this.viewer = null;
        }
    }
    
    componentDidUpdate(prevProps) {
        if (this.viewer && this.props.urn !== prevProps.urn) {
            Autodesk.Viewing.Document.load(
                'urn:' + this.props.urn,
                (doc) => this.viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()),
                (code, message, errors) => console.error(code, message, errors)
            );
        }
    }

    updateViewerState = (prevProps) => {
        const token = this.state.token;
        if (this.props.urn && this.props.urn !== prevProps.urn) {
            Autodesk.Viewing.Document.load(
                'urn:' + this.props.urn,
                (doc) => this.viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()),
                (code, message, errors) => console.error(code, message, errors)
            );
        }
    };

    onViewerCameraChange = (event) => {
        // Manejar el cambio de la cámara del visor aquí si es necesario
    };

    onViewerSelectionChange = (event) => {
        // Manejar el cambio de la selección del visor aquí si es necesario
    };

    render() {
        return <div ref={this.container} style={{ width: '100%', height: '100%' }} />;
    }
}

Viewer.propTypes = {
    urn: PropTypes.string.isRequired,
    runtime: PropTypes.object,
    refViewer2: PropTypes.object,
    guardarIdentificadores: PropTypes.func
};

export default Viewer;

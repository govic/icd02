import React, { useEffect, useState } from 'react';
import ViewerProyectos from './proyectos/ViewerProyectos';
import HeaderApp from './HeaderApp';
import ListadoProyectos from './proyectos/ListadoProyectos';
import AdministracionProyectos from './proyectos/AdministracionProyecto';

const Proyectos = ({ token, selectedIds, onCameraChange, onSelectionChange, refViewer }) => {
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [proyectoKeySeleccionado, setProyectoKeySeleccionado] = useState(null);
    const estiloProyectos = {
        backgroundColor: '#D8D8D8',
        padding: '10px',
        height: 'calc(100vh - 64px)',
        overflowY: 'scroll',
    };

    const estiloViewerContainer = {
        maxWidth: '400px', // Ancho máximo del contenedor
        height: '90%' // Altura máxima del contenedor
       
    };

    const estiloAdministracionProyecto = {
       
     
        marginTop: '5px',
        
    };

    const handleProyectoSeleccionado = (proyectoKey, urn) => {
        setProyectoSeleccionado({ proyectoKey, urn });
    };

    useEffect(() => {
        const actualizarEstiloViewer = () => {
            const viewerElement = document.querySelector('.adsk-viewing-viewer');
            if (viewerElement) {
                viewerElement.style.height = '400px'; // Ajusta la altura
                viewerElement.style.width = '100%'; // Ajusta el ancho al 100% del contenedor
                viewerElement.style.overflow = 'hidden';
                viewerElement.style.marginTop = '25px';
            }
        };

        actualizarEstiloViewer(); // Aplicar estilo al montar el componente

        window.addEventListener('resize', actualizarEstiloViewer); // Aplicar estilo en cambios de tamaño de ventana

        return () => {
            window.removeEventListener('resize', actualizarEstiloViewer); // Limpiar event listener al desmontar el componente
        };
    }, []);

    return (
        <div>
            <HeaderApp  proyectoKey={proyectoKeySeleccionado}/>
            <div style={estiloProyectos}>
           
                <div className='row'>

                    <div className='col-4'>
                        <ListadoProyectos onProyectoSeleccionado={handleProyectoSeleccionado} 
                                          onProyectoKeySeleccionado={setProyectoKeySeleccionado}
                        />
                    </div>
                    <div className='col-8'>
                        <div className='row'>
                            <div className='col-6' style={estiloViewerContainer}>
                                <div >
                                    <ViewerProyectos
                                        className="custom-viewer"
                                        runtime={{ accessToken: token }}
                                        urn={proyectoSeleccionado ? proyectoSeleccionado.urn : "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cDJfcHJveWVjdG9zL1BfUnZ0XzIwMjQucnZ0"}
                                        selectedIds={selectedIds}
                                        onCameraChange={onCameraChange}
                                        onSelectionChange={onSelectionChange}
                                        ref={refViewer}
                                        refViewer2={refViewer}
                                       
                                    />
                                </div>
                            </div>
                            <div className='col-6' style={estiloAdministracionProyecto}>
                                <AdministracionProyectos />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Proyectos;

import React, { useRef ,useState} from 'react';
import Viewer from './Viewer';
import TabsComponent from './TabsComponent';
import AdministradorDeVistas from './visualizador/AdministradorDeVistas';
import Paleta from './visualizador/Paleta';
import HeaderApp from './HeaderApp';
import { ActionsProvider } from '../context/ActionContext';

const ColumnaDerecha = ({ isCollapsed, token, urn, selectedIds, onCameraChange, onSelectionChange, refViewer }) => {
    const estiloColapsado = {
        width: '100%',
    };

    const estiloExpandido = {
        width: '100%',
    };

    const estiloActual = isCollapsed ? estiloColapsado : estiloExpandido;
    const tabsRef = useRef(null);
    const refViewer2 = useRef({refViewer});
    const [identificadoresActual, setIdentificadoresActual] = useState([]);

    const guardarIdentificadores = (identificadores) => {
        setIdentificadoresActual(identificadores);
    };
    return (
        <div style={estiloActual}>
        
            <HeaderApp /> {/* Instancia el componente HeaderApp aquí */}
            <ActionsProvider  viewerRef={refViewer}>
                    <div style={{ position: 'fixed', top: '64px', width: '100%', height: '88%', marginBottom: '30px' }}>
                        <Viewer
                            runtime={{ accessToken: token }}
                            urn={"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cDJfcHJveWVjdG9zL1BfUnZ0XzIwMjQucnZ0"}
                            selectedIds={selectedIds}
                            onCameraChange={onCameraChange}
                            onSelectionChange={onSelectionChange}
                            ref={refViewer}
                            refViewer2={refViewer}
                            guardarIdentificadores={guardarIdentificadores} // Pasar la función para guardar identificadores
                        />
                        <div ref={tabsRef}>
                            <TabsComponent /> {/* Instanciar TabsComponent */}
                        </div>
                        <AdministradorDeVistas tabsRef={tabsRef}  identificadoresActual={identificadoresActual} refViewer2={refViewer2} /> {/* Pasar la ref a AdministradorDeVistas */}
                        <Paleta /> {/* Instanciar Paleta aquí */}
                    </div>

            </ActionsProvider>
          
        </div>
    );
};

export default ColumnaDerecha;

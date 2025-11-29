import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import { BitacoraAuditoria, EstadisticasAuditoria } from '../../componentes/auditoria';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`auditoria-tabpanel-${index}`}
            aria-labelledby={`auditoria-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

const Auditoria = () => {
    const [tabActual, setTabActual] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setTabActual(newValue);
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Paper elevation={3}>
                <Tabs
                    value={tabActual}
                    onChange={handleChangeTab}
                    aria-label="Auditoría tabs"
                    sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
                >
                    <Tab label="Bitácora de Logs" id="auditoria-tab-0" />
                    <Tab label="Estadísticas" id="auditoria-tab-1" />
                </Tabs>
            </Paper>

            <TabPanel value={tabActual} index={0}>
                <BitacoraAuditoria />
            </TabPanel>

            <TabPanel value={tabActual} index={1}>
                <EstadisticasAuditoria />
            </TabPanel>
        </Box>
    );
};

export default Auditoria;

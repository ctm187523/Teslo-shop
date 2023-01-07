

import { AttachMoneyOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import React from 'react'
import useSWR from 'swr';
import { SummaryTile } from '../../components/admin';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { DashboardSummaryResponse } from '../../interfaces';
import { useState, useEffect } from 'react';


const DashboardPage = () => {

    //usamos el Hook SWR para hacer las peticiones a los endpoints
    //le decimos con refreshInterval que cada 30 segundos refresque la informacion
    //useSWR esta tipado con la interfaz creada en interfaces/dashboard
    const { data, error} = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30 * 1000 //30 segundos
    });

    //useState para ir variando el tiempo de refresco de la informacion
    const [refreshIn, setRefreshIn] = useState(30);

    //useEffect para controlar el tiempo de refesco de la informacion, no usamos dependencia
    useEffect(() => {
        
        //ponemos en un segundo el setInterval y cada segundo variamos
        //el valor del setRefreshIn
        const interval = setInterval(() => {
            setRefreshIn( refreshIn => refreshIn >0 ? refreshIn -1 : 30 )
        }, 1000);

        //usamos el return para que se limpie la constante interval cuando ya no se use esta funcion
        //si navegamos a otra pagina deja de usar el useEffect
        return () => clearInterval(interval) 
    }, []);

    //si no tenemos error pero tampoco tenemos data devolvemos un fragmento vacio
    //o podriamos poner cargando hasta que tengamos la data
    if( !error && !data){
        return <></>
    }

    //en caso de error
    if ( error ){
        console.log(error);
        return <Typography>Error al cargar la infromación</Typography>
    }

    //desestructuramos la data, al final de data ponemos el signo de admiracion
    //para asegurar que siempre vendra la data
    const { 
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrders,
    } = data!;

    return (
        <AdminLayout
            title="Dashboard"
            subTitle="Estadisticas generales"
            icon={<DashboardOutlined />}
        >
            <Grid container spacing={2}>

                {/* añadimos componentes SummaryTile creados en  componentes/admin/SummaryTile 
                para crear las diferentes tarjetas que contiene el Dashboard*/}
                <SummaryTile
                    title={ numberOfOrders }
                    subTitle="Ordenes totales"
                    icon={<CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={ paidOrders }
                    subTitle="Ordenes pagadas"
                    icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={ notPaidOrders }
                    subTitle="Ordenes pendientes"
                    icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
                />
                <SummaryTile
                    title={ numberOfClients }
                    subTitle="Clientes"
                    icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
                />

                <SummaryTile
                    title={ numberOfProducts }
                    subTitle="Productos"
                    icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
                />
                 <SummaryTile
                    title={ productsWithNoInventory }
                    subTitle="Sin existencias"
                    icon={ <CancelPresentationOutlined color="error" sx={{ fontSize:40}}/>}
                />
                 <SummaryTile
                    title={ lowInventory }
                    subTitle="Bajo inventario"
                    icon={ <ProductionQuantityLimitsOutlined  color="warning" sx={{ fontSize:40}}/>}
                />
                 <SummaryTile
                    //con refreshIn mostramos los segundos que quedan para el proximo refresco de la informacion
                    title={ refreshIn }
                    subTitle="Actualización en:"
                    icon={ <AccessTimeOutlined  color="secondary" sx={{ fontSize:40}}/>}
                />

            </Grid>
        </AdminLayout>
    )
}

export default DashboardPage

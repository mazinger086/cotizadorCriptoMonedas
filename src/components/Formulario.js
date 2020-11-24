import React, { useState, useEffect} from 'react';
import styled from '@emotion/styled';
import useMoneda from '../Hooks/useMoneda.js';
import useCriptoMoneda from '../Hooks/useCriptoMoneda.js';
import Error from './Error';
import axios from 'axios';

const Boton = styled.input`
    margin-top:20px;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    background-color: #66a2fe;
    border: none;
    width: 100%;
    border-radius: 10px;
    color: #fff;
    transition: background-color .3s ease;

    &:hover {
        background-color: #326AC0;
        cursor: pointer;        
    }
`;

const Formulario = ({guardarMoneda, guardarCriptomoneda}) => {

    //state del listado de Criptomonedas

    const [listacripto, guardarCriptoMonedas] = useState([]);
    const [error, guardarError] = useState(false);

    const MONEDAS = [
        { codigo: 'USD', nombre: 'Dolar Americano'},
        { codigo: 'EUR', nombre: 'Euro'},
        { codigo: 'ARS', nombre: 'Peso Argentino'},        
        { codigo: 'GBP', nombre: 'Libra Esterlina'}
    ]

    //utilizar useMoneda
    const [moneda, SelectMonedas, actualizarState] = useMoneda('Elige tu Moneda ','', MONEDAS);

    //Utilizar UseCriptomoneda
    const [criptomoneda, SelectCripto] = useCriptoMoneda('Elige tu Criptomoneda', '', listacripto);

    //Ejecutar llamado a la API

    useEffect(()=>{
       const consultarAPI = async () =>{
           const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;
           const resultado = await axios.get(url);

           guardarCriptoMonedas(resultado.data.Data);
       }
       consultarAPI();
    },[]);

    //Cuando el user hace submit

    const cotizarMoneda = e =>{
        e.preventDefault();

        //validar si ambos campos estan llenos
        if(moneda === '' || criptomoneda === ''){
            guardarError(true);
            return;
        }

        //pasar datos al componente principal
        guardarError(false);
        guardarMoneda(moneda);
        guardarCriptomoneda(criptomoneda);

    }

    return ( 
        <form 
            onSubmit={cotizarMoneda}>

            {error ? <Error mensaje='Todos los campos son obligatorios'/> : null}

            <SelectMonedas />

            <SelectCripto />

            <Boton
                type="submit"
                value="Calcular"
            />
        </form>
     );
}
 
export default Formulario;
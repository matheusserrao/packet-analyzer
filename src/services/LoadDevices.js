import axios from 'axios'

const loadDevices = async () => {

    const response = await axios
                                .get('http://flex.grupoicts.com.br/crud/energy/devices/lean')
                                .catch(error => {
                                    console.log(error)
                                    alert('Ocorreu um error ao tentar buscar por dispositivos')
                                    return []
                                })
    
    if (response.status === 200){
        
        return response.data.map(device => {
            const {name, config} = device
            if (name && config && config.idLora){
                return {name, id: config.idLora}
            }
        })

    }


    return []
}

export default loadDevices
const mongoose = require('mongoose');


const dbConnection = async () =>{
    try {
        await mongoose.connect( process.env.dv_cn, {
            //no necesario a partir de mongoose 6
            
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true

        });

        console.log('DB Online')
        
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar la base de datos')
    }
}


module.exports = {
    dbConnection
}
const jwt = require('jsonwebtoken')


//creamos una funcion que va a generar un JWT, tiene como args
//uid: UserID
//name: nombre del usuario
//email: email del usuario
const generarJWT = ( uid, name, email ) =>{

    const payload = {uid, name, email};

    //va a regresar una promesa
    return new Promise( (resolve, reject) => {
        //jwt sign toma como arg el payload que es lo que se va a encriptar 
        //y la contraseña de encriptacion que la tenemos definida en env
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            //esta expira en 24h
            expiresIn: '24h'
        },(err, token) =>{
            
            if (err){
                //si ocurre un error
                console.log(err)
                reject(err)
            }else{
                //si todo salio bien
                resolve( token )
            }
    
        })
    


    })

}

module.exports = {
    generarJWT
}
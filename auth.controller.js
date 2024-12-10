const express = require(`express`)
const md5 = require(`md5`)
const jwt = require(`jsonwebtoken`)
const userModel = require(`../models/index`).user

const authenticate = async(request, response) => {

    let dataLogin = {
        username: request.body.username,
        password: md5(request.body.password)
    }

    let dataUser = await userModel.findOne({ where: dataLogin })

    if(dataUser){
        let payload = JSON.stringify(dataUser)

        let secret = `ekongenep`
        let token = jwt.sign(payload, secret)

        return response.json({
            status: true,
            logged: true,
            message: `Authentication Succesed`,
            token: token,
            data: dataUser
        })
    }
    
    return response.json({
        success: false,
        logged: false,
        message: `Auth Failed, username or password invalid`
    })
}

const authorize = (req, response, next) => {
    let headers = req.headers.authorization
    let tokenkey = headers && headers.split(" ")[1]

    if (tokenkey == null) {
        return response.json({
            success: false,
            message: `Unauthorized User`
        })
    }

    let secret = `ekongenep`

    jwt.verify(tokenkey, secret, (error, user) => {
        if (error) {
            return response.json({
                success: false,
                message: `invalid token`
            })
        }
    })

    next()
}

module.exports = {authenticate, authorize}
const userModel = require(`../models/index`).user
const Op = require('sequelize').Op
const md5 = require('md5')
exports.getAlluser = async (request, response) => {
    let users = await userModel.findAll()
    return response.json({
        success: true,
        data: users,
        message: `All users have been loaded`
    })
}
exports.findUser = async (request, response) => {
    let keyword = request.body.keyword

    let users = await userModel.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.substring]: keyword} },
                { username: { [Op.substring]: keyword} },
                { password: { [Op.substring]: keyword} },
                { role: { [Op.substring]: keyword} }
            ]}

    })

    return response.json({
        success: true,
        data: users,
        message: `All users have been loaded`
    })
}
exports.addUser = (request, response) => {
    let newUser = {
        name: request.body.name,
        username: request.body.username,
        password: md5(request.body.password),
        role: request.body.role
    }
    userModel.create(newUser)
    .then(result => {
        return response.json({
            status: true,
            data: result,
            message: `Pengguna berhasil ditambahkan`
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}
exports.updateUser = (request, response) => {
    let userData = {
        name: request.body.name,
        username: request.body.username,
        password: md5(request.body.password),
        role: request.body.role
    }
    let idUser = request.params.id
    userModel.update(userData, { where: { id: idUser } }).then(() => {
        userModel.findOne({ where: { id: idUser } }).then(updatedUser => {
            let userData = {
                id: updatedUser.id,
                name: updatedUser.name,
                username: updatedUser.username,
                role: updatedUser.role
            }
            return response.json({
                status: 'success',
                message: `Pengguna berhasil diubah`,
                data: userData
            })
        })
        .catch(error => {
            return response.json({
                status: 'error',
                message: `Gagal mengambil data pengguna setelah update`,
                error: error.message
            })
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}
exports.getUserById = async (request, response) => {
    const { id } = request.params
    let userData = await userModel.findOne({ where: { id: id } })
    if (!userData) {
        return res.status(404).json({
            success: false,
            message: `user with ID ${id} not found`
        })
    }
    userData = {
        id: userData.id,
        name: userData.name,
        username: userData.username,
        role: userData.role
    }

    return response.json({
        status: true,
        data: userData
    })
}
exports.deleteUser = (request, response) => {
    let idUser = request.params.id
    userModel.destroy({ where: {id: idUser} })
    .then(result => {
        return response.json({
            success: true,
            message: `Data user has been deleted`,
        })
    })
    .catch(error =>{
       return response.json({
        success: false,
        message: error.message
       }) 
    })
}

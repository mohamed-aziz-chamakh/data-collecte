const knex = require('../../migrations')

module.exports = {
    async index(req, res) {
        const results = await knex('sensor').where('deleted_at', null)

        return res.json(results)
    },

    async create(req, res, next) {
        try {
            const { name,description,type,status } = req.body

            await knex('sensor').insert({ name,description,type,status })
            
            return res.status(201).send()
        } catch (error) {
            next(error)
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params
            const { name } = req.body

            await knex('users').update({ name }).where({ id })

            return res.send()
        } catch (error) {
            next(error)
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params

            await knex('sensor').where({ id }).update('deleted_at', new Date())

            return res.send()
        } catch (error) {
            next(error)
        }
    }
}
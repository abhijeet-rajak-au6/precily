const Data = require("../Model/Data");
const Count = require("../Model/Count");

module.exports = {
    async addData(req, res) {
        try {
            const NS_PER_SEC = 1e9;
            const MS_PER_NS = 1e-6
            const time = process.hrtime();
            const payload = req.body;
            console.log("payload", payload);
            const data = await Data.create({
                name: payload.name
            });
            const diff = process.hrtime(time);
            return res.status(200).json({
                message: "success",
                executionTime: (diff[0] * NS_PER_SEC + diff[1]) * MS_PER_NS
            })

        } catch (error) {
            return res.status(500).json({
                message: "error",
                error: error.message
            })
        }
    },

    async listData(req, res) {
        try {

            const NS_PER_SEC = 1e9;
            const MS_PER_NS = 1e-6
            const time = process.hrtime();

            const data = await Data.find();
            const diff = process.hrtime(time);

            return res.status(200).json({
                message: "success",
                data: data,
                executionTime: (diff[0] * NS_PER_SEC + diff[1]) * MS_PER_NS
            })

        } catch (error) {
            return res.status(500).json({
                message: "error",
                error: error.message
            })
        }
    },

    async updateCount(req, res) {
        try {

            const NS_PER_SEC = 1e9;
            const MS_PER_NS = 1e-6
            const time = process.hrtime();

            const count = await Count.find();
            if (count.length)
                await Count.updateOne({}, { count: count[0].count + 1, height: req.body.height }, { new: true });
            else {
                await Count.create({
                    count: 1,
                    height: req.body.height
                })
            }
            const diff = process.hrtime(time);

            return res.status(200).json({
                message: "success",
                executionTime: (diff[0] * NS_PER_SEC + diff[1]) * MS_PER_NS
            })
        } catch (error) {
            return res.status(500).json({
                message: "error",
                error: error.message
            })
        }
    },

    async getCount(req, res) {
        try {
            const count = await Count.find();
            return res.status(200).json({
                message: "success",
                count
            })
        } catch (error) {
            return res.status(500).json({
                message: "error",
                error: error.message
            })
        }
    },
    async updateData(req, res) {
        try {
            const updated = await Data.updateOne({ _id: req.params.id }, { name: req.body.updatedName }, { new: true });
            if (updated.n && updated.nModified) {
                return res.status(200).json({
                    message: "success",
                })
            } else {
                return res.status(200).json({
                    message: "already updated"
                })
            }
        } catch (error) {
            return res.status(500).json({
                message: "error",
                error: error.message
            })
        }
    }
}
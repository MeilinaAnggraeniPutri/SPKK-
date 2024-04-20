const Jabatan = require('../models/jabatan');
const Pegawai = require('../models/pegawai');
const Penilaian = require('../models/penilaian');
const Category = require('../models/category');

class categoryController{

    static async index(req, res, next){
        const category = await Category.find();
        
        res.render('category/index', { category });
    }

    static async createCategory(req, res, next){
        const {name} = req.body;
        const category = new Category({name});
        console.log(category);
        await category.save();
        res.redirect(`/addPenilaian`);
    }

    static async deleteCategory(req, res, next){
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.redirect(`/addPenilaian`);
    }
}

module.exports = categoryController;
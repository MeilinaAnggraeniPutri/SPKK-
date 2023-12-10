const Jabatan = require('../models/jabatan');
const Pegawai = require('../models/pegawai');
const Penilaian = require('../models/penilaian');
const Category = require('../models/category');

class categoryController{

    static async index(req, res, next){
        // let page = parseInt(req.query.page) || 1;
        // if(page < 1) page = 1;
        // const limit = 5;
        // const skip = (page - 1) * limit;
        
        // const totalCategory = await Category.countDocuments();
        // const totalPages = Math.ceil(totalCategory / limit);
        
        // const category = await Category.find().skip(skip).limit(limit);
        const category = await Category.find();
        
        res.render('penilaian/addCategory', { category });
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
const Jabatan = require('../models/jabatan');
const Pegawai = require('../models/pegawai');
const Penilaian = require('../models/penilaian');
const Category = require('../models/category');

class categoryController{

    static async index(req, res, next){
        try {
            if (req.session.isLogin) {
                const category = await Category.find();
        
                res.render('category/index', { category });
            } else {
                res.redirect('/login');
            }
        } catch (e) {
            next(e);
        }
    }

    static async addCategory(req, res, next) {
        try {
          if (req.session.isLogin) {
            res.render('category/addCategory');
         } else {
            res.redirect('/login');
          }
        } catch (e) {
          next(e);
        }
    }

    static async createCategory(req, res, next){
        try {
            const {name, categoryType, weight} = req.body;
            var subCriterias = [];
            var maxValues = [];
            var documents = [];
    
            const banyakSubCriteria = req.body['banyakSubCriteria'];
            const banyakDokumen = req.body['banyakDokumen'];
    
            for (var i = 0; i < banyakSubCriteria; i++) {
                var subCriteria = req.body[`subCriterias-${i}`];
                var maxValue = req.body[`maxValues-${i}`];
    
                subCriterias.push(subCriteria);
                maxValues.push(maxValue);
            }
    
            for (var i = 0; i < banyakDokumen; i++) {
                var document = req.body[`document-${i}`];
    
                documents.push(document);
            }
    
            const category = new Category({name, subCriterias, maxValues, documents, categoryType, weight});
            await category.save();
            res.redirect(`/category`);
        } catch (e) {
            next(e);
        }
    }

    static async editCategory(req, res, next) {
        try {
          if (req.session.isLogin) {
            const categoryId = req.params.id;
            const category = await Category.findById(categoryId);
            res.render('category/editCategory', { category });
          } else {
            res.redirect('/login');
          }
        } catch (e) {
          next(e);
        }
    }

    static async updateCategory(req, res, next){
        try {
            const {idCategory, name, categoryType, weight} = req.body;
            var subCriterias = [];
            var maxValues = [];
            var documents = [];
    
            const banyakSubCriteria = req.body['banyakSubCriteria'];
            const banyakDokumen = req.body['banyakDokumen'];
    
            for (var i = 0; i < banyakSubCriteria; i++) {
                var subCriteria = req.body[`subCriterias-${i}`];
                var maxValue = req.body[`maxValues-${i}`];
    
                subCriterias.push(subCriteria);
                maxValues.push(maxValue);
            }
    
            for (var i = 0; i < banyakDokumen; i++) {
                var document = req.body[`document-${i}`];
    
                documents.push(document);
            }
    
            const category = await Category.findByIdAndUpdate(idCategory, {name, subCriterias, maxValues, documents, categoryType, weight});

            res.redirect(`/category`);
        } catch (e) {
            next(e);
        }
    }

    static async detailCategory(req, res, next) {
        try {
            if (req.session.isLogin) {
                const categoryId = req.params.id;
                const category = await Category.findById(categoryId);
                res.render('category/detailCategory', { category });
            } else {
                res.redirect('/login');
            }
        } catch (e) {
            next(e);
        }
    }

    static async deleteCategory(req, res, next){
        try {
            const { id } = req.params;
            await Category.findByIdAndDelete(id);
            res.redirect(`/category`);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = categoryController;
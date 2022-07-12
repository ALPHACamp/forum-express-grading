const router = require('express').Router()
const categoryController = require('../../controllers/category-controller')

router.get('/:id', categoryController.getCategories)
router.put('/:id', categoryController.putCategory)
router.delete('/:id', categoryController.deleteCategory)
router.post('/', categoryController.postCategory)
router.get('/', categoryController.getCategories)

module.exports = router

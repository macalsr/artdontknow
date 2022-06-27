const db = require('../db/models');
const Sketch_bookDBApi = require('../db/api/sketch_book');

module.exports = class Sketch_bookService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await Sketch_bookDBApi.create(data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let sketch_book = await Sketch_bookDBApi.findBy({ id }, { transaction });

      if (!sketch_book) {
        throw new ValidationError('sketch_bookNotFound');
      }

      await Sketch_bookDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return sketch_book;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      if (currentUser.role !== 'admin') {
        throw new ValidationError('errors.forbidden.message');
      }

      await Sketch_bookDBApi.remove(id, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Sketch_bookDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const sketch_book = await db.sketch_book.create(
      {
        id: data.id || undefined,

        sketches: data.sketches || null,
        createdDate: data.createdDate || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return sketch_book;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const sketch_book = await db.sketch_book.findByPk(id, {
      transaction,
    });

    await sketch_book.update(
      {
        sketches: data.sketches || null,
        createdDate: data.createdDate || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return sketch_book;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const sketch_book = await db.sketch_book.findByPk(id, options);

    await sketch_book.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await sketch_book.destroy({
      transaction,
    });

    return sketch_book;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const sketch_book = await db.sketch_book.findOne(
      { where },
      { transaction },
    );

    if (!sketch_book) {
      return sketch_book;
    }

    const output = sketch_book.get({ plain: true });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.sketches) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('sketch_book', 'sketches', filter.sketches),
        };
      }

      if (filter.createdDate) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'sketch_book',
            'createdDate',
            filter.createdDate,
          ),
        };
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = await db.sketch_book.findAndCountAll({
      where,
      include,
      distinct: true,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order:
        filter.field && filter.sort
          ? [[filter.field, filter.sort]]
          : [['createdAt', 'desc']],
      transaction,
    });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('sketch_book', 'id', query),
        ],
      };
    }

    const records = await db.sketch_book.findAll({
      attributes: ['id', 'id'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['id', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.id,
    }));
  }
};

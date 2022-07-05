import Sequelize from 'sequelize'

import sequelize from './sequelize.js'

export const Service = sequelize.define('crm-upgrade', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  version: {
    type: Sequelize.STRING
  },
  log: {
    type: Sequelize.STRING
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  data: { // all other data associcated with this user
    type: Sequelize.JSON
  }
})

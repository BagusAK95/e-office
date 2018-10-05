'use strict'

const mongoose = use('Mongoose')
const schema = new mongoose.Schema({
  sender: String,
  originator: String,
  creationDate: Date,
  log: Array,
  modifiedDate: Date,
  fileAttachments: Array,
  date: Date,
  mailId: String,
  ccList: String,
  title: String,
  priority: String,
  classification: String,
  type: String,
  comments: String,
  senderManual: Object,
  receivingOrganizations: Object,
  recipients: Array,
  status: Number,
  readStates: Object
})

module.exports = mongoose.model('letter', schema, 'letter')

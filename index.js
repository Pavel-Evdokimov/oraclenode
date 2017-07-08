'use strict';

var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var json2csv = require ('json2csv');
var js2xmlparser = require('js2xmlparser');

oracledb.getConnection(
  {
    user          : dbConfig.user,
    password      : dbConfig.password,
    connectString : dbConfig.connectString
  },
  function(err, connection)
  {
    if (err) {
      console.error(err.message);
      return;
    }
    connection.execute(
      `SELECT department_id as id, department_name as name FROM departments`,
      {},
      { outFormat: oracledb.OBJECT },
      function(err, result)
      {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        // var result = json2csv({data: result.rows[0], fields: ['ID','NAME']});
        // console.log(result);
        // console.log(result.metaData);
        // console.log(result.rows);
        console.log(js2xmlparser("data_", result.rows[0]));
        doRelease(connection);
      });
});

function doRelease(connection)
{
  connection.release(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}

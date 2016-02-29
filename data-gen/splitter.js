var pg = require('pg');
var fs = require('fs');
var conString = 'postgres://'+ process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@' + process.env.POSTGRES_HOST + '/' + process.env.POSTGRES_DB;

var out = process.env.OUTPUT_FOLDER;
if (!fs.existsSync(out)){
  fs.mkdirSync(out);
}

var variables = [{
  name : 'temp',
  table: 'cru_temp',
  data_fields: ['id_punto', 'temp_mes']
},
{
  name : 'pre',
  table: 'cru_pre',
  data_fields: ['id_punto', 'p_mes']
}];

function processVariable(variable){
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    client.query('SELECT agno,mes from ' +variable.table + ' group by agno,mes ORDER BY agno',function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      var vfolder = out + '/' + variable.name;
      if (!fs.existsSync(vfolder)){
        fs.mkdirSync(vfolder);
      }

      if(err) {
        return console.error('error running query', err);
      }
      
      for (var i=0;i<result.rows.length;i++){
        // create a geojson for each time
        createJSON(variable,result.rows[i])
      }
    });
  });
}

function monthStr(month){
  if (month<10) return '0' + month;
  else return '' + month;
}

function createJSON(v,d){
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT ' +  v.data_fields[1] + ' as v,' + v.data_fields[0] + ' as i from ' 
            + v.table + ' WHERE agno=$1 AND mes=$2 ORDER BY ' + v.data_fields[0], [d.agno,d.mes],function(err, result) {
      done();
      if(err) {
        return console.error('Error running query [' + d.agno + ',' + d.mes + ']', err);
      }
      
      var basefilename = d.agno + monthStr(d.mes),  
        filename = out + '/' + v.name + '/' + basefilename + '.json';

      var data = [];

      for (var i=0;i<result.rows.length;i++){
        data[result.rows[i].i] = parseFloat(result.rows[i].v);
      }

      fs.writeFile(filename, JSON.stringify(data),'utf-8',function (err){
        if(err){
          return  console.error('Error writing file' + filename, err);
        }
        console.log('Created ' + filename);
      });
      
      
    });
  });
}

for (var i=0;i<variables.length;i++){
  processVariable(variables[i]);
}
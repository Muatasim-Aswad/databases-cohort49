//A1: Injection value
//'anything' OR '1'='1';

//################################################

//A2: auto preparation
//.query() handles the preparation in the client side
const [rows, fields] = await conn.execute(
  `SELECT Population FROM ? WHERE Name = ? and Code = ?`,
  [country, name, code],
);

//manual preparation
//multipleStatements: true

const [rows3, fields3] = await conn.query(
  `
  PREPARE my_query FROM
    'SELECT Population 
    FROM ${mysql.escapeId(country)} 
    WHERE Name = ? and Code = ?';
  
  SET @name = ${mysql.escape(name)};
  SET @code = ${mysql.escape(code)};

  EXECUTE my_query USING @name, @code;
  `,
);

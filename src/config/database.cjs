module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    port:   5432,
    username: 'admin',
    password: '12345678',
    database: 'burguer-db',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true
    }
}
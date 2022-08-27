const passport = require('passport');
const mydb = require('./db');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {

    try{
        const [rows, fields] = await mydb.query(`Select * from test.users WHERE id = '${jwt_payload.id}' `)

        if(rows[0]){
            return done(null, rows[0]);
        }else{
            return done(null, false);
        }
    }
    catch(err){
        return done(err, false);
    }

}));